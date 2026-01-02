# -*- coding: utf-8 -*-
"""
Coding Challenges Lesson Consolidator
=====================================
Crawls through coding challenge lesson directories and consolidates
all JSON lesson files into N text files for review.

Usage:
    python cc_console.py 20
    python cc_console.py 10
    python cc_console.py      # defaults to 20
"""

import os
import sys
import glob
import json

def consolidate_lessons(num_files=20):
    """Consolidate all coding challenge lessons into N text files."""
    
    # Directories to crawl
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    lesson_dirs = [
        os.path.join(base_dir, "angular"),
        os.path.join(base_dir, "go"),
        os.path.join(base_dir, "java"),
        os.path.join(base_dir, "nodejs"),
        os.path.join(base_dir, "python"),
        os.path.join(base_dir, "react"),
        os.path.join(base_dir, "react-typescript"),
    ]
    
    # Output directory
    output_dir = os.path.join(base_dir, "cc_output")
    os.makedirs(output_dir, exist_ok=True)
    
    print("=" * 60)
    print("Coding Challenges Lesson Consolidator")
    print("=" * 60)
    print(f"Output directory: {output_dir}")
    print(f"Number of output files: {num_files}")
    print()
    
    # Collect all JSON files
    all_files = []
    
    for lesson_dir in lesson_dirs:
        if not os.path.exists(lesson_dir):
            print(f"  Skipping (not found): {lesson_dir}")
            continue
        
        # Find all JSON files recursively
        pattern = os.path.join(lesson_dir, "**", "*.json")
        json_files = glob.glob(pattern, recursive=True)
        
        # Filter out non-lesson files
        lesson_files = [f for f in json_files if not any(skip in f.lower() for skip in 
                       ['package.json', 'tsconfig', 'node_modules', '.vscode', 'backup'])]
        
        dir_name = os.path.basename(lesson_dir)
        print(f"  {dir_name}: {len(lesson_files)} lesson files")
        all_files.extend(lesson_files)
    
    print()
    print(f"Total lesson files found: {len(all_files)}")
    print()
    
    if not all_files:
        print("No lesson files found!")
        return
    
    # Sort files for consistent ordering
    all_files.sort()
    
    # Split into N groups
    files_per_group = (len(all_files) + num_files - 1) // num_files
    
    print(f"Files per output file: ~{files_per_group}")
    print()
    print("Generating output files...")
    
    file_idx = 0
    for i in range(num_files):
        output_path = os.path.join(output_dir, f"{i + 1}.txt")
        
        start_idx = i * files_per_group
        end_idx = min(start_idx + files_per_group, len(all_files))
        
        if start_idx >= len(all_files):
            break
        
        group_files = all_files[start_idx:end_idx]
        
        with open(output_path, 'w', encoding='utf-8') as out_f:
            for j, filepath in enumerate(group_files):
                # Write file marker
                out_f.write(f"{filepath}:\n")
                
                try:
                    with open(filepath, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    # Try to parse and re-format JSON for consistency
                    try:
                        data = json.loads(content)
                        out_f.write(json.dumps(data, indent=2, ensure_ascii=False))
                    except json.JSONDecodeError:
                        # If not valid JSON, write raw content
                        out_f.write(content)
                    
                except Exception as e:
                    out_f.write(f"ERROR reading file: {e}\n")
                
                out_f.write("\n\n")
                out_f.write("=" * 80)
                out_f.write("\n\n")
        
        print(f"  {i + 1}.txt: {len(group_files)} files ({os.path.basename(group_files[0])} ... {os.path.basename(group_files[-1])})")
        file_idx = i + 1
    
    print()
    print("=" * 60)
    print(f"DONE! Generated {file_idx} files in {output_dir}")
    print("=" * 60)
    
    # Summary by directory
    print()
    print("Summary by technology:")
    for lesson_dir in lesson_dirs:
        if os.path.exists(lesson_dir):
            dir_name = os.path.basename(lesson_dir)
            count = len([f for f in all_files if lesson_dir in f])
            print(f"  {dir_name}: {count} lessons")


def main():
    # Get number of files from command line argument
    num_files = 20  # default
    
    if len(sys.argv) > 1:
        try:
            num_files = int(sys.argv[1])
            if num_files < 1:
                num_files = 1
            elif num_files > 100:
                num_files = 100
        except ValueError:
            print(f"Invalid argument: {sys.argv[1]}")
            print("Usage: python cc_console.py [num_files]")
            print("  num_files: Number of output files (1-100, default 20)")
            sys.exit(1)
    
    consolidate_lessons(num_files)


if __name__ == "__main__":
    main()