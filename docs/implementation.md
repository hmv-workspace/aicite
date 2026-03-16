# AiCite — Implementation

> **Document Version:** 1.0
> **Last Updated:** 16 March 2026  
> **Scope:** This document defines HOW to implement and develop AiCite. It covers the current implementation status, repository structure, CLI behavior, local development setup, template development workflow, testing strategy, and troubleshooting guidelines. It applies to both the Node.js and Python CLI implementations.

---

## Document Index

- [What's Implemented (Current State)](#whats-implemented-current-state)
- [Repository Structure](#repository-structure)
- [CLI Behavior (Implementation Notes)](#cli-behavior-implementation-notes)
- [Local Development](#local-development)
- [Template Development Workflow](#template-development-workflow)
- [Testing Strategy (Current)](#testing-strategy-current)
- [Troubleshooting](#troubleshooting)

---

## What’s Implemented (Current State)

AiCite is implemented as both a **Node.js CLI** and a **Python CLI** that scaffold a target repository by copying a **versioned template tree** into the user's current working directory.

In this repo today:

- A standalone npm package under `npx/` is published as the `aicite` package.
- The Node.js CLI entrypoint is `npx/bin/aicite.js` (no runtime dependencies).
- A Python package under `uvx/` is published as the `aicite` package on PyPI.
- The Python CLI entrypoint is `uvx/aicite/cli.py` (uses argparse and pathlib).
- Templates live in `templates/basic/` (source of truth) and are synced into respective distribution directories during packaging.

---

## Repository Structure

```
.
├── README.md                    # repo overview + dev smoke/pack commands
├── docs/                        # repo documentation (requirements/architecture/implementation/deployment)
├── templates/basic/             # canonical templates (copied into distribution packages during build)
├── npx/                         # publishable npm package
│   ├── package.json             # package metadata (name/version/bin/engines)
│   ├── package-lock.json        # npm lockfile (keeps node_modules inside npx/)
│   ├── bin/aicite.js            # Node.js CLI implementation
│   ├── scripts/sync-templates.js# prepack template sync
│   ├── templates/basic/         # templates shipped in the npm tarball
│   └── .npmrc                   # disables audit/fund for deterministic logs
└── uvx/                         # publishable Python package
    ├── pyproject.toml           # package metadata and dependencies
    ├── aicite/
    │   ├── __init__.py          # package initialization and version
    │   └── cli.py               # Python CLI implementation
    ├── scripts/
    │   └── sync-templates.py    # pre-build template sync
    ├── templates/basic/          # templates shipped in the PyPI package
    ├── README.md                # Python package documentation
    └── LICENSE                  # MIT license
```

---

## CLI Behavior (Implementation Notes)

### Commands

- `aicite setup` — copies templates into the current working directory.
- `aicite --help` — prints usage.

### Options

- `--force` — overwrite existing generated files.
- `--only copilot,kilocode,cursor,docs` — generate only selected targets (docs are always included).
- `--copilot` / `--kilocode` / `--cursor` / `--docs` — convenience flags; if any is specified, docs are still included.

### Template resolution

At runtime the CLI resolves templates in this order:

1. Prefer templates bundled inside the npm package: `npx/templates/basic/`
2. Fallback to repo templates: `templates/basic/`

### File generation rules

- Template files are enumerated recursively.
- Files are filtered by their first path segment:
	- `.github/…` only when the Copilot target is enabled
	- `.kilocode/…` only when the KiloCode target is enabled
	- `.cursor/…` only when the Cursor target is enabled
	- `docs/…` only when the docs target is enabled (and docs are forced on)
- Existing files are skipped unless `--force` is used.

---

## Local Development

### Prerequisites

- Node.js `>=18` (enforced by `npx/package.json` engines)

### Install

```bash
cd npx
npm install
```

### Smoke test the CLI
```bash
cd npx
npm run smoke
```

This executes the package smoke script (`node bin/aicite.js --help`).

### Inspect publish contents (dry-run)

```bash
cd npx
npm run pack:dry
```

This runs `npm pack --dry-run` and triggers `prepack` (template sync) as part of the pack flow.

---

## Template Development Workflow

1. Edit templates under `templates/basic/`.
2. Validate the publish artifact includes updated templates via `cd npx && npm run pack:dry`.
3. Publish from `npx/` (see [deployment.md](./deployment.md)).

---

## Testing Strategy (Current)

- CLI validation is currently via smoke-style checks:
	- `cd npx && npm run smoke` for help output
	- optionally run `npx/bin/aicite.js setup` in a scratch directory to confirm file outputs

---

## Troubleshooting

### "Unable to locate templates"

The CLI throws this error if it cannot find either:

- `npx/templates/basic/` (packaged) or
- `templates/basic/` (repo fallback)

If you're developing locally, verify `templates/basic/` exists and that `npx/scripts/sync-templates.js` runs during pack/publish.
