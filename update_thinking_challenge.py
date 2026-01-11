#!/usr/bin/env python3
"""
Update all challenge JSON files with the new generic thinking-challenge template.
This script makes the thinking-challenge step technology-agnostic and adds descriptions.
"""

import json
import os
from pathlib import Path

# Technology-specific terminology mapping
TERMINOLOGY = {
    'react': {
        'item': 'component',
        'Item': 'Component',
        'basics': 'JSX and components'
    },
    'react-typescript': {
        'item': 'component',
        'Item': 'Component',
        'basics': 'TypeScript, JSX and components'
    },
    'angular': {
        'item': 'component',
        'Item': 'Component',
        'basics': 'Angular components and TypeScript'
    },
    'nodejs': {
        'item': 'implementation',
        'Item': 'Implementation',
        'basics': 'Node.js and Express basics'
    },
    'python': {
        'item': 'implementation',
        'Item': 'Implementation',
        'basics': 'Python basics'
    },
    'java': {
        'item': 'implementation',
        'Item': 'Implementation',
        'basics': 'Java and Spring Boot basics'
    },
    'go': {
        'item': 'implementation',
        'Item': 'Implementation',
        'basics': 'Go basics'
    },
    'swift': {
        'item': 'component',
        'Item': 'Component',
        'basics': 'SwiftUI and Swift basics'
    }
}

def get_challenge_title(challenge_data):
    """Extract challenge title from JSON, fallback to ID if not found."""
    return challenge_data.get('title', challenge_data.get('id', 'this challenge'))

def update_thinking_challenge_step(challenge_data, domain):
    """Update the thinking-challenge step with generic template."""
    if 'flow' not in challenge_data:
        return False
    
    # Find the thinking-challenge step
    thinking_step_idx = None
    for idx, step in enumerate(challenge_data['flow']):
        if step.get('stepId') == 'thinking-challenge':
            thinking_step_idx = idx
            break
    
    if thinking_step_idx is None:
        return False
    
    # Get terminology for this domain
    terms = TERMINOLOGY.get(domain, TERMINOLOGY['nodejs'])
    challenge_title = get_challenge_title(challenge_data)
    
    # Create new thinking-challenge step
    new_step = {
        "stepId": "thinking-challenge",
        "mentorSays": f"**How would you like to build this {terms['item']}?**\n\nChoose how you want to start implementing the {challenge_title}:",
        "choices": [
            {
                "label": "Build it step by step",
                "description": f"Write the {terms['item']} incrementally and run it as we go.",
                "next": "explore-approach-1"
            },
            {
                "label": f"Show me the full {terms['item']} first",
                "description": "See a complete working example, then break it down.",
                "next": "explore-optimal"
            },
            {
                "label": "Remind me of the basics before I start",
                "description": f"Quick recap of {terms['basics']}, then we code.",
                "next": "basics-recap"
            }
        ]
    }
    
    challenge_data['flow'][thinking_step_idx] = new_step
    return True

def process_challenge_file(file_path, domain):
    """Process a single challenge JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            challenge_data = json.load(f)
        
        updated = update_thinking_challenge_step(challenge_data, domain)
        
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
            if process_challenge_file(json_file, domain):
                updated_files += 1
                print(f"  Updated: {json_file.name}")
            else:
                print(f"  Skipped (no thinking-challenge step): {json_file.name}")
    
    print(f"\nDone! Updated {updated_files} out of {total_files} files.")

if __name__ == '__main__':
    main()

