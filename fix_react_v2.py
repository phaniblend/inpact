# -*- coding: utf-8 -*-
"""
Fix React Lessons - Remove broken language-selection (v2)
==========================================================
Fixes React lessons that have language-selection pointing to
non-existent variable-check-js/ts/python steps.

Usage:
    python fix_react_v2.py           # Dry run (preview)
    python fix_react_v2.py --apply   # Apply fixes
"""

import json
import os
import sys
import glob


def fix_lesson(filepath, apply=False):
    """Fix a single lesson file."""
    
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            lesson = json.load(f)
    except Exception as e:
        return False, [f"PARSE ERROR: {e}"]
    
    flow = lesson.get('flow', [])
    fixed = False
    fix_details = []
    
    for i, step in enumerate(flow):
        if step.get('stepId') == 'language-selection':
            choices = step.get('choices', [])
            
            # Check if choices point to broken variable-check steps
            has_broken = any(
                c.get('next', '').startswith('variable-check') 
                for c in choices
            )
            
            if has_broken and choices:
                # Find next valid step in flow
                step_ids = set(s.get('stepId') for s in flow if s.get('stepId'))
                
                next_valid = None
                # Look for common next steps
                for candidate in ['component-check', 'jsx-check', 'hooks-check', 
                                  'coding-start', 'explore-optimal', 'solution-approach']:
                    if candidate in step_ids:
                        next_valid = candidate
                        break
                
                # If not found, use next step in flow
                if not next_valid:
                    for j in range(i + 1, len(flow)):
                        sid = flow[j].get('stepId', '')
                        if sid and not sid.startswith('variable-check'):
                            next_valid = sid
                            break
                
                if next_valid:
                    step['mentorSays'] = "Great! Now let's code this solution in React with JavaScript/JSX."
                    step['action'] = 'continue'
                    step['next'] = next_valid
                    if 'choices' in step:
                        del step['choices']
                    
                    fixed = True
                    fix_details.append(f"language-selection -> {next_valid}")
    
    if fixed and apply:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(lesson, f, indent=2, ensure_ascii=False)
    
    return fixed, fix_details


def main():
    apply = '--apply' in sys.argv
    
    print("=" * 60)
    print("Fix React Lessons v2 - Broken Language Selection")
    print("=" * 60)
    print(f"Mode: {'APPLY FIXES' if apply else 'DRY RUN'}")
    print()
    
    react_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'react')
    
    if not os.path.exists(react_dir):
        print(f"Error: {react_dir} not found")
        sys.exit(1)
    
    files = glob.glob(os.path.join(react_dir, '*.json'))
    print(f"Found {len(files)} files")
    print()
    
    fixed_count = 0
    error_count = 0
    
    for filepath in sorted(files):
        filename = os.path.basename(filepath)
        fixed, details = fix_lesson(filepath, apply=apply)
        
        if details and details[0].startswith('PARSE ERROR'):
            print(f"  ERROR: {filename}")
            print(f"         {details[0]}")
            error_count += 1
        elif fixed:
            fixed_count += 1
            status = "FIXED" if apply else "WOULD FIX"
            print(f"  {status}: {filename} -> {details[0]}")
    
    print()
    print("=" * 60)
    print(f"Files {'fixed' if apply else 'to fix'}: {fixed_count}")
    print(f"Parse errors (need manual fix): {error_count}")
    
    if not apply and fixed_count > 0:
        print()
        print("Run with --apply to fix:")
        print("  python fix_react_v2.py --apply")


if __name__ == "__main__":
    main()
