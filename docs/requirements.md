# AiCite — Requirements

> **Document Version:** 0.1 (draft)
> **Last Updated:** 8 March 2026
> **Scope Note:** This document captures (a) what is already implemented in this repo today and (b) the near-term intended direction described by the project owner. Items not yet implemented are explicitly marked.

---

## Document Index

- **WHAT to build:** this document
- **HOW it’s designed:** [architecture.md](./architecture.md)
- **HOW to build it (templates/CLI details):** [implementation.md](./implementation.md)
- **HOW to publish/deploy/operate:** [deployment.md](./deployment.md)

---

## Project Goals and Objectives

### Project Summary

AiCite is an open-source scaffolding CLI that bootstraps a project’s AI-assistant context so humans and AI agents can stay aligned through a shared, repo-local documentation set and agent guidance files.

### Goals (outcomes)

- **G1 — One-command setup:** a developer can initialize the framework via a single command such as `npx aicite@latest setup`.
- **G2 — Shared source of truth:** the project gets a central, versioned documentation folder (`docs/`) for requirements/architecture/implementation/deployment.
- **G3 — Multi-tool agent guidance:** generate vendor/tool-specific assistant configuration (e.g., GitHub Copilot; KiloCode) from templates.
- **G4 — Low-friction adoption:** minimal prerequisites, non-interactive CLI, safe defaults (no overwrites without explicit intent).

### Objectives (measurable)

| ID | Objective | Success Criteria |
|---|---|---|
| OBJ-001 | Provide working `setup` command | Running `aicite setup` writes expected files and prints a summary.
| OBJ-002 | Support selective generation | User can generate only chosen targets (`--only`, `--copilot`, `--kilocode`, `--docs`).
| OBJ-003 | Preserve existing user work by default | Re-running without `--force` does not overwrite existing generated files.
| OBJ-004 | Keep templates versioned and publishable | npm package includes templates at publish time (prepack sync).
| OBJ-005 | Prepare for additional distributions | A placeholder for Python/uvx distribution exists (not implemented).

---

## Users and Use Cases

### Primary User Types

| User Type | What they want | Why |
|---|---|---|
| Developers | Bootstrap agent guidance + docs | Faster onboarding and consistent AI usage patterns.
| Architects/Tech leads | Maintain requirements/architecture “source of truth” | Keep AI outputs and implementation aligned.
| Repo maintainers | Keep templates and CLI stable | Reduce issues and breaking changes.

### Core Use Cases

| ID | Use Case | Outcome |
|---|---|---|
| UC-001 | Initialize a repo | `docs/` and selected tool config folders/files are created.
| UC-002 | Re-run setup safely | Existing files remain untouched unless `--force` is used.
| UC-003 | Generate only Copilot guidance | Only `.github/…` plus `docs/` are generated.
| UC-004 | Generate only docs | Only `docs/…` are generated.

---

## Functional Requirements

### CLI Commands

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-001 | Provide `aicite setup` command that generates files into the current working directory | High | ✅ Implemented
| FR-002 | Provide `--help` output describing usage and options | High | ✅ Implemented
| FR-003 | Provide `--force` option to overwrite existing generated files | High | ✅ Implemented
| FR-004 | Provide selective generation via `--only copilot,kilocode,docs` | High | ✅ Implemented
| FR-005 | Provide convenience flags `--copilot`, `--kilocode`, `--docs` | Medium | ✅ Implemented
| FR-006 | Always generate `docs/` as part of setup | High | ✅ Implemented (docs are forced into targets)

### Generated Artifacts (templates)

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-010 | Generate GitHub Copilot guidance under `.github/` (agents/personas) when target includes `copilot` | High | ✅ Implemented (via template filtering)
| FR-011 | Generate KiloCode configuration under `.kilocode/` (and related config files) when target includes `kilocode` | Medium | ✅ Implemented (depends on packaged templates)
| FR-012 | Generate documentation skeleton under `docs/` | High | ✅ Implemented (depends on templates)

### Template Resolution and Copying

| ID | Requirement | Priority | Status |
|---|---|---:|---|
| FR-020 | CLI locates templates from inside the npm package at runtime | High | ✅ Implemented (`npx/templates/basic`)
| FR-021 | CLI copies template files recursively and preserves relative paths | High | ✅ Implemented
| FR-022 | CLI must not overwrite existing files unless `--force` is set | High | ✅ Implemented
| FR-023 | CLI prints a short summary (targets, wrote/skipped counts, done) | Low | ✅ Implemented
| FR-024 | CLI may include top-level template files not under `.github/`, `.kilocode/`, or `docs/` | Medium | ✅ Implemented (current filter passes unknown top-level paths)

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
| Template content quality | Determines real usefulness of generated docs/agents | 🔄 In Progress
| Future: `uvx` distribution | Optional UX parity for Python environments | ⚠️ Planned (not implemented)

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
| CLI `setup` behavior | ✅ Complete | Implemented in `npx/bin/aicite.js`.
| Template packaging/sync | ✅ Complete | `npx/scripts/sync-templates.js` runs on `prepack`.
| Requirements doc (this) | 🔄 In Progress | Initial draft created; confirm open questions below.
| Architecture doc | 🔄 In Progress | Updating next.
| Template content completeness | 🔄 In Progress | Some templates still placeholders depending on package snapshot.
| uvx distribution | ⚠️ Planned | Folder reserved only.

---

## Open Questions (for the project owner)

1. Should AiCite’s “source of truth” docs live under `docs/` (current behavior) or also be mirrored under `.github/` as some agent templates mention?
2. Which vendor/tool targets are in-scope for v1 (Copilot, KiloCode, others)?
3. Do you want the CLI to ever modify existing docs (merge/update), or strictly “generate once” unless `--force` overwrites?
4. For KiloCode support, should the canonical output be a `.kilocode/` folder, a `.kilocodemodes` file, or both?
