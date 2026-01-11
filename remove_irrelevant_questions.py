#!/usr/bin/env python3
"""
Remove irrelevant "Have you ever needed to..." questions from challenge JSON files.
These questions add no value and should be removed.
"""

import json
import os
import re
from pathlib import Path

def clean_problem_illustration(content, title):
    """Remove irrelevant questions and improve the problem-illustration step."""
    if not content:
        return content
    
    # Remove "Have you ever needed to implement..." questions
    patterns_to_remove = [
        r'Have you ever needed to implement .+?\?\s*\n\s*\n',
        r'Have you ever needed to .+?\?\s*\n\s*\n',
    ]
    
    cleaned = content
    for pattern in patterns_to_remove:
        cleaned = re.sub(pattern, '', cleaned, flags=re.IGNORECASE | re.MULTILINE)
    
    # If the content starts with "**The Challenge:**" after cleaning, that's good
    # If it starts with something else, ensure it flows well
    
    # Remove any double newlines at the start
    cleaned = cleaned.lstrip('\n')
    
    # Ensure it starts with "**The Challenge:**" if it doesn't already
    if not cleaned.startswith('**The Challenge:**'):
        # Check if "The Challenge:" exists somewhere
        if '**The Challenge:**' in cleaned:
            # It's already there, just clean up
            pass
        else:
            # Add it if missing
            if cleaned.strip():
                cleaned = f'**The Challenge:**\n\n{cleaned}'
    
    return cleaned

def update_challenge_file(file_path, domain):
    """Update problem-illustration step in a challenge JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            challenge_data = json.load(f)
        
        if 'flow' not in challenge_data:
            return False
        
        updated = False
        title = challenge_data.get('title', '')
        
        # Find and update the problem-illustration step
        for step in challenge_data['flow']:
            if step.get('stepId') == 'problem-illustration' and 'mentorSays' in step:
                original = step['mentorSays']
                cleaned = clean_problem_illustration(original, title)
                
                if original != cleaned:
                    step['mentorSays'] = cleaned
                    updated = True
        
        if updated:
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(challenge_data, f, indent=2, ensure_ascii=False)
            return True
        
        return False
    except Exception as e:
        print(f"Error processing {file_path}: {e}")
        return False

def main():
    """Main function to update all challenge files."""
    base_dir = Path(__file__).parent
    domains = ['react', 'nodejs', 'python', 'java', 'go', 'swift', 'angular', 'react-typescript']
    
    total_files = 0
    updated_files = 0
    
    for domain in domains:
        domain_path = base_dir / domain
        if not domain_path.exists():
            print(f"WARNING: Domain directory not found: {domain}")
            continue
        
        print(f"\nProcessing {domain}...")
        json_files = list(domain_path.glob('*.json'))
        
        for json_file in json_files:
            total_files += 1
            if update_challenge_file(json_file, domain):
                updated_files += 1
                print(f"  Updated: {json_file.name}")
    
    print(f"\nDone! Updated {updated_files} out of {total_files} files.")

if __name__ == '__main__':
    main()

