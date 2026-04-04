#!/usr/bin/env python3

"""
AiCite
Minimal CLI to reserve the PyPI name and provide a working `uvx aicite setup`.
"""

import os
import sys
import argparse
import shutil
from pathlib import Path

from . import __version__

def print_help():
    help_text = """
aicite - bootstrap AI assistant project context

Usage:
  aicite setup [--force] [--only <targets> | --copilot] [--kilocode] [--cursor] [--docs]
  aicite --help
  aicite --version

Commands:
  setup     Create project assistant files in the current directory

Options:
  --force    Overwrite existing generated files
  --only     Comma-separated targets: copilot,kilocode,cursor,docs (default: all). Note: docs are always generated.
  --copilot  Generate only .github/ (Copilot)
  --kilocode Generate only .kilocode/ (KiloCode)
  --cursor   Generate only .cursor/ and AGENTS.md (Cursor IDE)
  --docs     Generate only docs/
  --version  Show current version
    """.strip()
    print(help_text)

def print_version():
    print(f"aicite {__version__}")

def resolve_template_dir():
    package_dir = Path(__file__).parent
    uvx_dir = package_dir.parent
    repo_root = uvx_dir.parent

    packaged = uvx_dir / "templates" / "basic"
    if packaged.exists():
        return packaged

    from_repo_root = repo_root / "templates" / "basic"
    if from_repo_root.exists():
        return from_repo_root

    raise RuntimeError(
        f"Unable to locate templates. Looked for:\n- {packaged}\n- {from_repo_root}\n\n"
        "If you're publishing, ensure templates are included."
    )

def list_files_recursive(dir_path):
    out = []
    for root, dirs, files in os.walk(dir_path):
        for file in files:
            out.append(Path(root) / file)
    return out

def parse_targets(args):
    valid = {"copilot", "kilocode", "cursor", "docs"}

    if args.only:
        parts = [s.strip().lower() for s in args.only.split(",") if s.strip()]
        if not parts:
            raise RuntimeError("--only value is empty")
        
        for part in parts:
            if part not in valid:
                raise RuntimeError(f"Unknown target in --only: {part}")
        
        targets = set(parts)
        targets.add("docs")
        return targets

    explicit = set()
    if args.copilot:
        explicit.add("copilot")
    if args.kilocode:
        explicit.add("kilocode")
    if args.cursor:
        explicit.add("cursor")
    if args.docs:
        explicit.add("docs")
    if explicit:
        explicit.add("docs")
        return explicit

    return {"copilot", "kilocode", "cursor", "docs"}

def write_file_if_needed(file_path, content, force):
    if not force and file_path.exists():
        return False, "exists"
    file_path.parent.mkdir(parents=True, exist_ok=True)
    file_path.write_text(content, encoding="utf-8")
    return True, None

def setup(cwd, force, targets):
    template_dir = resolve_template_dir()
    template_files = list_files_recursive(template_dir)

    def should_include(rel_path):
        first = rel_path.split(os.sep)[0]
        # Check for .kilocode/ directory AND .kilocodemodes file
        if first == ".github":
            return "copilot" in targets
        if first == ".kilocode" or first == ".kilocodemodes":
            return "kilocode" in targets
        if first == ".cursor":
            return "cursor" in targets
        if first == "docs":
            return "docs" in targets
        return True

    wrote = 0
    skipped = 0

    for src_file in template_files:
        rel = str(src_file.relative_to(template_dir))
        if not should_include(rel):
            continue
        dest_file = Path(cwd) / rel
        content = src_file.read_text(encoding="utf-8")
        success, reason = write_file_if_needed(dest_file, content, force)
        if success:
            wrote += 1
        else:
            skipped += 1

    print(f"Created {', '.join(sorted(targets))} (from templates)")
    if skipped:
        print(f"Wrote {wrote} files (skipped {skipped})")
    else:
        print(f"Wrote {wrote} files")
    print("Done.")

def main():
    parser = argparse.ArgumentParser(description="AiCite CLI", add_help=False)
    parser.add_argument("-h", "--help", action="store_true", help="Show this help message and exit")
    parser.add_argument("-v", "--version", action="store_true", help="Show current version")
    subparsers = parser.add_subparsers(title="Commands", dest="command")

    setup_parser = subparsers.add_parser("setup", help="Create project assistant files", add_help=False)
    setup_parser.add_argument("--force", action="store_true", help="Overwrite existing files")
    setup_parser.add_argument("--only", type=str, help="Comma-separated targets: copilot,kilocode,cursor,docs")
    setup_parser.add_argument("--copilot", action="store_true", help="Generate only .github/ (Copilot)")
    setup_parser.add_argument("--kilocode", action="store_true", help="Generate only .kilocode/ (KiloCode)")
    setup_parser.add_argument("--cursor", action="store_true", help="Generate only .cursor/ and AGENTS.md (Cursor IDE)")
    setup_parser.add_argument("--docs", action="store_true", help="Generate only docs/")

    args = parser.parse_args()

    if args.version:
        print_version()
        sys.exit(0)

    if args.help or args.command is None:
        print_help()
        sys.exit(0 if args.help else 1)

    if args.command == "setup":
        try:
            targets = parse_targets(args)
        except RuntimeError as e:
            print(str(e), file=sys.stderr)
            print()
            print_help()
            sys.exit(1)
        
        try:
            setup(os.getcwd(), args.force, targets)
        except Exception as e:
            print(str(e), file=sys.stderr)
            sys.exit(1)

    else:
        print(f"Unknown command: {args.command}", file=sys.stderr)
        print()
        print_help()
        sys.exit(1)

if __name__ == "__main__":
    main()
