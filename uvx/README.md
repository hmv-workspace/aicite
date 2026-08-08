# uvx distribution

Open-source specs-driven development (SDD) framework for AI assistant alignment.

## Usage

To use AiCite via uvx (uv's package runner):

```bash
uvx aicite --help
uvx aicite setup [--force] [--only <targets> | --copilot] [--kilocode] [--cursor] [--claude] [--docs]
```

This creates the following in the current working directory:

- `docs/` — project documentation skeleton (requirements, architecture, development, testplan, deployment)
- `AGENTS.md` — shared guidance for any AI agent
- `.github/` — GitHub Copilot agent guidance
- `.kilocode/` — KiloCode configuration + agent guidance
- `.cursor/` — Cursor IDE agent guidance
- `CLAUDE.md` — Claude Code guidance

## Features

- `setup`: Create project assistant files in the current directory
- `--force`: Overwrite existing generated files
- `--only`: Comma-separated targets: copilot,kilocode,cursor,claude,docs (default: all). Note: docs are always generated.
- `--copilot`: Generate only .github/ (Copilot)
- `--kilocode`: Generate only .kilocode/ (KiloCode)
- `--cursor`: Generate only .cursor/ (Cursor IDE)
- `--claude`: Generate only CLAUDE.md (Claude Code)
- `--docs`: Generate only docs/
