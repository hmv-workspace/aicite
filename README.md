# AiCite

Open-source specs-driven development (SDD) scaffolding CLI for AI agent alignment. Bootstraps shared documentation and assistant guidance in minutes.

## What is AiCite?

AiCite is a powerful yet simple CLI tool that helps teams get started with specs-driven development. It creates a shared context for both humans and AI agents by generating:

- **Centralized documentation**: Requirements, architecture, implementation, and deployment guides in `docs/`
- **AI agent guidance**: Configuration for tools like GitHub Copilot and KiloCode (with extensibility for more tools)
- **Version-controlled context**: All artifacts are local to your repository for full control

## Why Use AiCite?

### Benefits for Developers
- **One-command setup**: Initialize your project in seconds
- **Consistent AI interactions**: All agents work from the same source of truth
- **Prevents scope creep**: Clear requirements from the start
- **Easy onboarding**: New team members understand the project faster

### Benefits for Architects
- **Architecture-first approach**: Design is documented before implementation
- **Living specifications**: Documentation evolves with the codebase
- **Alignment across tools**: GitHub Copilot and KiloCode share the same context
- **Version-controlled docs**: Changes are tracked with your code

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

#### Generate documentation and KiloCode guidance
```bash
npx aicite@latest setup --kilocode
```

#### Overwrite existing files (use with caution)
```bash
npx aicite@latest setup --force
```

### Options
- `--force`: Overwrite existing generated files
- `--only copilot,kilocode,docs`: Generate only selected targets (docs are always included)
- `--copilot` / `--kilocode` / `--docs`: Convenience flags for selective generation

## What Gets Generated?

| Target | Description |
|--------|-------------|
| `docs/` | Requirements, architecture, implementation, and deployment guides |
| `copilot` | GitHub Copilot agent personas and guidance under `.github/` |
| `kilocode` | KiloCode configuration including `.kilocodemodes` file and `.kilocode/` folder |
| (future) | Support for additional AI tools and agents |

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

### For Architects

Use these prompts to work with AI agents on architectural and project tracking tasks:

```
I need to define the requirements for a new feature that allows users to export their data. Help me update the requirements document.
```

```
We're planning to refactor our authentication system. Can you help me design the new architecture and document the changes?
```

```
I want to understand the current architecture of our project. Can you analyze the codebase and update the architecture document?
```

```
Generate a project tracking status report based on the current documentation.
```

```
What are the current project blockers based on the requirements and architecture documents?
```

```
Provide a summary of last week's status and current dependencies from the project documents.
```

```
Scan the project and prepare/update all documentation to reflect the current state.
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
What is the high priority task to pick up next based on the requirements document?
```

```
Update the development progress status in the implementation document.
```

## Real-World Example

Let's see AiCite in action with a typical project scenario:

1. **Project initialization**: A developer runs `npx aicite@latest setup` to create the initial documentation and AI agent guidance.
2. **Requirements gathering**: The architect uses an AI agent with the prompt: "Help me define the requirements for a user authentication feature" and updates `docs/requirements.md`.
3. **Architecture design**: The architect collaborates with an AI agent to design the authentication system and updates `docs/architecture.md`.
4. **Implementation**: A developer uses an AI agent with the prompt: "Help me implement the user authentication feature based on the requirements and architecture" to write the code.
5. **Progress tracking**: The team uses AI agents to generate status reports, identify blockers, and update documentation with real-time progress.
6. **Iteration**: As the project evolves, the team updates the specifications, and AI agents provide consistent guidance across all tools.

This workflow ensures that everyone is aligned from the start, reduces rework, and improves collaboration between humans and AI.

## Why AiCite Stands Out

- **Specs-driven alignment**: All work is based on clear, documented requirements and architecture
- **Tool agnostic**: Works with GitHub Copilot, KiloCode, and will support more tools in the future
- **Version-controlled context**: Documentation and AI guidance are tracked with your code
- **Easy to adopt**: One command to get started with best practices
- **Scalable**: Grows with your project from small apps to large systems

## Contributing

We welcome contributions from the community! AiCite is built with specs-driven development, and we follow these principles in our own work. Here's how you can contribute:

### Getting Started

1. Fork the repository
2. Clone your forked repository
3. Set up the development environment (see `docs/implementation.md` for details)
4. Make your changes
5. Run the tests (see `docs/implementation.md` for test commands)
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
