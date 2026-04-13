# AiCite — Deployment (Publishing & Release Ops)

> **Document Version:** 1.0
> **Last Updated:** 16 March 2026  
> **Scope:** This document defines HOW to deploy and release AiCite. Since AiCite is a CLI tool (no servers), deployment primarily involves publishing the npm and PyPI packages. It covers release artifacts, publish procedures, verification steps, rollback strategies, and CI/CD pipeline configuration.

---

## Document Index

- [Release Artifacts](#release-artifacts)
- [Environments](#environments)
- [Publish Procedure (npm)](#publish-procedure-npm)
- [Publish Procedure (PyPI)](#publish-procedure-pypi)
- [Verification (Post-Publish)](#verification-post-publish)
- [Monitoring & Alerting (Release Quality)](#monitoring-alerting-release-quality)
- [Rollback / Mitigation](#rollback-mitigation)
- [CI/CD Pipeline (Current)](#cicd-pipeline-current)
- [Common Issues & Troubleshooting](#common-issues-troubleshooting)
- [Tracker Status](#tracker-status)

---

## Release Artifacts

| Artifact | Location in repo | Distribution |
|---|---|---|
| npm package `aicite` | `npx/` | npm registry (supports `npx aicite@latest …`) |
| Python package `aicite` | `uvx/` | PyPI registry (supports `uvx aicite@latest …`) |
| Templates | `templates/basic/` → synced to `npx/templates/basic/` and `uvx/templates/basic/` | bundled in respective distribution packages |

### Released Versions

- **npm:** `0.0.1`, `0.0.2`, `0.0.3`, `0.0.4`
- **PyPI:** `0.0.4`

---

## Environments

AiCite has no long-running runtime environments.

| Environment | Purpose | How used |
|---|---|---|
| Local development | iterate on CLI/templates | run package scripts from `npx/` |
| npm registry | distribution channel | `npm publish` from `npx/` |
| User machines | runtime | `npx aicite@latest setup …` |

---

## Publish Procedure (npm)

### Preconditions

- Node.js `>=18`
- npm account with publish permissions

### 1) Prepare the release

1. Update version in `npx/package.json`:
   ```bash
   cd npx
   npm version patch  # or: npm version minor / npm version major
   ```
2. Ensure templates are correct under `templates/basic/`.
3. Validate the publish artifact contents:

```bash
cd npx
npm run pack:dry
```

This triggers the `npx/` `prepack` script, which syncs templates into `npx/templates/`.

### 2) Smoke-check the CLI locally

```bash
cd npx
npm run smoke
```

### 3) Publish

From repo root:

```bash
cd npx
npm login
npm publish
```

Notes:

- `npm publish` will run `prepublishOnly`/`prepack` hooks as applicable; in this repo `prepack` is the important one.
- Ensure `LICENSE`, `README.md`, `bin/`, and `templates/` are present in the published tarball (see `files` in `npx/package.json`).

---

## Publish Procedure (PyPI)

### Preconditions

- Python `>=3.8`
- PyPI account with publish permissions
- PyPI API token configured (or username/password)

### 1) Prepare the release

1. Update version in `uvx/pyproject.toml`:
   ```bash
   # Edit uvx/pyproject.toml and update the version field
   # Example: version = "0.0.8"
   ```
   
   **Note:** The version is managed in a single place (`pyproject.toml`) and automatically read by the application via `importlib.metadata`. Python/PyPI does not have a built-in version bump command like `npm version`. You can:
   - Manually edit the `version` field in `pyproject.toml` (recommended)
   - Use automation tools like `bump2version` or `versioneer` if configured
2. Ensure templates are correct under `templates/basic/`.
3. Sync templates to uvx directory:

```bash
cd uvx
python3 scripts/sync-templates.py
```

### 2) Smoke-check the CLI locally

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install -e .
aicite --help
```

### 3) Build and Publish

From repo root:

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install build twine
python -m build
twine upload dist/*
```

Notes:

- The `python -m build` command creates both source distribution and wheel files in the `dist/` directory.
- `twine` is used to upload the package to PyPI.
- Ensure your PyPI credentials are properly configured (either via `~/.pypirc` or environment variables).

---

## Verification (Post-Publish)

### npm Package Verification

In a clean scratch directory:

```bash
npx --yes aicite@latest --help
```

Then run setup and confirm expected folders are created:

```bash
mkdir /tmp/aicite-smoke && cd /tmp/aicite-smoke
npx --yes aicite@latest setup --copilot
```

Expected outcome:

- `docs/` exists (always generated)
- `.github/` exists when `--copilot` is used

### Python Package Verification

In a clean scratch directory:

```bash
uvx aicite@latest --help
```

Then run setup and confirm expected folders are created:

```bash
mkdir /tmp/aicite-smoke && cd /tmp/aicite-smoke
uvx aicite@latest setup --copilot
```

Expected outcome:

- `docs/` exists (always generated)
- `.github/` exists when `--copilot` is used

---

## Monitoring & Alerting (Release Quality)

AiCite has no production runtime to monitor. “Monitoring” is primarily **release correctness** and **template integrity**.

Recommended checks per release:

- **Pack integrity:** run `cd npx && npm run pack:dry` and ensure `npx/templates/basic/` contains the expected templates.
- **CLI smoke:** run `cd npx && npm run smoke`.
- **Registry smoke:** run `npx --yes aicite@latest --help` and a minimal `setup` in a scratch directory.

Alerting:

- There is no automated alerting configured in this repo.
- If you add CI later, the simplest “alert” is to fail the pipeline on `cd npx && npm run smoke` / `cd npx && npm run pack:dry`.

---

## Rollback / Mitigation

### npm Package Rollback

Because this is an npm-distributed CLI, rollback is primarily about **tags and messaging**:

#### Preferred: move the `latest` dist-tag

If a bad version was published, repoint `latest` to a known-good version:

```bash
npm dist-tag add aicite@0.0.2 latest
```

#### Deprecate a bad version

```bash
npm deprecate aicite@0.0.3 "Bad release: use 0.0.2"
```

#### Unpublish (use sparingly)

`npm unpublish` is time-limited by npm policy and can break consumers; prefer dist-tags/deprecation.

### Python Package Rollback

For PyPI packages, rollback options are more limited:

#### Deprecate a bad version

You can mark a version as deprecated using the PyPI web interface or via tools like `twine` (though twine doesn't support deprecation directly). The recommended way is to use the [PyPI API](https://warehouse.pypa.io/api-reference/json.html) or the web interface.

#### Remove a bad version

PyPI allows you to remove packages under certain conditions (e.g., if the version was published within the last 24 hours). This is generally not recommended as it can break consumers who have already installed the version.

The recommended approach is to publish a new version that fixes the issue and update your documentation to recommend users install the latest version.

---

## CI/CD Pipeline (Current)

There is no repository CI/CD workflow configured in `.github/workflows/` as of 8 March 2026.

Current release process is manual:

- validate with `cd npx && npm run smoke` and `cd npx && npm run pack:dry`
- publish from `npx/`

---

## Common Issues & Troubleshooting

### Publish fails due to auth/permissions

- Symptoms: `npm publish` returns 401/403.
- Fix: run `npm whoami` to confirm auth; ensure your account has publish rights for the `aicite` package.

### Templates missing from published package

- Symptoms: users see “Unable to locate templates” or generated output is incomplete.
- Fix: ensure `prepack` ran (it syncs `templates/` → `npx/templates/`); verify with `cd npx && npm run pack:dry` before publishing.

### Setup overwrote files unexpectedly

- Expected behavior: no overwrites unless `--force`.
- Fix: confirm invocation didn’t include `--force`; check whether your target directory already had files with the same paths.

---

## Tracker Status

| Area | Status | Notes |
|---|---|---|
| Manual publish procedure | ✅ Documented | publish from `npx/`; verify via `npx …` |
| Rollback strategy | ✅ Documented | dist-tags + deprecations |
| CI/CD automation | 🔄 In Progress | no workflows present yet |