# AiCite — Architecture

> **Document Version:** 0.1 (draft)
> **Last Updated:** 16 March 2026
> **Scope Note:** This architecture reflects the current repo implementation (a minimal Node.js CLI that copies versioned templates into a target repo). Planned/future distribution options are explicitly labeled.

---

## Document Index

- **WHAT to build:** [requirements.md](./requirements.md)
- **HOW it’s designed:** this document
- **HOW to build it (implementation details):** [implementation.md](./implementation.md)
- **HOW to publish/deploy/operate:** [deployment.md](./deployment.md)

---

## Overview of the Architecture

AiCite is an **open-source specs-driven development (SDD) scaffolding CLI** for AI agent alignment. It bootstraps shared documentation and assistant guidance in minutes, creating a version-controlled context for both humans and AI agents.

**Key architectural characteristics:**
- **Local scaffolding system**: A CLI (`aicite setup`) copies a curated set of documentation and assistant guidance templates into the user’s repository
- **No backend service**: No database, and no network dependency during setup
- **Multi-tool support**: Generates guidance for GitHub Copilot, KiloCode, and other tools (extensible)
- **Specs-driven approach**: Documentation includes status indicators for requirements, architecture, and implementation, enabling real-time project tracking

**Primary users** are developers and architects who want AI agents from different tools/vendors to operate from the same “source of truth” documents and consistent project guidance.

**Core architectural pattern:** deterministic template generation (filesystem copy) with safe defaults (skip existing files unless `--force`).

---

## Key Components and Their Interactions

| Component | Location | Responsibility |
|---|---|---|
| Repo root (non-package) | `README.md`, `docs/`, `templates/`, `npx/`, `uvx/` | Holds source templates + documentation; the publishable npm and Python packages live under `npx/` and `uvx/` respectively.
| npm CLI package | `npx/` | Publishable package that provides the `aicite` binary for JavaScript environments.
| JavaScript CLI entrypoint | `npx/bin/aicite.js` | Parses args; resolves templates; filters targets; writes files; prints summary.
| Python CLI package | `uvx/` | Publishable package that provides the `aicite` binary for Python environments.
| Python CLI entrypoint | `uvx/aicite/cli.py` | Parses args; resolves templates; filters targets; writes files; prints summary.
| Template source (repo) | `templates/basic/` | Intended “source of truth” template set under version control.
| Templates shipped with npm package | `npx/templates/basic/` | Template set bundled into the published npm package.
| Templates shipped with Python package | `uvx/templates/basic/` | Template set bundled into the published PyPI package.
| JavaScript template sync script | `npx/scripts/sync-templates.js` | Copies repo templates into `npx/templates/` during `prepack`.
| Python template sync script | `uvx/scripts/sync-templates.py` | Copies repo templates into `uvx/templates/` during build.

### Component Interactions (runtime flow)

1. User runs `npx aicite@latest setup` (or `aicite setup` when installed).
2. CLI parses options:
	- `--only copilot,kilocode,docs` (always includes `docs`)
	- or convenience flags `--copilot`, `--kilocode`, `--docs` (always includes `docs`)
	- `--force` to overwrite existing files
3. CLI resolves the template directory:
	- prefers templates inside the npm package (`npx/templates/basic` when running from this repo/package)
	- falls back to repo root templates (useful when templates are not bundled, or in certain dev setups)
4. CLI enumerates template files recursively, filters by target (first path segment), and copies into the current working directory.
	- Files under `.github/`, `.kilocode/`, and `docs/` are gated by selected targets.
	- Any top-level template entries outside those folders are currently always included.
5. CLI prints a summary (targets chosen, wrote/skipped counts) and exits.

---

## Design Decisions and Rationale

| Decision | Description | Rationale |
|---|---|---|
| Minimal, dependency-free Node CLI | CLI uses built-in Node modules only | Small footprint, fast install, reduced supply-chain risk.
| Templates are first-class artifacts | Ship versioned templates with the package | Makes behavior deterministic and offline-friendly.
| Safe-by-default file writing | Skip existing files unless `--force` is used | Avoid accidental clobbering of user content.
| “Docs always generated” rule | `docs/` is forcibly included in targets | Ensures there is a central documentation baseline in every setup.
| Prepack template sync | `prepack` copies repo templates into package templates | Keeps publish output consistent without manual steps.

---

## Technology Stack

| Category | Technology | Version | Purpose |
|---|---|---|---|
| Language/Runtime | Node.js | `>=18` | Run the JavaScript CLI reliably across environments.
| Language/Runtime | Python | `>=3.8` | Run the Python CLI reliably across environments.
| Packaging | npm | N/A | Publish `aicite` and run via `npx`.
| Packaging | PyPI | N/A | Publish `aicite` and run via `uvx`.
| JavaScript Package Management | npm | N/A | Manage dependencies and scripts for the JavaScript CLI.
| Python Package Management | Poetry | N/A | Manage dependencies and scripts for the Python CLI.
| Repo structure | Standalone npm package in `npx/` and Python package in `uvx/` | N/A | Keep dependencies and build artifacts scoped to respective directories.

---

## Deployment Strategy

### Distribution

- **Primary:** publish the `npx/` package as the `aicite` npm package (supports `npx aicite@latest setup`).
- **Secondary:** publish the `uvx/` package as the `aicite` PyPI package (supports `uvx aicite setup`).

### Environments

AiCite itself is a CLI and does not have runtime environments like a server application.

| Environment | Purpose | Deployment Method |
|---|---|---|
| Developer machine | Run `aicite setup` to scaffold a target repo | `npx aicite@latest setup` (JavaScript) or `uvx aicite setup` (Python).

---

## Scalability and Performance Considerations

The system scales primarily with **template tree size** (number of files/directories). Runtime is dominated by local disk IO.

- **Time complexity:** roughly $O(n)$ over the number of template files.
- **Space complexity:** bounded by file copy buffers and in-memory path lists.

No long-running processes, queues, caches, or concurrency controls are currently needed.

---

## Security Measures

| Security Aspect | Design Approach | Notes |
|---|---|---|
| Data exfiltration | No network calls in setup | Current implementation uses local filesystem only.
| Safe writes | Skip existing files unless `--force` | Reduces risk of destructive actions.
| Output containment | Destinations are within the current working directory | Paths are derived from template relative paths.
| Supply-chain risk | Avoid runtime deps | Uses built-in Node modules.

---

## Maintenance and Monitoring Plans

AiCite is not a running service, so monitoring is primarily **release and quality monitoring** rather than runtime observability.

### Maintenance

- Version templates alongside CLI releases.
- Keep `npx/templates/` in sync via `prepack`.
- Keep CLI flags stable; treat changes as breaking only when required.

### Monitoring (quality signals)

- Track CLI smoke test status (`cd npx && npm run smoke`).
- Track template correctness by running setup in a scratch repo and checking generated file tree.

---

## Tracker Status

| Section | Status | Notes |
|---|---|---|
| Overview | ✅ Complete | Captures current scaffold-only architecture.
| Key Components | ✅ Complete | Based on repo structure and CLI implementation.
| Design Decisions | ✅ Complete | Derived from code and package scripts.
| Technology Stack | ✅ Complete | Node >=18; standalone npm package under `npx/`; Python >=3.8 package under `uvx/`.
| Deployment Strategy | ✅ Complete | Both npm and uvx/PyPI distribution paths are implemented.
| Scalability/Performance | ✅ Complete | Time complexity O(n) over number of template files; bounded by local disk IO.
| Security | ✅ Complete | Offline, safe writes, minimal deps.
| Maintenance/Monitoring | ✅ Complete | Version templates alongside releases; track CLI smoke test and template correctness.