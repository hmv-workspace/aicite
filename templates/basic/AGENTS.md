# AGENTS.md

## Docs are the source of truth

Always check `docs/` before designing, developing, testing, or deploying:

1. `docs/requirements.md` — WHAT to build
2. `docs/architecture.md` — HOW it's designed
3. `docs/development.md` — HOW it's built (build plan, API contract, key decisions/learnings)
4. `docs/testplan.md` — test cases (guardrail tests are labeled TC-xxx)
5. `docs/deployment.md` — deploy/operational procedures

## Operating rules

- Ask clarifying questions when requirements, architecture, or intent are unclear — don't assume.
- Keep responses short and focused on what was asked.
- Keep `docs/` aligned with implementation reality; use ✅ Complete / 🔄 In Progress / ⚠️ Blocked status markers.
- Get explicit user approval before finalizing major doc updates or making source code changes.
- Do not create additional documents unless explicitly instructed.
- Each doc under `docs/` declares an **Owner** role in its header (Product, Architect, Engineer, DevOps). Only finalize edits to a doc when acting in its owner's role; otherwise draft the change and flag it for handoff to the owning role.

These rules apply regardless of which AI tool is running, including tools with no dedicated config file, which can read this one directly.
