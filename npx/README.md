# aicite

Open-source specs-driven development (SDD) framework for AI assistant alignment.

## Usage

```bash
npx aicite setup
```

This creates the following in the current working directory:

- `docs/` — project documentation skeleton (requirements, architecture, development, testplan, deployment)
- `AGENTS.md` — shared guidance for any AI agent
- `.github/` — GitHub Copilot agent guidance
- `.kilocode/` — KiloCode configuration + agent guidance
- `.cursor/` — Cursor IDE agent guidance
- `CLAUDE.md` — Claude Code guidance

## Options

- `--force` — Overwrite existing generated files
- `--only <targets>` — Comma-separated targets: copilot,kilocode,cursor,claude,docs (default: all). Note: docs are always generated.
- `--copilot` — Generate only .github/ (Copilot)
- `--kilocode` — Generate only .kilocode/ (KiloCode)
- `--cursor` — Generate only .cursor/ (Cursor IDE)
- `--claude` — Generate only CLAUDE.md (Claude Code)
- `--docs` — Generate only docs/

## License

MIT
