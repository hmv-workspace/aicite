# AiCite — Requirements

> **Document Version:** 1.0
> **Last Updated:** 16 March 2026
> **Scope:** This document defines WHAT AiCite is and what it should do. It captures the current implementation status and near-term roadmap. It includes project goals, user requirements, functional and non-functional specifications, constraints, and assumptions. Items not yet implemented are explicitly marked.

---

## Document Index

- [Project Goals and Objectives](#project-goals-and-objectives)
- [Users and Use Cases](#users-and-use-cases)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Constraints and Assumptions](#constraints-and-assumptions)
- [Dependencies](#dependencies)
- [Glossary](#glossary)
- [Tracker Status](#tracker-status)
- [Open Questions (for the project owner)](#open-questions-for-the-project-owner)

---

## Project Goals and Objectives

### Project Summary

AiCite is an open-source specs-driven development (SDD) framework for AI agent alignment. It bootstraps shared documentation and assistant guidance in minutes, creating a version-controlled context for both humans and AI agents.

### Goals (outcomes)

- **G1 — One-command setup:** a developer can initialize the framework via a single command such as `npx aicite@latest setup` or `uvx aicite setup`.
- **G2 — Shared source of truth:** the project gets a central, versioned documentation folder (`docs/`) for requirements/architecture/implementation/deployment.
- **G3 — Multi-tool agent guidance:** generate vendor/tool-specific assistant configuration (e.g., GitHub Copilot; KiloCode; Cursor IDE) from templates (with extensibility for more tools).
- **G4 — Low-friction adoption:** minimal prerequisites, non-interactive CLI, safe defaults (no overwrites without explicit intent).
- **G5 — Project tracking:** Enable real-time progress tracking through documentation with status indicators for requirements, architecture, and implementation.
- **G6 — Discoverable onboarding:** after `setup`, users can immediately find “what to do next” and where the usage guide lives.

### Objectives (measurable)

| ID | Objective | Success Criteria |
|---|---|---|
| OBJ-001 | Provide working `setup` command | Running `aicite setup` writes expected files and prints a summary.
| OBJ-002 | Support selective generation | User can generate only chosen targets (`--only`, `--copilot`, `--kilocode`, `--cursor`, `--docs`).
| OBJ-003 | Preserve existing user work by default | Re-running without `--force` does not overwrite existing generated files.
| OBJ-004 | Keep templates versioned and publishable | npm package includes templates at publish time (prepack sync); Python package includes templates at build time.
| OBJ-005 | Provide Python/uvx distribution | Working Python CLI available via `uvx aicite setup`.
| OBJ-006 | Make generated artifacts identifiable | After setup, a user can clearly tell (a) the repo uses AiCite and (b) which generated artifacts belong to docs vs tool-specific agent guidance.
| OBJ-007 | Make usage guidance discoverable | `aicite --help` and `aicite setup` output explicitly point to the canonical “how to use” docs in the generated repo.

---

## Users and Use Cases

### Primary User Types

| User Type | What they want | Why |
|---|---|---|
| Developers | Bootstrap agent guidance + docs; get project tracking and progress updates | Faster onboarding, consistent AI usage patterns, and real-time project visibility.
| Architects/Tech leads | Maintain requirements/architecture “source of truth”; track progress and identify blockers | Keep AI outputs and implementation aligned; enable data-driven decision-making.
| Repo maintainers | Keep templates and CLI stable | Reduce issues and breaking changes.

### Core Use Cases

| ID | Use Case | Outcome |
|---|---|---|
| UC-001 | Initialize a repo | `docs/` and selected tool config folders/files are created.
| UC-002 | Re-run setup safely | Existing files remain untouched unless `--force` is used.
| UC-003 | Generate only Copilot guidance | Only `.github/…` plus `docs/` are generated.
| UC-004 | Generate only KiloCode guidance | Only `.kilocode/` folder, `.kilocodemodes` file, plus `docs/` are generated.
| UC-005 | Generate only docs | Only `docs/…` are generated.
| UC-006 | Generate only Cursor IDE guidance | Only `AGENTS.md` plus `docs/` are generated.
| UC-007 | Track project progress | AI agents analyze documentation to provide status reports and identify blockers.
| UC-008 | Detect if project uses AiCite | User can verify if project was initialized with AiCite.
| UC-009 | Update agent content only | User can update agent guidance (`.github/`, `.kilocode/`) without overwriting their documentation.
| UC-010 | Identify what was generated | User can tell which files/folders were generated for `docs` vs each selected tool target (Copilot/KiloCode/Cursor), without reading code or the npm/PyPI package.

---

## Functional Requirements

### CLI Commands

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-001 | Provide `aicite setup` command that generates files into the current working directory | High | ✅ Implemented
| FR-002 | Provide `--help` output describing usage and options | High | ✅ Implemented
| FR-003 | Provide `--force` option to overwrite existing generated files | High | ✅ Implemented
| FR-004 | Provide selective generation via `--only copilot,kilocode,cursor,docs` | High | ✅ Implemented
| FR-005 | Provide convenience flags `--copilot`, `--kilocode`, `--cursor`, `--docs` | Medium | ✅ Implemented
| FR-006 | Always generate `docs/` as part of setup | High | ✅ Implemented (docs are forced into targets)
| FR-007 | Setup output clearly identifies generated categories | Medium | 🔄 Proposed
| FR-008 | Provide “how to use” discoverability from CLI output (`--help` and post-`setup`) | High | 🔄 Proposed

### Generated Artifacts (templates)

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-010 | Generate GitHub Copilot guidance under `.github/` (agents/personas) when target includes `copilot` | High | ✅ Implemented (via template filtering)
| FR-011 | Generate KiloCode configuration under `.kilocode/` (and related config files) when target includes `kilocode` | Medium | ✅ Implemented (depends on packaged templates)
| FR-012 | Generate Cursor IDE configuration (AGENTS.md and .cursor/ folder) when target includes `cursor` | Medium | ✅ Implemented
| FR-013 | Generate documentation skeleton under `docs/` | High | ✅ Implemented (depends on templates)
| FR-014 | Generated artifacts are clearly attributable | High | 🔄 Proposed
| FR-015 | Generated docs include an explicit AiCite attribution line | Medium | 🔄 Proposed

### Template Resolution and Copying

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-020 | CLI locates templates from inside the npm package at runtime | High | ✅ Implemented (`npx/templates/basic`)
| FR-021 | CLI copies template files recursively and preserves relative paths | High | ✅ Implemented
| FR-022 | CLI must not overwrite existing files unless `--force` is set | High | ✅ Implemented
| FR-023 | CLI prints a short summary (targets, wrote/skipped counts, done) | Low | ✅ Implemented
| FR-024 | CLI may include top-level template files not under `.github/`, `.kilocode/`, or `docs/` | Medium | ✅ Implemented (current filter passes unknown top-level paths)
| FR-025 | Provide a way to detect if a project was initialized with AiCite (e.g., marker file, version in package.json) | Medium | 🔄 Proposed
| FR-026 | Support selective update of agent content (e.g., `.github/`, `.kilocode/`) without overwriting user-generated docs | High | 🔄 Proposed
| FR-027 | Support installation directly from git repository using `uv tool install` | Medium | 🔄 Proposed

#### Acceptance Criteria (for FR-007, FR-014, FR-025)

- Given a user runs `aicite setup` with one or more targets, when setup completes, then the tool provides a human-readable summary that:
	- distinguishes documentation output from tool-specific agent guidance output, and
	- makes it clear what targets were selected, and
	- makes it easy to find the generated artifacts in the repo (without requiring the user to know the tool’s internal template layout).
- Given a user is viewing a repo after setup, when they look at the generated artifacts, then they can reliably determine:
	- that the repo uses AiCite, and
	- which artifacts are AiCite-generated docs vs which are agent/tool guidance.

#### Acceptance Criteria (for FR-008)

- Given a user runs `aicite --help`, when they read the output, then it includes a short “Next steps / Where to learn” section that:
	- points to the canonical usage guide location in the target repo (e.g., `docs/README.md`), and
	- includes the official AiCite project link: `https://github.com/hmv-workspace/aicite`.
- Given a user runs `aicite setup` successfully, when the command finishes, then it prints a “Next steps” summary that:
	- tells the user where the usage guide is in the generated repo (path), and
	- states (at a high level) what they should do next (e.g., review requirements, confirm agent instructions), without requiring the user to infer it from the list of generated files.
- Given a user runs `aicite setup` successfully, when the command finishes, then the “Next steps” summary includes the official AiCite project link: `https://github.com/hmv-workspace/aicite`.
- Given a user runs `aicite setup` with selective targets (e.g., `--only docs` or `--copilot`), when the command finishes, then the “Next steps” summary still points to the same canonical usage guide and does not reference targets that were not generated.

#### Acceptance Criteria (for FR-015)

- Given a user runs `aicite setup`, when `docs/README.md` is generated, then it contains an explicit, human-readable attribution line that the content was generated by AiCite.
- The attribution line text must include the exact phrase: “Generated by AiCite — Turning specs into the source of truth for AI-native development.”

---

## Non-Functional Requirements

### Compatibility

| ID | Requirement | Target | Status |
|---|---|---|---|
| NFR-COMP-001 | Node.js runtime compatibility | Node `>=18` | ✅ Implemented (package engines)
| NFR-COMP-002 | Cross-platform file operations | macOS/Linux/Windows | 🔄 In Progress (expected; not explicitly tested here)

### Performance

| ID | Requirement | Target | Status |
|---|---|---|---|
| NFR-PERF-001 | Setup time for basic template set | “Fast enough” for small template trees; bounded by local disk IO | 🔄 In Progress (no explicit benchmark target set)

### Security & Safety

| ID | Requirement | Target | Status |
|---|---|---|---|
| NFR-SEC-001 | No network calls during setup | All operations are local filesystem reads/writes | ✅ Implemented (current code is local-only)
| NFR-SEC-002 | Safe-by-default overwrites | No overwrites unless explicitly requested | ✅ Implemented
| NFR-SEC-003 | Predictable output paths | Writes only within the current working directory | ✅ Implemented (relative copy destination)

### Maintainability

| ID | Requirement | Target | Status |
|---|---|---|---|
| NFR-MAIN-001 | Templates are version-controlled and shipped with the npm package | `prepack` sync ensures templates are present at publish time | ✅ Implemented

---

## Constraints and Assumptions

### Verified Constraints (from code/package metadata)

- CLI runtime is Node.js (minimum version 18).
- Setup is non-interactive and filesystem-based.
- `docs/` is always included in the generation targets.

### Assumptions (need confirmation if incorrect)

- The “central document repository” is the `docs/` folder in the user’s target repo.
- The initial template set is intended to be “basic” and minimal, not a full workflow system.

---

## Dependencies

| Dependency | Why it matters | Status |
|---|---|---|
| npm registry distribution (`npx aicite@latest …`) | Primary installation UX | ✅ Exists
| PyPI distribution (`uvx aicite …`) | Optional UX parity for Python environments | ✅ Implemented
| Git-based installation (`uv tool install aicite --from git+https://github.com/github/spec-kit.git`) | Alternative installation method for development and edge cases | 🔄 Proposed
| Template content quality | Determines real usefulness of generated docs/agents | 🔄 In Progress

---

## Glossary

- **Target repo:** The user’s project directory where they run `aicite setup`.
- **Template:** Version-controlled scaffold files copied into a target repo.
- **Copilot target:** Files under `.github/` used by GitHub Copilot/agent flows.
- **KiloCode target:** Files under `.kilocode/` and related config used by KiloCode.

---

## Tracker Status

| Area | Status | Notes |
|---|---|---|
| CLI `setup` behavior | ✅ Complete | Implemented in `npx/bin/aicite.js` and `uvx/aicite/cli.py`.
| Template packaging/sync | ✅ Complete | `npx/scripts/sync-templates.js` runs on `prepack`; `uvx/scripts/sync-templates.py` for Python.
| Requirements doc (this) | ✅ Complete | Updated based on current implementation.
| Architecture doc | ✅ Complete | Captures current scaffold-only architecture.
| Template content completeness | ✅ Complete | Templates include basic documentation and AI agent guidance.
| uvx distribution | ✅ Complete | Python CLI implemented and published to PyPI.
| AiCite project detection (FR-025) | 🔄 Proposed | Need marker file or package.json entry to detect AiCite usage.
| Selective agent content update (FR-026) | 🔄 Proposed | Need `--agents-only` or similar flag to update agent content without touching docs.
| Usage guidance discoverability (FR-008) | 🔄 Proposed | Ensure CLI output clearly points users to the canonical “how to use” guide post-setup.

---

## Open Questions (for the project owner)

1. Should AiCite’s “source of truth” docs live under `docs/` (current behavior) or also be mirrored under `.github/` as some agent templates mention?
2. Do you want the CLI to ever modify existing docs (merge/update), or strictly “generate once” unless `--force` overwrites?
3. For “identifiable generated artifacts” (FR-007/FR-014/FR-025), do you want identification to be:
	- CLI-output only (clear summary on run),
	- repo-visible only (a marker that remains in the repo),
	- or both?
4. How strict should attribution be: is a single repo marker sufficient, or must each generated area (docs vs each tool target) be independently recognizable?
5. Should users be able to verify *which version* of AiCite generated the artifacts (for debugging/support), or is “uses AiCite” enough?
6. Where is the canonical “how to use AiCite after setup” guide intended to live in the target repo (e.g., `docs/README.md`, root `README.md`, or both)?
7. Should `aicite --help` link users to repo-local docs only, or also include a stable URL to public docs (in case the repo-local docs are edited/removed)?
