#!/usr/bin/env python3
"""
Generate a comprehensive list of all challenges grouped by technology.
"""

import json
import re
from pathlib import Path
from collections import defaultdict

def extract_challenge_description(mentor_says):
    """Extract the challenge description from mentorSays."""
    if not mentor_says:
        return "No description available"
    
    # Extract The Challenge section
    challenge_match = re.search(r'\*\*The Challenge:\*\*\s*\n(.*?)(?=\*\*|$)', mentor_says, re.DOTALL)
    if challenge_match:
        challenge_text = challenge_match.group(1).strip()
        # Clean up code comments and format
        challenge_text = re.sub(r'^//\s*', '', challenge_text, flags=re.MULTILINE)
        challenge_text = re.sub(r'\n\s*\n', '\n', challenge_text)
        return challenge_text[:500]  # Limit length
    
    # Fallback: get first paragraph
    first_para = mentor_says.split('\n\n')[0] if mentor_says else ""
    return first_para[:200] if first_para else "No description available"

def get_challenge_info(file_path):
    """Extract challenge information from JSON file."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        challenge_id = data.get('id', file_path.stem)
        title = data.get('title', challenge_id)
        difficulty = data.get('difficulty', 'N/A')
        time_estimate = data.get('metadata', {}).get('time_estimate', 'N/A')
        tests = data.get('metadata', {}).get('tests', 'N/A')
        
        # Get description from problem-illustration step
        description = "No description available"
        if 'flow' in data:
            for step in data['flow']:
                if step.get('stepId') == 'problem-illustration':
                    description = extract_challenge_description(step.get('mentorSays', ''))
                    break
        
        return {
            'id': challenge_id,
            'title': title,
            'difficulty': difficulty,
            'time_estimate': time_estimate,
            'tests': tests,
            'description': description
        }
    except Exception as e:
        return None

def main():
    """Generate challenge list grouped by technology."""
    base_dir = Path(__file__).parent
    domains = {
        'react': 'React',
        'react-typescript': 'React TypeScript',
        'angular': 'Angular',
        'nodejs': 'Node.js',
        'python': 'Python',
        'java': 'Java',
        'go': 'Go',
        'swift': 'Swift'
    }
    
    all_challenges = defaultdict(list)
    
    for domain, tech_name in domains.items():
        domain_path = base_dir / domain
        if not domain_path.exists():
            continue
        
        print(f"Processing {tech_name}...")
        json_files = sorted(domain_path.glob('*.json'))
        
        for json_file in json_files:
            info = get_challenge_info(json_file)
            if info:
                all_challenges[tech_name].append(info)
    
    # Generate markdown output
    output = []
    output.append("# Complete Challenge List by Technology\n")
    output.append("This document lists all coding challenges available in the platform, grouped by technology.\n")
    
    total_challenges = 0
    
    for tech_name in sorted(all_challenges.keys()):
        challenges = sorted(all_challenges[tech_name], key=lambda x: x['id'])
        total_challenges += len(challenges)
        
        output.append(f"\n## {tech_name} ({len(challenges)} challenges)\n")
        output.append("---\n")
        
        for i, challenge in enumerate(challenges, 1):
            output.append(f"\n### {i}. {challenge['title']}\n")
            output.append(f"**ID:** `{challenge['id']}`  \n")
            output.append(f"**Difficulty:** {challenge['difficulty']}  \n")
            output.append(f"**Time Estimate:** {challenge['time_estimate']}  \n")
            output.append(f"**Tests:** {challenge['tests']}  \n")
            output.append(f"\n**Description:**\n```\n{challenge['description']}\n```\n")
            output.append("---\n")
    
    output.append(f"\n\n## Summary\n")
    output.append(f"**Total Challenges:** {total_challenges}\n\n")
    for tech_name in sorted(all_challenges.keys()):
        output.append(f"- **{tech_name}:** {len(all_challenges[tech_name])} challenges\n")
    
    # Write to file
    output_file = base_dir / 'CHALLENGE_LIST.md'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(''.join(output))
    
    print(f"\nGenerated challenge list with {total_challenges} challenges")
    print(f"Output saved to: {output_file}")
    
    # Also print summary to console
    print("\n" + "="*60)
    print("CHALLENGE SUMMARY")
    print("="*60)
    for tech_name in sorted(all_challenges.keys()):
        print(f"{tech_name:20} {len(all_challenges[tech_name]):4} challenges")
    print("="*60)
    print(f"{'TOTAL':20} {total_challenges:4} challenges")

if __name__ == '__main__':
    main()

