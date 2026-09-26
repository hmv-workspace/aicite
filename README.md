# AiCite

## The Specs-Driven AI Development Framework

Open-source specs-driven development (SDD) framework for AI agent alignment. Bootstraps shared documentation and assistant guidance in minutes, creating a version-controlled context for both humans and AI agents.

## What is AiCite?

AiCite is a powerful yet simple specs-driven development (SDD) framework that helps teams get started with SDD. It creates a shared context for both humans and AI agents by generating:

- **Centralized documentation**: Requirements, architecture, development, test plan, and deployment guides in `docs/`
- **AI agent guidance**: Configuration for tools like GitHub Copilot, KiloCode, Cursor IDE, and Claude Code (with extensibility for more tools)
- **Version-controlled context**: All artifacts are local to your repository for full control

## What Gets Generated?

| Target | Description |
| --- | --- |
| `docs/` | Requirements, architecture, development, test plan, and deployment guides (always generated) |
| `copilot` | GitHub Copilot agent guidance under `.github/` |
| `kilocode` | KiloCode configuration including `.kilocodemodes` file and `.kilocode/` folder |
| `cursor` | Cursor IDE agent configuration under `.cursor/` |
| `claude` | `CLAUDE.md` for Claude Code |
| (future) | Support for additional AI tools and agents |

### Example output

Running `npx aicite@latest setup --copilot` in an empty repo produces:

```
your-project/
├── AGENTS.md
├── docs/
│   ├── README.md            # project overview
│   ├── requirements.md      # plain-English requirements, status-tracked
│   ├── architecture.md      # system design, decisions, diagrams (as text)
│   ├── development.md       # build plan, API contract, key decisions/learnings
│   ├── testplan.md          # test strategy, guardrail test cases (TC-xxx)
│   └── deployment.md        # deploy steps, environments, rollback notes
└── .github/
    └── agents/
        └── aicite.agent.md  # single cross-functional agent that reads docs/ before acting
```

Every generated file is plain markdown — readable in any editor, diffable in any PR, and independent of whatever language your actual codebase is written in.

## Relationship to agents.md

AiCite generates an `AGENTS.md` aligned with the [agents.md](https://github.com/agentsmd/agents.md) convention — the first file an agent reads in a repo. AiCite doesn't compete with it; it fills it in. `AGENTS.md` stays a thin router; `docs/` is the content model behind it, each document with its own scope and status tracking — so you don't have to cram everything into one file or reinvent doc structure per project.

## Why AiCite?

- **AI agent alignment**: Every AI tool (Copilot, KiloCode, Cursor, Claude Code, and more) works from the same specs, so you're not re-explaining context per tool.
- **Single source of truth**: Centralized, version-controlled documentation (requirements → architecture → development → testplan → deployment).
- **Architecture-first**: Documenting before coding prevents costly rework later.
- **Faster onboarding**: New team members understand the project structure in minutes.
- **Living documentation**: Status indicators (✅ 🔄 ⚠️) let AI agents generate progress reports on demand.
- **Minimal friction**: One command setup (`npx aicite@latest setup`) with safe defaults that won't overwrite existing work.

## Quick Start

Get started with AiCite in under a minute!

### JavaScript/Node.js (npm)
```bash
npx aicite@latest setup
```

### Python (uvx/PyPI)
```bash
uvx aicite setup
```

### Common Use Cases

#### Initialize a new project with all features
```bash
npx aicite@latest setup
```

#### Generate only documentation
```bash
npx aicite@latest setup --only docs
```

#### Generate documentation and GitHub Copilot guidance
```bash
npx aicite@latest setup --copilot
```

#### Generate documentation and Cursor IDE guidance
```bash
npx aicite@latest setup --cursor
```

#### Generate documentation and KiloCode guidance
```bash
npx aicite@latest setup --kilocode
```

#### Generate documentation and Claude Code guidance
```bash
npx aicite@latest setup --claude
```

#### Overwrite existing files (use with caution)
```bash
npx aicite@latest setup --force
```

### Options

- `--force`: Overwrite existing generated files
- `--only copilot,kilocode,cursor,claude,docs`: Generate only selected targets (docs are always included)
- `--cursor` / `--copilot` / `--kilocode` / `--claude` / `--docs`: Convenience flags for selective generation

## Specs-Driven Development

AiCite follows an SDD approach:

1. **Define requirements first**: Clear, measurable objectives
2. **Architect before coding**: Design solutions upfront
3. **Generate living docs**: Specifications evolve with the project
4. **Align across tools**: AI agents and humans work from the same source of truth

This ensures consistency, reduces rework, and improves collaboration between humans and AI.

## User Prompt Examples

### Project Tracking Benefits

AiCite's specs-driven approach enables powerful project tracking capabilities by maintaining up-to-date documentation with status indicators. AI agents can analyze these documents to provide real-time progress reports, identify blockers, and track dependencies.

### For Product Owners

Use these prompts to work with AI agents on requirements and backlog tasks:

```
Help me define the requirements for a new feature that allows users to export their data. Include acceptance criteria.
```

```
What are the current open questions or blockers in the requirements document?
```

```
Prioritize the pending requirements based on user impact and update the tracker status.
```

### For Architects

Use these prompts to work with AI agents on architectural and project tracking tasks:

```
We're planning to refactor our authentication system. Can you help me design the new architecture and document the changes?
```

```
I want to understand the current architecture of our project. Can you analyze the codebase and update the architecture document?
```

```
What are the current project blockers based on the requirements and architecture documents?
```

```
Let's brainstorm solutions for the performance issues mentioned in the architecture document.
```

### For Developers

Use these prompts to work with AI agents on development and project tracking tasks:

```
I need to implement the user authentication feature. Can you help me understand the requirements and architecture, then guide me through the implementation?
```

```
There's a bug in the data export functionality. Can you help me debug it and fix the issue?
```

```
I'm refactoring the payment processing code. Can you review my changes and provide feedback on architectural alignment?
```

```
Update the development progress status in the development document.
```

### For QA Engineers

Use these prompts to work with AI agents on test planning and verification:

```
Write guardrail test cases (TC-xxx) for the user authentication feature based on the requirements and development documents.
```

```
Go through the test plan and tell me which guardrail tests are failing or still pending.
```

```
A regression slipped through — help me add a new guardrail test case that would have caught it.
```

### For DevOps / Release Managers

Use these prompts to work with AI agents on deployment and operations:

```
Walk me through the deployment procedure for this release based on the deployment document.
```

```
What's the rollback plan if this deployment fails?
```

```
Update the deployment document with the monitoring and alerting setup we just configured.
```

### For Anyone (Status & Progress)

These work regardless of role — useful for stakeholders who just want a status check:

```
Generate a project tracking status report based on the current documentation.
```

```
Scan the project and prepare/update all documentation to reflect the current state.
```

## Contributing

We welcome contributions from the community! AiCite is built with specs-driven development, and we follow these principles in our own work. Here's how you can contribute:

> **Why does this repo show Python and JavaScript?** Those percentages reflect
> the two installer wrappers (`npx`/`npm` and `uvx`/`PyPI`) that ship AiCite,
> not the language of the docs or config it generates, and not a requirement
> on your project's stack.

### Getting Started

1. Fork the repository
2. Clone your forked repository
3. Set up the development environment (see `docs/development.md` for details)
4. Make your changes
5. Run the tests (see `docs/testplan.md` for guardrail test cases)
6. Submit a pull request

### Contribution Guidelines

- Follow the specs-driven development approach
- Keep changes focused on a single issue or feature
- Update documentation to reflect your changes
- Test your changes before submitting a pull request
- Be respectful and inclusive in your interactions with other contributors

### Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub. Include as much information as possible, including steps to reproduce the issue.

### License

AiCite is open-source software licensed under the MIT license.
