# uvx distribution

Open-source specs-driven development (SDD) framework for AI assistant alignment.

## Usage

To use AiCite via uvx (uv's package runner):

```bash
uvx aicite --help
uvx aicite setup [--force] [--only <targets> | --copilot] [--kilocode] [--cursor] [--docs]
```

## Features

- `setup`: Create project assistant files in the current directory
- `--force`: Overwrite existing generated files
- `--only`: Comma-separated targets: copilot,kilocode,cursor,docs (default: all). Note: docs are always generated.
- `--copilot`: Generate only .github/ (Copilot)
- `--kilocode`: Generate only .kilocode/ (KiloCode)
- `--cursor`: Generate only .cursor/ (Cursor IDE)
- `--docs`: Generate only docs/
