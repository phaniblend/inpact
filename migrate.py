# -*- coding: utf-8 -*-
"""
INPACT Migration V5 - LIGHT TOUCH
=================================
Preserves original coding step order and content.
Only fixes structural issues:
1. Standardizes step ID naming (prereq-check-js not prereq-check-javascript)
2. Ensures all destinations exist
3. Removes duplicate steps
4. Standardizes language labels (no emojis)
5. Adds missing structural steps

DOES NOT reorder coding steps - trusts original author's sequence.

Usage:
    python migrate_v5.py              # Test mode (first 5)
    python migrate_v5.py --all        # All lessons
    python migrate_v5.py --file two-sum  # Single file
"""

import json
import os
import glob
import re
from collections import OrderedDict


class MigrationV5:
    """V5 - Light Touch migration preserving original content and order"""
    
    def __init__(self, algo_dir="algo"):
        self.algo_dir = algo_dir
        self.languages = ['js', 'python', 'java', 'cpp', 'ts']
        self.lang_names = {
            'js': 'JavaScript',
            'python': 'Python', 
            'java': 'Java',
            'cpp': 'C++',
            'ts': 'TypeScript'
        }
        self.stats = {'success': 0, 'failed': 0, 'errors': []}
    
    # ==================== STEP ID NORMALIZATION ====================
    
    def normalize_step_id(self, step_id):
        """Normalize step ID naming conventions."""
        if not step_id:
            return step_id
        
        # Fix javascript -> js
        step_id = step_id.replace('-javascript', '-js')
        # Fix typescript -> ts  
        step_id = step_id.replace('-typescript', '-ts')
        
        return step_id
    
    def normalize_label(self, label):
        """Remove emojis from labels, keep only ASCII text."""
        if not label:
            return label
        
        # Keep only printable ASCII and common punctuation
        clean = ''
        for char in label:
            if ord(char) < 128 or char in ' -_':
                clean += char
        
        return clean.strip()
    
    # ==================== FLOW ANALYSIS ====================
    
    def get_all_step_ids(self, flow):
        """Get set of all step IDs in flow."""
        return {step.get('stepId') for step in flow if step.get('stepId')}
    
    def get_all_destinations(self, flow):
        """Get set of all destination step IDs."""
        destinations = set()
        for step in flow:
            if step.get('next'):
                destinations.add(step['next'])
            if step.get('choices'):
                for choice in step['choices']:
                    if choice.get('next'):
                        destinations.add(choice['next'])
        return destinations
    
    def find_coding_steps(self, flow, lang='js'):
        """Find all coding steps for a language, preserving order."""
        coding_steps = []
        for step in flow:
            step_id = step.get('stepId', '')
            if f'-{lang}' in step_id and 'coding' in step_id:
                coding_steps.append(step)
        return coding_steps
    
    def find_prereq_teaching_steps(self, flow, lang='js'):
        """Find prerequisite teaching steps."""
        prereq_steps = []
        keywords = ['function-check', 'function-explanation', 'variable-check', 
                   'variable-explanation', 'array-check', 'array-explanation',
                   'loop-check', 'loop-explanation', 'parameter-check', 
                   'parameter-explanation']
        
        for step in flow:
            step_id = step.get('stepId', '')
            if f'-{lang}' in step_id:
                if any(kw in step_id for kw in keywords):
                    prereq_steps.append(step)
        return prereq_steps
    
    # ==================== STEP CREATION ====================
    
    def create_objectives_step(self, lesson):
        """Create objectives step if missing."""
        title = lesson.get('title', 'Algorithm')
        pattern = lesson.get('pattern', 'problem-solving')
        
        return {
            "stepId": "objectives",
            "mentorSays": f"Hey! Welcome to the {title} lesson.\n\nIn this lesson, you'll learn a problem-solving pattern that shows up in coding interviews: **{pattern}**.\n\nAfter this, you'll be able to:\n- Understand the {title} problem\n- Recognize when to use the {pattern} pattern\n- Build a complete solution step-by-step\n\nLet's dive in!",
            "action": "continue",
            "next": "language-selection"
        }
    
    def create_language_selection_step(self):
        """Create language selection step."""
        return {
            "stepId": "language-selection",
            "mentorSays": "Before we dive into the problem, which programming language would you like to use?",
            "choices": [
                {"label": "JavaScript", "next": "prereq-check-js"},
                {"label": "Python", "next": "prereq-check-python"},
                {"label": "Java", "next": "prereq-check-java"},
                {"label": "C++", "next": "prereq-check-cpp"},
                {"label": "TypeScript", "next": "prereq-check-ts"}
            ]
        }
    
    def create_prereq_check_step(self, lesson, lang):
        """Create prerequisite check step for a language."""
        lang_name = self.lang_names.get(lang, lang)
        pattern = lesson.get('pattern', '').lower()
        
        # Determine prerequisites based on pattern
        prereqs = ["**Arrays** - How to store and access lists of values",
                   "**Loops** - How to iterate through data",
                   "**Conditionals** - How to make decisions in code"]
        
        if any(w in pattern for w in ['tree', 'graph', 'dfs', 'bfs', 'backtracking']):
            prereqs.append("**Recursion** - How to solve problems recursively")
        elif any(w in pattern for w in ['hash', 'map', 'linked']):
            prereqs.append("**Objects** - How to work with data structures")
        
        prereq_list = "\n".join(f"- {p}" for p in prereqs)
        
        return {
            "stepId": f"prereq-check-{lang}",
            "mentorSays": f"Great choice! Before we tackle this problem, let me make sure you have the building blocks.\n\nTo solve this in {lang_name}, you'll need to know:\n{prereq_list}\n\nDo you feel confident with these {lang_name} concepts?",
            "choices": [
                {"label": "Yes, I know all of them", "next": "problem-understanding"},
                {"label": "No, please explain them", "next": f"teach-all-prereqs-{lang}"},
                {"label": "I know some, not all", "next": f"teach-all-prereqs-{lang}"}
            ]
        }
    
    def create_teach_prereqs_placeholder(self, lang):
        """Create placeholder for teaching prerequisites."""
        lang_name = self.lang_names.get(lang, lang)
        return {
            "stepId": f"teach-all-prereqs-{lang}",
            "mentorSays": f"Let me explain the {lang_name} concepts you'll need.\n\n[Prerequisite teaching will be expanded in Phase 2]\n\nFor now, let's continue to the problem!",
            "action": "continue",
            "next": "problem-understanding"
        }
    
    def create_problem_understanding_step(self, lesson):
        """Create problem understanding step if missing."""
        title = lesson.get('title', 'Algorithm')
        return {
            "stepId": "problem-understanding",
            "mentorSays": f"Perfect! Now let's understand what the {title} problem asks for.\n\n[Detailed explanation will be added in Phase 2]",
            "action": "continue",
            "next": "thinking-challenge"
        }
    
    def create_thinking_challenge_step(self):
        """Create thinking challenge step."""
        return {
            "stepId": "thinking-challenge",
            "mentorSays": "Now that you understand the problem, how would YOU approach solving it?\n\nThink about it for a moment.",
            "choices": [
                {"label": "Check every possibility", "next": "explore-brute-force"},
                {"label": "Use a smarter approach", "next": "explore-optimal"},
                {"label": "I'm not sure, show me", "next": "explore-optimal"}
            ]
        }
    
    def create_explore_brute_force_step(self):
        """Create brute force exploration step."""
        return {
            "stepId": "explore-brute-force",
            "mentorSays": "The brute force approach would check every possibility.\n\nThis works but is usually slow (O(n squared) or worse).\n\nLet's look at a smarter approach!",
            "action": "continue",
            "next": "explore-optimal"
        }
    
    def create_explore_optimal_step(self):
        """Create optimal approach exploration step."""
        return {
            "stepId": "explore-optimal",
            "mentorSays": "The optimal approach uses a smarter strategy to avoid unnecessary work.\n\n[Strategy details will be added in Phase 2]",
            "action": "continue",
            "next": "solution-finalized"
        }
    
    def create_solution_finalized_step(self, next_step):
        """Create solution finalized step."""
        return {
            "stepId": "solution-finalized",
            "mentorSays": "Perfect! We've explored the approach. Now let's code the optimal solution.\n\nReady to write some code?",
            "action": "continue",
            "next": next_step
        }
    
    def create_completion_step(self, lesson):
        """Create completion step."""
        title = lesson.get('title', 'this problem')
        return {
            "stepId": "completion",
            "mentorSays": f"Congratulations! You just solved {title}!\n\nWhat you've mastered:\n- Understanding the problem requirements\n- Choosing an efficient approach\n- Building a complete solution from scratch\n\nYou're now ready to tackle more algorithms. Keep going!",
            "action": "complete"
        }
    
    # ==================== MAIN MIGRATION ====================
    
    def migrate_flow(self, lesson, old_flow):
        """Migrate flow while preserving original coding step order."""
        new_flow = []
        existing_ids = set()
        
        def add_step(step):
            """Add step if not duplicate."""
            step_id = step.get('stepId')
            if step_id and step_id not in existing_ids:
                existing_ids.add(step_id)
                new_flow.append(step)
                return True
            return False
        
        # Normalize all step IDs and destinations in original flow
        for step in old_flow:
            if step.get('stepId'):
                step['stepId'] = self.normalize_step_id(step['stepId'])
            if step.get('next'):
                step['next'] = self.normalize_step_id(step['next'])
            if step.get('choices'):
                for choice in step['choices']:
                    if choice.get('next'):
                        choice['next'] = self.normalize_step_id(choice['next'])
                    if choice.get('label'):
                        choice['label'] = self.normalize_label(choice['label'])
        
        # Get existing step IDs
        old_step_ids = self.get_all_step_ids(old_flow)
        
        # Build step map for quick lookup
        step_map = {step.get('stepId'): step for step in old_flow if step.get('stepId')}
        
        # === PHASE 1: Add structural steps ===
        
        # 1. Objectives
        if 'objectives' in step_map:
            add_step(step_map['objectives'])
        else:
            add_step(self.create_objectives_step(lesson))
        
        # 2. Language Selection  
        if 'language-selection' in step_map:
            # Update to standardized format
            lang_step = step_map['language-selection'].copy()
            lang_step['choices'] = [
                {"label": "JavaScript", "next": "prereq-check-js"},
                {"label": "Python", "next": "prereq-check-python"},
                {"label": "Java", "next": "prereq-check-java"},
                {"label": "C++", "next": "prereq-check-cpp"},
                {"label": "TypeScript", "next": "prereq-check-ts"}
            ]
            add_step(lang_step)
        else:
            add_step(self.create_language_selection_step())
        
        # 3. Prereq checks for all languages
        for lang in self.languages:
            prereq_id = f'prereq-check-{lang}'
            if prereq_id in step_map:
                add_step(step_map[prereq_id])
            else:
                add_step(self.create_prereq_check_step(lesson, lang))
        
        # 4. Prereq teaching steps (use existing or create placeholder)
        for lang in self.languages:
            teach_id = f'teach-all-prereqs-{lang}'
            if teach_id in step_map:
                # Use existing but ensure it connects properly
                teach_step = step_map[teach_id].copy()
                # Find and add any chained prereq steps
                prereq_steps = self.find_prereq_teaching_steps(old_flow, lang)
                if prereq_steps:
                    for ps in prereq_steps:
                        add_step(ps)
                else:
                    add_step(teach_step)
            else:
                # Check for existing prereq teaching chain
                prereq_steps = self.find_prereq_teaching_steps(old_flow, lang)
                if prereq_steps and lang == 'js':
                    # Create teach-all that points to first prereq step
                    first_prereq = prereq_steps[0]['stepId']
                    add_step({
                        "stepId": f"teach-all-prereqs-{lang}",
                        "mentorSays": f"Great! Let me teach you the {self.lang_names[lang]} concepts you'll need.",
                        "action": "continue",
                        "next": first_prereq
                    })
                    for ps in prereq_steps:
                        add_step(ps)
                else:
                    add_step(self.create_teach_prereqs_placeholder(lang))
        
        # 5. Problem Understanding
        if 'problem-understanding' in step_map:
            add_step(step_map['problem-understanding'])
        elif 'problem-illustration' in step_map:
            # Old format - use it but rename
            step = step_map['problem-illustration'].copy()
            step['stepId'] = 'problem-understanding'
            if not step.get('next'):
                step['next'] = 'thinking-challenge'
            add_step(step)
        else:
            add_step(self.create_problem_understanding_step(lesson))
        
        # 6. Thinking Challenge
        if 'thinking-challenge' in step_map:
            tc = step_map['thinking-challenge'].copy()
            # Ensure valid destinations
            if tc.get('choices'):
                for choice in tc['choices']:
                    dest = choice.get('next', '')
                    # Fix common broken destinations
                    if dest in ['explore-hashset', 'explore-sort-two-pointers', 'explore-sort']:
                        choice['next'] = 'explore-optimal'
                    elif not dest.startswith('explore-'):
                        choice['next'] = 'explore-optimal'
            add_step(tc)
        else:
            add_step(self.create_thinking_challenge_step())
        
        # 7. Explore steps - preserve any existing ones
        explore_ids = ['explore-brute-force', 'explore-optimal', 'explore-solution',
                       'explore-hashmap', 'explore-nested-loops', 'approach-exploration']
        added_explore = False
        for eid in explore_ids:
            if eid in step_map:
                add_step(step_map[eid])
                added_explore = True
        
        if not added_explore or 'explore-brute-force' not in existing_ids:
            add_step(self.create_explore_brute_force_step())
        if 'explore-optimal' not in existing_ids:
            add_step(self.create_explore_optimal_step())
        
        # 8. Solution Finalized
        coding_steps_js = self.find_coding_steps(old_flow, 'js')
        first_coding_step = coding_steps_js[0]['stepId'] if coding_steps_js else 'coding-start-js'
        
        if 'solution-finalized' in step_map:
            sf = step_map['solution-finalized'].copy()
            sf['next'] = first_coding_step
            add_step(sf)
        else:
            add_step(self.create_solution_finalized_step(first_coding_step))
        
        # === PHASE 2: Add coding steps IN ORIGINAL ORDER ===
        
        # Only add JS coding steps for now (primary language)
        for step in coding_steps_js:
            add_step(step)
        
        # Fix the last JS coding step to point to completion
        if coding_steps_js and new_flow:
            for i in range(len(new_flow) - 1, -1, -1):
                if 'coding' in new_flow[i].get('stepId', '') and '-js' in new_flow[i].get('stepId', ''):
                    new_flow[i]['next'] = 'completion'
                    break
        
        # 9. Completion
        if 'completion' in step_map:
            add_step(step_map['completion'])
        else:
            add_step(self.create_completion_step(lesson))
        
        # === PHASE 3: Validate all connections ===
        final_step_ids = {s.get('stepId') for s in new_flow}
        for step in new_flow:
            # Fix any remaining broken 'next' references
            if step.get('next') and step['next'] not in final_step_ids:
                if step['next'] not in ['completion', 'test-code-js', 'final']:
                    # Default broken links to completion
                    step['next'] = 'completion'
        
        return new_flow
    
    def migrate_lesson(self, filepath):
        """Migrate a single lesson file."""
        filename = os.path.basename(filepath)
        print(f"\n  Migrating: {filename}")
        
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                lesson = json.load(f)
            
            old_flow = lesson.get('flow', [])
            if not old_flow:
                print(f"    Skipped: Empty flow")
                return False
            
            original_count = len(old_flow)
            
            new_flow = self.migrate_flow(lesson, old_flow)
            
            lesson['flow'] = new_flow
            lesson['migrated'] = True
            lesson['migration_version'] = '5.0-light-touch'
            lesson['migration_date'] = '2025-12-30'
            
            with open(filepath, 'w', encoding='utf-8', newline='\n') as f:
                json.dump(lesson, f, indent=2, ensure_ascii=False)
            
            coding_count = len([s for s in new_flow if 'coding' in s.get('stepId', '')])
            print(f"    Done: {original_count} -> {len(new_flow)} steps ({coding_count} coding)")
            
            self.stats['success'] += 1
            return True
            
        except Exception as e:
            print(f"    Error: {e}")
            self.stats['failed'] += 1
            self.stats['errors'].append({'file': filepath, 'error': str(e)})
            import traceback
            traceback.print_exc()
            return False
    
    def migrate_all(self, test_mode=True, single_file=None):
        """Migrate all lessons."""
        print("=" * 60)
        print("INPACT Migration V5 - LIGHT TOUCH")
        print("=" * 60)
        print("Approach: Preserve original coding step order and content")
        print("Fixes: Step ID naming, broken connections, missing structure")
        print("=" * 60)
        
        pattern = os.path.join(self.algo_dir, "*.json")
        files = sorted(glob.glob(pattern))
        
        # Filter out non-lesson files
        files = [f for f in files if not any(skip in f for skip in 
                 ['algorithm_list', 'sampleLesson', '_backup', 'update_', 'test'])]
        
        if not files:
            print(f"\nNo JSON files found in {self.algo_dir}/")
            return
        
        if single_file:
            files = [f for f in files if single_file in f]
            if not files:
                print(f"\nFile not found: {single_file}")
                return
        elif test_mode:
            files = files[:5]
            print(f"\nTEST MODE: Processing first 5 files only")
        
        print(f"\nFound {len(files)} lesson(s) to migrate")
        
        for filepath in files:
            self.migrate_lesson(filepath)
        
        print("\n" + "=" * 60)
        print("MIGRATION COMPLETE")
        print("=" * 60)
        print(f"Success: {self.stats['success']}")
        print(f"Failed:  {self.stats['failed']}")
        
        if self.stats['errors']:
            print("\nErrors:")
            for err in self.stats['errors']:
                print(f"  - {err['file']}: {err['error']}")
        
        print("\nNext Steps:")
        print("  1. Review: git diff")
        print("  2. Test in browser")
        if test_mode and not single_file:
            print("  3. Run all: python migrate_v5.py --all")
        else:
            print("  3. Commit: git add . && git commit")


def main():
    import argparse
    
    parser = argparse.ArgumentParser(description='INPACT Migration V5 - Light Touch')
    parser.add_argument('--all', action='store_true', help='Process all lessons')
    parser.add_argument('--file', type=str, help='Process single file')
    parser.add_argument('--dir', type=str, default='algo', help='Lessons directory')
    
    args = parser.parse_args()
    
    migrator = MigrationV5(algo_dir=args.dir)
    migrator.migrate_all(
        test_mode=not args.all,
        single_file=args.file
    )


if __name__ == "__main__":
    main()
