# -*- coding: utf-8 -*-
"""
Fix React Lessons - Remove broken language-selection
=====================================================
Fixes 57 React lessons that have language-selection pointing to
non-existent variable-check-js/ts/python steps.

Fix: Change language-selection to go directly to the next valid step
(typically component-check or the first coding step).

Usage:
    python fix_react_lessons.py           # Dry run (preview changes)
    python fix_react_lessons.py --apply   # Apply fixes
"""

import json
import os
import sys
import glob


def find_next_valid_step(flow, current_idx):
    """Find the next valid step after language-selection."""
    step_ids = set(s.get('stepId') for s in flow if s.get('stepId'))
    
    # Look for common next steps after language-selection
    preferred_nexts = [
        'component-check',
        'jsx-check', 
        'hooks-check',
        'coding-start',
        'coding-setup',
        'solution-approach',
        'explore-optimal'
    ]
    
    for pref in preferred_nexts:
        if pref in step_ids:
            return pref
    
    # If none found, look at what comes after language-selection in the flow
    for i in range(current_idx + 1, len(flow)):
        next_step_id = flow[i].get('stepId')
        if next_step_id and not next_step_id.startswith('variable-check'):
            return next_step_id
    
    return None


def fix_lesson(filepath, apply=False):
    """Fix a single lesson file."""
    
    with open(filepath, 'r', encoding='utf-8') as f:
        lesson = json.load(f)
    
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
            
            if has_broken:
                # Find the next valid step
                next_valid = find_next_valid_step(flow, i)
                
                if next_valid:
                    # Convert from choices to direct continue
                    old_choices = [f"{c.get('label')}->{c.get('next')}" for c in choices]
                    
                    step['mentorSays'] = "Great! Now let's code this solution in React with JavaScript/JSX."
                    step['action'] = 'continue'
                    step['next'] = next_valid
                    
                    # Remove choices since we're now using direct continue
                    if 'choices' in step:
                        del step['choices']
                    
                    fixed = True
                    fix_details.append(f"language-selection: removed choices, now continues to '{next_valid}'")
    
    if fixed and apply:
        with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
            json.dump(lesson, f, indent=2, ensure_ascii=False)
    
    return fixed, fix_details


def main():
    apply = '--apply' in sys.argv
    
    print("=" * 60)
    print("Fix React Lessons - Broken Language Selection")
    print("=" * 60)
    print(f"Mode: {'APPLY FIXES' if apply else 'DRY RUN (preview only)'}")
    print()
    
    # Find all React lesson files
    react_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'react')
    
    if not os.path.exists(react_dir):
        print(f"Error: React directory not found: {react_dir}")
        sys.exit(1)
    
    pattern = os.path.join(react_dir, '*.json')
    files = glob.glob(pattern)
    
    print(f"Found {len(files)} React lesson files")
    print()
    
    fixed_count = 0
    fixed_files = []
    
    for filepath in sorted(files):
        filename = os.path.basename(filepath)
        
        try:
            fixed, details = fix_lesson(filepath, apply=apply)
            
            if fixed:
                fixed_count += 1
                fixed_files.append(filename)
                status = "FIXED" if apply else "WOULD FIX"
                print(f"  {status}: {filename}")
                for detail in details:
                    print(f"         {detail}")
        
        except Exception as e:
            print(f"  ERROR: {filename} - {e}")
    
    print()
    print("=" * 60)
    print("SUMMARY")
    print("=" * 60)
    print(f"Total files scanned: {len(files)}")
    print(f"Files {'fixed' if apply else 'to fix'}: {fixed_count}")
    
    if not apply and fixed_count > 0:
        print()
        print("To apply fixes, run:")
        print("  python fix_react_lessons.py --apply")
    elif apply and fixed_count > 0:
        print()
        print("Fixes applied successfully!")
        print("Review changes with: git diff react/")


if __name__ == "__main__":
    main()
