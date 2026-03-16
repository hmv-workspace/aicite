# aicite

Open-source CLI utility to bootstrap AI assistant project context and agent prompts.

## Usage

```bash
npx aicite setup
```

This creates the following in the current working directory:

- `.github/` — GitHub Copilot guidance + agent personas
- `.kilocode/` — KiloCode configuration + agent personas
- `.cursor/` — Cursor IDE agent personas
- `docs/` — project documentation skeleton

## Options

- `--force` — Overwrite existing generated files
- `--only <targets>` — Comma-separated targets: copilot,kilocode,cursor,docs (default: all). Note: docs are always generated.
- `--copilot` — Generate only .github/ (Copilot)
- `--kilocode` — Generate only .kilocode/ (KiloCode)
- `--cursor` — Generate only .cursor/ (Cursor IDE)
- `--docs` — Generate only docs/

## License

MIT
