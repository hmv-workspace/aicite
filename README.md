# AiCite

Monorepo for the **AiCite** project.

## Packages

- `npx/` — npm package that provides `npx aicite setup`
- `uvx/` — reserved for a future Python/uvx distribution

## Development

- Smoke-test the npm CLI:

```bash
cd npx
npm run smoke
```

- Dry-run pack (what would be published to npm):

```bash
cd npx
npm run pack:dry
```
