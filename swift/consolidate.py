#!/usr/bin/env python3
"""
Consolidate Text Files Script

Usage:
    python consolidate.py <num_parts>
    
Example:
    python consolidate.py 3
    
This will consolidate all text-based files in the current directory 
into 3 parts (1.txt, 2.txt, 3.txt)
"""

import os
import sys
import glob
from pathlib import Path
from typing import List

# Text-based file extensions to include
TEXT_EXTENSIONS = {
    '.md', '.txt', '.py', '.js', '.ts', '.tsx', '.jsx',
    '.json', '.yaml', '.yml', '.xml', '.html', '.css',
    '.scss', '.sass', '.less', '.java', '.c', '.cpp',
    '.h', '.hpp', '.go', '.rs', '.rb', '.php', '.sh',
    '.bash', '.zsh', '.fish', '.ps1', '.bat', '.cmd',
    '.sql', '.graphql', '.prisma', '.env', '.gitignore',
    '.toml', '.ini', '.cfg', '.conf', '.csv', '.tsv'
}


def is_text_file(filepath: Path) -> bool:
    """Check if file is a text-based file."""
    return filepath.suffix.lower() in TEXT_EXTENSIONS


def get_all_text_files(directory: Path) -> List[Path]:
    """
    Recursively get all text-based files from directory.
    
    Args:
        directory: Root directory to search
        
    Returns:
        List of Path objects for text files
    """
    text_files = []
    
    for root, dirs, files in os.walk(directory):
        # Skip common non-source directories
        dirs[:] = [d for d in dirs if d not in {
            'node_modules', '.git', '__pycache__', 'venv', 
            'env', '.venv', 'dist', 'build', '.next', '.cache'
        }]
        
        for file in files:
            filepath = Path(root) / file
            if is_text_file(filepath):
                text_files.append(filepath)
    
    return sorted(text_files)  # Sort for consistent ordering


def read_file_content(filepath: Path) -> str:
    """
    Read file content safely.
    
    Args:
        filepath: Path to file
        
    Returns:
        File content as string
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        # Try with latin-1 encoding as fallback
        try:
            with open(filepath, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            return f"[ERROR: Could not read file - {str(e)}]"
    except Exception as e:
        return f"[ERROR: {str(e)}]"


def split_into_parts(items: List, num_parts: int) -> List[List]:
    """
    Split list into N roughly equal parts.
    
    Args:
        items: List to split
        num_parts: Number of parts to create
        
    Returns:
        List of lists (parts)
    """
    if num_parts <= 0:
        raise ValueError("Number of parts must be positive")
    
    if num_parts > len(items):
        num_parts = len(items)
    
    avg = len(items) // num_parts
    remainder = len(items) % num_parts
    
    parts = []
    start = 0
    
    for i in range(num_parts):
        # Distribute remainder across first parts
        end = start + avg + (1 if i < remainder else 0)
        parts.append(items[start:end])
        start = end
    
    return parts


def consolidate_files(files: List[Path], output_file: str, base_dir: Path):
    """
    Consolidate multiple files into one output file.
    
    Args:
        files: List of file paths to consolidate
        output_file: Output filename
        base_dir: Base directory for relative paths
    """
    with open(output_file, 'w', encoding='utf-8') as out:
        for i, filepath in enumerate(files, 1):
            # Get absolute path
            abs_path = filepath.resolve()
            
            # Write file header
            out.write(f"{abs_path}:\n")
            
            # Read and write content
            content = read_file_content(filepath)
            out.write(content)
            
            # Add separator between files (but not after last file)
            if i < len(files):
                out.write("\n\n" + "="*80 + "\n\n")
        
        # Add summary at the end
        out.write("\n\n" + "="*80 + "\n")
        out.write(f"CONSOLIDATED {len(files)} FILES\n")
        out.write("="*80 + "\n")


def main():
    """Main function."""
    # Check command-line arguments
    if len(sys.argv) != 2:
        print("Usage: python consolidate.py <num_parts>")
        print("Example: python consolidate.py 3")
        sys.exit(1)
    
    try:
        num_parts = int(sys.argv[1])
        if num_parts <= 0:
            raise ValueError("Number of parts must be positive")
    except ValueError as e:
        print(f"Error: Invalid number of parts - {e}")
        print("Please provide a positive integer")
        sys.exit(1)
    
    # Get current directory
    current_dir = Path.cwd()
    print(f"📂 Scanning directory: {current_dir}")
    print(f"🔢 Target parts: {num_parts}")
    print()
    
    # Find all text files
    print("🔍 Finding text-based files...")
    text_files = get_all_text_files(current_dir)
    
    if not text_files:
        print("❌ No text-based files found!")
        sys.exit(1)
    
    print(f"✅ Found {len(text_files)} text-based files")
    print()
    
    # Show file types breakdown
    extensions = {}
    for f in text_files:
        ext = f.suffix.lower() or '(no extension)'
        extensions[ext] = extensions.get(ext, 0) + 1
    
    print("📊 File types:")
    for ext, count in sorted(extensions.items(), key=lambda x: -x[1]):
        print(f"   {ext}: {count} files")
    print()
    
    # Split into parts
    print(f"✂️  Splitting into {num_parts} parts...")
    parts = split_into_parts(text_files, num_parts)
    
    # Show distribution
    print("📦 Distribution:")
    for i, part in enumerate(parts, 1):
        print(f"   Part {i}: {len(part)} files")
    print()
    
    # Consolidate each part
    print("💾 Consolidating files...")
    for i, part in enumerate(parts, 1):
        output_filename = f"{i}.txt"
        print(f"   Creating {output_filename}... ", end='', flush=True)
        
        consolidate_files(part, output_filename, current_dir)
        
        # Get file size
        size_bytes = os.path.getsize(output_filename)
        size_kb = size_bytes / 1024
        size_mb = size_kb / 1024
        
        if size_mb >= 1:
            size_str = f"{size_mb:.2f} MB"
        else:
            size_str = f"{size_kb:.2f} KB"
        
        print(f"✅ ({len(part)} files, {size_str})")
    
    print()
    print("🎉 Consolidation complete!")
    print()
    print("📄 Output files:")
    for i in range(1, len(parts) + 1):
        print(f"   {i}.txt")
    print()
    print("💡 Tip: You can now upload these files to Claude or other LLMs!")


if __name__ == "__main__":
    main()
