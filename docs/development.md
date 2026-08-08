# AiCite — Development

> **Document Version:** 1.1
> **Last Updated:** 07 August 2026  
> **Scope:** This document defines HOW to implement and develop AiCite. It covers the current implementation status, repository structure, CLI behavior, local development setup, template development workflow, key decisions/learnings, and troubleshooting guidelines. It applies to both the Node.js and Python CLI implementations. Test strategy and test cases are in [testplan.md](./testplan.md), not here.

---

## Document Index

- [What's Implemented (Current State)](#whats-implemented-current-state)
- [Repository Structure](#repository-structure)
- [CLI Behavior (Implementation Notes)](#cli-behavior-implementation-notes)
- [Local Development](#local-development)
- [Template Development Workflow](#template-development-workflow)
- [Key Decisions and Learnings](#key-decisions-and-learnings)
- [Troubleshooting](#troubleshooting)

---

## What's Implemented (Current State)

AiCite is implemented as both a **Node.js CLI** and a **Python CLI** that scaffold a target repository by copying a **versioned template tree** into the user's current working directory.

In this repo today:

- A standalone npm package under `npx/` is published as the `aicite` package.
- The Node.js CLI entrypoint is `npx/bin/aicite.js` (no runtime dependencies).
- A Python package under `uvx/` is published as the `aicite` package on PyPI.
- The Python CLI entrypoint is `uvx/aicite/cli.py` (uses argparse and pathlib).
- Templates live in `templates/basic/` (source of truth) and are synced into respective distribution directories during packaging via `npx/scripts/sync-templates.js` and `uvx/scripts/sync-templates.py`.

---

## Repository Structure

```
.
├── README.md                    # repo overview + dev smoke/pack commands
├── AGENTS.md, CLAUDE.md         # this repo's own agent guidance (dogfooding)
├── docs/                        # repo documentation (requirements/architecture/development/testplan/deployment)
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
- `aicite update` — updates existing generated files from templates, skipping files the user has modified unless `--force` is used.
- `aicite --help` — prints usage.
- `aicite --version` — prints the CLI version.

### Setup Options

- `--force` — overwrite existing generated files.
- `--only copilot,kilocode,cursor,claude,docs` — generate only selected targets. `docs` (including `AGENTS.md`) is always included regardless of `--only`/flags.
- `--copilot` / `--kilocode` / `--cursor` / `--claude` / `--docs` — convenience flags; if any is specified, `docs` is still included.

### Update Options

- `--force` — overwrite files even if user-modified.
- `--agents` — update only existing agent files (`.github/`, `.cursor/`, `.kilocode/`, `CLAUDE.md`); skip `docs/`.

### Template resolution

At runtime the CLI resolves templates in this order:

1. Prefer templates bundled inside the package: `npx/templates/basic/` (Node) or `uvx/templates/basic/` (Python)
2. Fallback to repo templates: `templates/basic/`

### File generation rules

- Template files are enumerated recursively.
- Files are filtered by their first path segment:
	- `.github/…` only when the `copilot` target is enabled
	- `.kilocode/…` / `.kilocodemodes` only when the `kilocode` target is enabled
	- `.cursor/…` only when the `cursor` target is enabled
	- `CLAUDE.md` only when the `claude` target is enabled
	- `AGENTS.md` and `docs/…` whenever the `docs` target is enabled (which is unconditional today)
- Existing files are skipped unless `--force` is used.

---

## Local Development

### Prerequisites

- Node.js `>=18` (enforced by `npx/package.json` engines)
- Python `>=3.8` for the `uvx/` package

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

1. Edit templates under `templates/basic/` (the single source of truth — never edit `npx/templates/` or `uvx/templates/` directly, they are generated).
2. Sync into both distribution directories: `node npx/scripts/sync-templates.js && python3 uvx/scripts/sync-templates.py`.
3. Validate the publish artifact includes updated templates via `cd npx && npm run pack:dry`.
4. Run the guardrail test cases in [testplan.md](./testplan.md) before publishing.
5. Publish from `npx/` and `uvx/` (see [deployment.md](./deployment.md)).

---

## Key Decisions and Learnings

> Verified decisions and learnings from active development of AiCite itself.

### Decisions

| Date | Decision | Context | Alternatives Considered | Rationale |
|------|----------|---------|--------------------------|-----------|
| 2026-08-07 | Consolidated per-tool Architect-Assistant/Developer-Assistant pairs into a single `AiCite-Agent` mode/persona (Copilot, Cursor, KiloCode) | Users kept forgetting to switch modes between architecture and implementation work | Keep the two-mode split; add more explicit handoff prompts | One mode covering the full lifecycle removes the switching failure mode entirely |
| 2026-08-07 | Added `AGENTS.md` as shared guidance any AI tool can read directly; `CLAUDE.md` is a thin pointer to it and ships behind a new opt-in `--claude` target; `AGENTS.md` always ships bundled with `docs` | Templates had no Claude Code adapter despite AiCite's "any AI tool" goal; tool-specific files were duplicating the same operating rules | Duplicate the same content into `CLAUDE.md` directly | Single source of truth avoids the two files drifting out of sync over time |
| 2026-08-07 | Split `docs/implementation.md` into `docs/development.md` (HOW to build — plan, API contract, key decisions/learnings) and `docs/testplan.md` (WHAT to verify — guardrail tests labeled `TC-xxx`) | `CLAUDE.md`/`AGENTS.md` already referenced this 5-doc set, but the shipped template only had 4 docs | Keep testing content embedded inside one implementation doc | Matches the doc set this repo's own agent guidance already promises; separates "how it's built" from "how it's verified" |

### Learnings

| Date | Learning | Context | Impact |
|------|----------|---------|--------|
| 2026-08-07 | `npx/scripts/sync-templates.js` used `fs.cpSync` without clearing the destination first, unlike the Python sync (`uvx/scripts/sync-templates.py`), which does `shutil.rmtree` before copying | Discovered stale `.kilocode/architect-assistant.yaml` / `developer-assistant.yaml` files lingering in `npx/templates/` from an earlier template structure, no longer present in `templates/basic/` | Fixed the JS sync to `rm` the destination before copying, so `npx/templates` and `uvx/templates` can't silently drift from `templates/basic` again |

---

## Troubleshooting

### "Unable to locate templates"

The CLI throws this error if it cannot find either:

- the packaged `templates/basic/` inside `npx/` or `uvx/`, or
- `templates/basic/` (repo fallback)

If you're developing locally, verify `templates/basic/` exists and that the sync scripts ran during pack/publish.
