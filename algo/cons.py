import os
import sys

def is_text_file(filename):
    return filename.lower().endswith(('.txt', '.json', '.md'))

def main():
    if len(sys.argv) != 2:
        print("Usage: python cons.py <number_of_output_files>")
        sys.exit(1)

    try:
        num_outputs = int(sys.argv[1])
        if num_outputs <= 0:
            raise ValueError
    except ValueError:
        print("Error: number_of_output_files must be a positive integer")
        sys.exit(1)

    current_dir = os.getcwd()

    # Collect text-based files (exclude previously consolidated files)
    files = sorted([
        f for f in os.listdir(current_dir)
        if os.path.isfile(f)
        and is_text_file(f)
        and not f.startswith("consolidated_")
    ])

    if not files:
        print("No text-based files found.")
        sys.exit(0)

    total_files = len(files)
    chunk_size = (total_files + num_outputs - 1) // num_outputs

    print(f"Found {total_files} files")
    print(f"Creating {num_outputs} consolidated files")
    print(f"~{chunk_size} files per output\n")

    for i in range(num_outputs):
        start = i * chunk_size
        end = start + chunk_size
        chunk = files[start:end]

        if not chunk:
            break

        output_name = f"consolidated_{i + 1}.txt"

        with open(output_name, "w", encoding="utf-8") as out:
            for filename in chunk:
                out.write(f"\n{'=' * 80}\n")
                out.write(f"FILE: {filename}\n")
                out.write(f"{'=' * 80}\n\n")

                with open(filename, "r", encoding="utf-8", errors="ignore") as f:
                    out.write(f.read())
                    out.write("\n")

        print(f"✅ Created {output_name} ({len(chunk)} files)")

    print("\nDone.")

if __name__ == "__main__":
    main()
