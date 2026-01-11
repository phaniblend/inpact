#!/usr/bin/env python3
"""
Fix technology mismatches in challenge JSON files.
Replaces incorrect technology references (e.g., "Angular" in React files).
"""

import json
import os
from pathlib import Path
import re

# Technology mapping - what should appear in each domain
TECHNOLOGY_MAP = {
    'react': 'React',
    'react-typescript': 'React',
    'angular': 'Angular',
    'nodejs': 'Node.js',
    'python': 'Python',
    'java': 'Java',
    'go': 'Go',
    'swift': 'Swift'
}

# Common incorrect patterns to fix
INCORRECT_PATTERNS = {
    'react': [
        (r'Apply Angular best practices', 'Apply React best practices'),
        (r'Angular best practices', 'React best practices'),
        (r'Angular patterns', 'React patterns'),
        (r'Angular conventions', 'React conventions'),
    ],
    'react-typescript': [
        (r'Apply Angular best practices', 'Apply React best practices'),
        (r'Angular best practices', 'React best practices'),
        (r'Angular patterns', 'React patterns'),
        (r'Angular conventions', 'React conventions'),
    ],
    'angular': [
        (r'Apply React best practices', 'Apply Angular best practices'),
        (r'React best practices', 'Angular best practices'),
        (r'React patterns', 'Angular patterns'),
        (r'React conventions', 'Angular conventions'),
    ],
    'nodejs': [
        (r'Apply (React|Angular) best practices', 'Apply Node.js best practices'),
        (r'(React|Angular) best practices', 'Node.js best practices'),
    ],
    'python': [
        (r'Apply (React|Angular) best practices', 'Apply Python best practices'),
        (r'(React|Angular) best practices', 'Python best practices'),
    ],
    'java': [
        (r'Apply (React|Angular) best practices', 'Apply Java best practices'),
        (r'(React|Angular) best practices', 'Java best practices'),
    ],
    'go': [
        (r'Apply (React|Angular) best practices', 'Apply Go best practices'),
        (r'(React|Angular) best practices', 'Go best practices'),
    ],
    'swift': [
        (r'Apply (React|Angular) best practices', 'Apply Swift best practices'),
        (r'(React|Angular) best practices', 'Swift best practices'),
    ],
}

def fix_technology_references(content, domain):
    """Fix technology references in content string."""
    if domain not in INCORRECT_PATTERNS:
        return content
    
    fixed_content = content
    for pattern, replacement in INCORRECT_PATTERNS[domain]:
        fixed_content = re.sub(pattern, replacement, fixed_content, flags=re.IGNORECASE)
    
    return fixed_content

def process_challenge_file(file_path, domain):
    """Process a single challenge JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            challenge_data = json.load(f)
        
        updated = False
        
        # Fix the "title" step (learning objectives)
        if 'flow' in challenge_data:
            for step in challenge_data['flow']:
                if step.get('stepId') == 'title' and 'mentorSays' in step:
                    original = step['mentorSays']
                    fixed = fix_technology_references(original, domain)
                    if original != fixed:
                        step['mentorSays'] = fixed
                        updated = True
                
                # Also fix any other steps that might have technology references
                if 'mentorSays' in step:
                    original = step['mentorSays']
                    fixed = fix_technology_references(original, domain)
                    if original != fixed:
                        step['mentorSays'] = fixed
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
    """Main function to fix all challenge files."""
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
            if process_challenge_file(json_file, domain):
                updated_files += 1
                print(f"  Fixed: {json_file.name}")
    
    print(f"\nDone! Fixed {updated_files} out of {total_files} files.")

if __name__ == '__main__':
    main()

