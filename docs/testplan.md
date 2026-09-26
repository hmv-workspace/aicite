# AiCite — Test Plan

> **Document Version:** 1.1
> **Last Updated:** 07 August 2026  
> **Scope:** This document defines WHAT to verify for the AiCite CLI (Node.js and Python implementations) before publishing. Guardrail tests are labeled `TC-xxx` so they can be referenced from commits, PRs, or [development.md](./development.md) without rewriting. For HOW the CLI is implemented, see [development.md](./development.md).

---

## Document Index

- [Test Strategy](#test-strategy)
- [Setup](#setup)
- [Guardrail Test Cases (TC-xxx)](#guardrail-test-cases-tc-xxx)
- [Manual Verification Commands](#manual-verification-commands)
- [Expected File Counts](#expected-file-counts)

---

## Test Strategy

CLI validation today is smoke/manual-style — there is no automated test suite yet. Both implementations (`npx/bin/aicite.js`, `uvx/aicite/cli.py`) must be exercised in a scratch directory before every publish, and their output must match (same target set, same file list, same file count) since they're documented as producing byte-identical results.

| Type | Scope | Tools | Coverage Target |
|------|-------|-------|------------------|
| Smoke | `--help` output for both CLIs | manual / `npm run smoke` | Every release |
| Manual E2E | `setup` / `update` behavior in a scratch dir | manual, see commands below | Every release |
| Parity | npx vs uvx output on identical flags | manual diff | Every release |

---

## Setup

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite
```

---

## Guardrail Test Cases (TC-xxx)

| Test ID | Description | Preconditions | Steps | Expected Result | Status |
|---------|--------------|----------------|-------|-------------------|--------|
| TC-001 | Fresh `setup` creates all targets by default | Empty scratch dir | Run `aicite setup` | All template files created (`.github/`, `.cursor/`, `.kilocode*`, `CLAUDE.md`, `AGENTS.md`, `docs/`) | 🔄 Pending |
| TC-002 | `update` on unmodified files is a no-op | Fresh `setup` already run | Run `aicite update` | 0 files written, all skipped (content matches template) | 🔄 Pending |
| TC-003 | User-modified files are protected from `update` | Fresh `setup` already run, one file hand-edited | Modify `docs/README.md`, run `aicite update` | Modified file skipped; run `aicite update --force` → modified file is overwritten | 🔄 Pending |
| TC-004 | `update --agents` skips `docs/` | Fresh `setup` already run | Run `aicite update --agents` | Only agent files targeted (`.github/`, `.cursor/`, `.kilocode/`, `CLAUDE.md`); `docs/` untouched | 🔄 Pending |
| TC-005 | `update` on an empty directory creates nothing | Empty scratch dir | Run `aicite update` or `aicite update --agents` | 0 files created (update only modifies existing files) | 🔄 Pending |
| TC-006 | `--help` shows both commands and all setup/update options | N/A | Run `aicite --help` | Usage lists `setup`/`update`, and setup options include `--copilot`, `--kilocode`, `--cursor`, `--claude`, `--docs`, `--only`, `--force` | 🔄 Pending |
| TC-007 | `--claude` generates only `CLAUDE.md` (+ docs) | Empty scratch dir | Run `aicite setup --claude` | Only `CLAUDE.md`, `AGENTS.md`, and `docs/*` are written; no `.github/`, `.cursor/`, `.kilocode*` | 🔄 Pending |
| TC-008 | `AGENTS.md` is always generated regardless of target flags | Empty scratch dir | Run `aicite setup --cursor` (or any single-target flag) | `AGENTS.md` is present alongside the requested target, since `docs` is always included | 🔄 Pending |
| TC-009 | npx and uvx produce identical output for the same flags | Two empty scratch dirs | Run `node npx/bin/aicite.js setup` in one, `python3 -m aicite.cli setup` in the other | Identical file lists and file counts | 🔄 Pending |
| TC-010 | `templates/basic`, `npx/templates`, `uvx/templates` stay in sync | Templates edited under `templates/basic/` | Run both sync scripts, then `diff -rq` all three trees | No diff output | 🔄 Pending |
| TC-011 | Per-tool agent files stay thin pointers, not content forks | Fresh `setup` already run | Inspect `.cursor/agents/aicite.agent.md` and `.github/agents/aicite.agent.md` | Each contains only frontmatter (`name`/`tools`/`model`) plus a one-line pointer to `AGENTS.md` — no duplicated mission/workflow body | 🔄 Pending |
| TC-012 | Every doc `AGENTS.md` points to is actually generated | Empty scratch dir | Run `aicite setup`, then check each path listed in `AGENTS.md` | All six exist: `docs/README.md` (item 0) plus requirements, architecture, development, testplan, deployment — no dangling reference | 🔄 Pending |

---

## Manual Verification Commands

### uvx (Python)

**Option A: Run with PYTHONPATH (no installation)**

```bash
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite setup
find . -type f | sort

PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update --agents
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite update --force
PYTHONPATH=/Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/uvx python3 -m aicite --help
```

**Option B: Install in editable mode**

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite
pip install -e uvx/

cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test
aicite setup
aicite update
aicite update --agents
aicite update --force
aicite --help
```

### npx (Node.js)

**Option A: Run script directly**

```bash
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test

node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js setup
find . -type f | sort

node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update --agents
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js update --force
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js --help
```

**Option B: Link globally**

```bash
cd /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx
npm link

cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test
aicite setup
aicite update
aicite update --agents
aicite update --force
aicite --help
```

### Targeted setup (e.g. TC-007)

```bash
cd /tmp && rm -rf aicite-test && mkdir aicite-test && cd aicite-test
node /Users/mehulhirpara/Workspace/GitHub/hmv-workspace/aicite/npx/bin/aicite.js setup --claude
find . -type f | sort
```

---

## Expected File Counts

| Command | uvx Files | npx Files |
|---------|-----------|-----------|
| `setup` (default, all targets) | 12 | 12 |
| `update --agents` targets | 7 | 7 |
| `update` targets | 12 | 12 |

Both implementations must match exactly — a divergence is itself a failure (see TC-009). If this table goes stale, re-run TC-001 and update it; it drifted once already (previously 11 uvx / 14 npx) when `npx/templates/` accumulated stale files that `uvx/templates/` didn't have.
