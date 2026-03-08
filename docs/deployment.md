# AiCite — Deployment (Publishing & Release Ops)

> **Document Version:** 0.1 (draft)  
> **Last Updated:** 8 March 2026  
> **Scope:** AiCite is a CLI (no servers). “Deployment” here means publishing the `aicite` npm package and verifying it works via `npx`.

---

## Document Index

- **WHAT to build:** [requirements.md](./requirements.md)
- **HOW it’s designed:** [architecture.md](./architecture.md)
- **HOW to build it:** [implementation.md](./implementation.md)
- **HOW to publish/deploy/operate:** this document

---

## Release Artifacts

| Artifact | Location in repo | Distribution |
|---|---|---|
| npm package `aicite` | `npx/` | npm registry (supports `npx aicite@latest …`) |
| Templates | `templates/basic/` → synced to `npx/templates/basic/` | bundled in npm tarball via `prepack` |

### Released Versions (npm)

As of 8 March 2026, the npm registry reports:

- `0.0.1`
- `0.0.2`
- `0.0.3`

---

## Environments

AiCite has no long-running runtime environments.

| Environment | Purpose | How used |
|---|---|---|
| Local development | iterate on CLI/templates | run workspace scripts from repo root |
| npm registry | distribution channel | `npm publish` from `npx/` |
| User machines | runtime | `npx aicite@latest setup …` |

---

## Publish Procedure (npm)

### Preconditions

- Node.js `>=18`
- npm account with publish permissions

### 1) Prepare the release

1. Update `npx/package.json` `version`.
2. Ensure templates are correct under `templates/basic/`.
3. Validate the publish artifact contents:

```bash
npm run pack:npx
```

This triggers the `npx/` `prepack` script, which syncs templates into `npx/templates/`.

### 2) Smoke-check the CLI locally

```bash
npm run smoke:npx
```

### 3) Publish

From repo root:

```bash
cd npx
npm publish
```

Notes:

- `npm publish` will run `prepublishOnly`/`prepack` hooks as applicable; in this repo `prepack` is the important one.
- Ensure `LICENSE`, `README.md`, `bin/`, and `templates/` are present in the published tarball (see `files` in `npx/package.json`).

---

## Verification (Post-Publish)

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

---

## Monitoring & Alerting (Release Quality)

AiCite has no production runtime to monitor. “Monitoring” is primarily **release correctness** and **template integrity**.

Recommended checks per release:

- **Pack integrity:** run `npm run pack:npx` and ensure `npx/templates/basic/` contains the expected templates.
- **CLI smoke:** run `npm run smoke:npx`.
- **Registry smoke:** run `npx --yes aicite@latest --help` and a minimal `setup` in a scratch directory.

Alerting:

- There is no automated alerting configured in this repo.
- If you add CI later, the simplest “alert” is to fail the pipeline on `smoke:npx` / `pack:npx`.

---

## Rollback / Mitigation

Because this is an npm-distributed CLI, rollback is primarily about **tags and messaging**:

### Preferred: move the `latest` dist-tag

If a bad version was published, repoint `latest` to a known-good version:

```bash
npm dist-tag add aicite@0.0.2 latest
```

### Deprecate a bad version

```bash
npm deprecate aicite@0.0.3 "Bad release: use 0.0.2"
```

### Unpublish (use sparingly)

`npm unpublish` is time-limited by npm policy and can break consumers; prefer dist-tags/deprecation.

---

## CI/CD Pipeline (Current)

There is no repository CI/CD workflow configured in `.github/workflows/` as of 8 March 2026.

Current release process is manual:

- validate with `npm run smoke:npx` and `npm run pack:npx`
- publish from `npx/`

---

## Common Issues & Troubleshooting

### Publish fails due to auth/permissions

- Symptoms: `npm publish` returns 401/403.
- Fix: run `npm whoami` to confirm auth; ensure your account has publish rights for the `aicite` package.

### Templates missing from published package

- Symptoms: users see “Unable to locate templates” or generated output is incomplete.
- Fix: ensure `prepack` ran (it syncs `templates/` → `npx/templates/`); verify with `npm run pack:npx` before publishing.

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