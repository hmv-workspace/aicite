#!/usr/bin/env python3

"""
Sync templates from root directory to uvx/templates for publishing.
"""

import os
import shutil
from pathlib import Path

def main():
    repo_root = Path(__file__).parent.parent.parent
    source_dir = repo_root / "templates"
    dest_dir = Path(__file__).parent.parent / "templates"

    if dest_dir.exists():
        shutil.rmtree(dest_dir)

    shutil.copytree(source_dir, dest_dir)
    print(f"Synced templates from {source_dir} to {dest_dir}")

if __name__ == "__main__":
    main()
