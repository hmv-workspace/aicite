# uvx distribution

This folder contains the Python-based distribution of AiCite.

## Usage

To use AiCite via uvx (uv's package runner):

```bash
uvx aicite --help
uvx aicite setup [--force] [--only <targets> | --copilot] [--kilocode] [--docs]
```

## Features

- `setup`: Create project assistant files in the current directory
- `--force`: Overwrite existing generated files
- `--only`: Comma-separated targets: copilot,kilocode,docs (default: all). Note: docs are always generated.
- `--copilot`: Generate only .github/ (Copilot)
- `--kilocode`: Generate only .kilocode/ (KiloCode)
- `--docs`: Generate only docs/

## Development

To install and develop locally:

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install -e .
```

To sync templates from the repository root:

```bash
python3 scripts/sync-templates.py
```

## Build

To build the package:

```bash
cd uvx
pip install build
python -m build
```

## Publish

To publish to PyPI (requires appropriate credentials):

```bash
cd uvx
pip install twine
twine upload dist/*
```

