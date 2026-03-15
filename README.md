# AiCite

Monorepo for the **AiCite** project — an open-source scaffolding CLI built with **specs-driven development (SDD)**. AiCite bootstraps a project’s AI-assistant context so humans and AI agents can stay aligned through a shared, repo-local documentation set and agent guidance files.

## What is Specs-Driven Development?

AiCite follows an SDD approach: we define comprehensive specifications for requirements, architecture, and implementation before writing code. This ensures consistency, clarity, and alignment between all stakeholders.

Key benefits:
- **Clear requirements first**: Every feature is defined with measurable objectives
- **Architecture-driven design**: Solutions are planned before implementation
- **Living documentation**: Specifications evolve with the project
- **Alignment across tools**: AI agents and humans work from the same source of truth

## Packages

- `npx/` — npm package that provides `npx aicite setup`
- `uvx/` — Python package that provides `uvx aicite setup` (published to PyPI)

## Development

### npm CLI

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

### Python CLI

- Smoke-test the Python CLI:

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install -e .
aicite --help
```

- Build the package:

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install build
python -m build
```

- Publish to PyPI:

```bash
cd uvx
python3 -m venv venv
source venv/bin/activate
pip install twine
twine upload dist/*
```
