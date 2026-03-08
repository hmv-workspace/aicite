# AiCite

Monorepo for the **AiCite** project.

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
