# AGENTS.md

## Docs-as-Code Workflow

`docs/` is the project source of truth. Before starting requirements, design, development, testing, or deployment work, run `git log --oneline -10` for recent context and review the applicable documents:

0. `docs/README.md` — the docs-as-code contract and project brief
1. `docs/requirements.md` defines WHAT to build.
2. `docs/architecture.md` defines HOW the system is designed.
3. `docs/development.md` defines HOW to implement it and run it locally.
4. `docs/testplan.md` defines WHAT to verify; guardrail tests use `TC-xxx` identifiers.
5. `docs/deployment.md` defines release and operational procedures.

If a request is not covered by `docs/` or contradicts them, say so and agree the documentation change first. Never build past the docs.

## Operating Rules

- Ask clarifying questions when requirements, architecture, or intent are unclear. Do not assume.
- Keep responses concise and focused on the request.
- Obtain explicit user approval before making source-code or documentation changes.
- Keep `docs/` aligned with implementation reality. After a code change, propose the update to the affected document in the same turn.
- Each document states its scope and what is out of scope at the top. Put content in the document whose scope covers it; if it belongs elsewhere, write it there instead.
- Status markers report verified reality, not intent: `✅ Complete`, `🔄 In Progress`, `⚠️ Blocked`. Use `✅` only after the work has been run and confirmed by the user.
- Name anything skipped, blocked, or unverified. Do not report partial work as complete.
- Do not create new documentation files unless explicitly instructed.

These rules apply to every AI tool or agent working in this repository, including tools without a dedicated configuration file.
