#!/usr/bin/env python3
"""
Rewrite problem-illustration step to be minimal and action-oriented.
Move verbose content to optional on-demand sections.
"""

import json
import re
from pathlib import Path

def extract_sections(content):
    """Extract different sections from verbose content."""
    sections = {
        'challenge': '',
        'what_to_build': '',
        'why_matters': '',
        'real_world': '',
        'conceptual': '',
        'how_it_works': '',
        'step_by_step': '',
        'pattern_variations': '',
        'best_practices': '',
        'common_mistakes': '',
        'next_steps': '',
        'summary': '',
        'engaging_questions': ''
    }
    
    # Extract The Challenge section
    challenge_match = re.search(r'\*\*The Challenge:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if challenge_match:
        sections['challenge'] = challenge_match.group(1).strip()
    
    # Extract What We're Building
    what_building_match = re.search(r'\*\*What We\'re Building:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if what_building_match:
        sections['what_to_build'] = what_building_match.group(1).strip()
    
    # Extract Why This Matters
    why_matters_match = re.search(r'\*\*Why This Matters:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if why_matters_match:
        sections['why_matters'] = why_matters_match.group(1).strip()
    
    # Extract Real-World Applications
    real_world_match = re.search(r'\*\*Real-World Applications:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if real_world_match:
        sections['real_world'] = real_world_match.group(1).strip()
    
    # Extract Conceptual Foundation
    conceptual_match = re.search(r'\*\*Conceptual Foundation:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if conceptual_match:
        sections['conceptual'] = conceptual_match.group(1).strip()
    
    # Extract How It Works
    how_works_match = re.search(r'\*\*How It Works:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if how_works_match:
        sections['how_it_works'] = how_works_match.group(1).strip()
    
    # Extract Step-by-Step Example
    step_by_step_match = re.search(r'\*\*Step-by-Step Example:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if step_by_step_match:
        sections['step_by_step'] = step_by_step_match.group(1).strip()
    
    # Extract Pattern Variations
    pattern_match = re.search(r'\*\*Pattern Variations:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if pattern_match:
        sections['pattern_variations'] = pattern_match.group(1).strip()
    
    # Extract Best Practices
    best_practices_match = re.search(r'\*\*Best Practices:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if best_practices_match:
        sections['best_practices'] = best_practices_match.group(1).strip()
    
    # Extract Common Mistakes
    mistakes_match = re.search(r'\*\*Common Mistakes and How to Avoid Them:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if mistakes_match:
        sections['common_mistakes'] = mistakes_match.group(1).strip()
    
    # Extract Next Steps
    next_steps_match = re.search(r'\*\*Next Steps After This Lesson:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if next_steps_match:
        sections['next_steps'] = next_steps_match.group(1).strip()
    
    # Extract Summary
    summary_match = re.search(r'\*\*Summary:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if summary_match:
        sections['summary'] = summary_match.group(1).strip()
    
    # Extract Engaging Questions
    questions_match = re.search(r'\*\*Engaging Questions to Consider:\*\*\s*\n(.*?)(?=\*\*|$)', content, re.DOTALL)
    if questions_match:
        sections['engaging_questions'] = questions_match.group(1).strip()
    
    return sections

def create_minimal_content(challenge_text, example_code, title):
    """Create minimal, action-oriented default view."""
    # Clean up challenge text - remove code comments if they're in the challenge
    challenge_clean = challenge_text.strip()
    
    # Create minimal default view
    minimal = f"**The Challenge:**\n\n{challenge_clean}"
    
    # Add clear action statement
    if 'component' in title.lower():
        minimal += "\n\n**What to Build:**\nCreate a React functional component that implements the requirements above."
    elif 'hook' in title.lower():
        minimal += "\n\n**What to Build:**\nCreate a custom React hook that implements the requirements above."
    elif 'form' in title.lower():
        minimal += "\n\n**What to Build:**\nCreate a React form component that implements the requirements above."
    else:
        minimal += "\n\n**What to Build:**\nImplement the solution according to the requirements above."
    
    return minimal

def create_optional_sections(sections):
    """Create optional on-demand sections."""
    optional = []
    
    if sections.get('why_matters'):
        optional.append(f"**Why This Matters:**\n\n{sections['why_matters']}")
    
    if sections.get('real_world'):
        optional.append(f"**Real-World Examples:**\n\n{sections['real_world']}")
    
    if sections.get('conceptual'):
        # Simplify conceptual foundation
        conceptual_clean = sections['conceptual']
        # Remove all-caps headers
        conceptual_clean = re.sub(r'UNDERSTANDING [A-Z_]+:\s*\n\s*\n', '', conceptual_clean)
        if conceptual_clean.strip():
            optional.append(f"**Conceptual Foundation:**\n\n{conceptual_clean}")
    
    if sections.get('how_it_works'):
        optional.append(f"**How It Works:**\n\n{sections['how_it_works']}")
    
    if sections.get('pattern_variations'):
        optional.append(f"**Pattern Variations:**\n\n{sections['pattern_variations']}")
    
    if sections.get('best_practices'):
        optional.append(f"**Best Practices:**\n\n{sections['best_practices']}")
    
    if sections.get('common_mistakes'):
        optional.append(f"**Common Mistakes:**\n\n{sections['common_mistakes']}")
    
    if sections.get('next_steps'):
        optional.append(f"**What's Next:**\n\n{sections['next_steps']}")
    
    return optional

def rewrite_problem_illustration(content, title, example):
    """Rewrite problem-illustration to be minimal with optional sections."""
    if not content:
        return content
    
    # Extract sections
    sections = extract_sections(content)
    
    # Get challenge text (the code requirements)
    challenge_text = sections.get('challenge', '')
    if not challenge_text:
        # Try to extract from example if challenge not found
        challenge_text = example if example else "Implement the solution according to the requirements."
    
    # Create minimal default view
    minimal_content = create_minimal_content(challenge_text, example, title)
    
    # Create optional sections
    optional_sections = create_optional_sections(sections)
    
    # Combine with clear separator
    if optional_sections:
        optional_text = "\n\n---\n\n**Need Help?** (Click to expand)\n\n" + "\n\n".join(optional_sections)
        return minimal_content + optional_text
    else:
        return minimal_content

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
                example = step.get('example', '')
                
                rewritten = rewrite_problem_illustration(original, title, example)
                
                if original != rewritten:
                    step['mentorSays'] = rewritten
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

