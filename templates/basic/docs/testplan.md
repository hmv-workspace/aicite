# Test Plan Template

> **Template Version:** 1.0
> **Created:** August 2026
> **Owner:** Engineer (finalize edits in this role; others may draft and flag for handoff — see [AGENTS.md](../AGENTS.md))
> **Scope:** This template defines the structure for documenting WHAT to verify and HOW. It is the single source of truth for test strategy, test environments, and the test case catalog. Guardrail tests (regressions that must never break) are labeled `TC-xxx` so other docs and code comments can reference them without rewriting. Replace all placeholders (in brackets) with project-specific details.

---

## Table of Contents

1. [Document Purpose](#document-purpose)
2. [Test Strategy](#test-strategy)
3. [Test Environments](#test-environments)
4. [Test Cases (Guardrail)](#test-cases-guardrail)
5. [Entry and Exit Criteria](#entry-and-exit-criteria)
6. [Defect Management](#defect-management)
7. [Tracker Status](#tracker-status)

---

## Document Purpose

> This document defines **WHAT to verify** and is the single source of truth for:
> - Test strategy (unit, integration, E2E, manual)
> - Test environments and data
> - The guardrail test case catalog (`TC-xxx`)
> - Entry/exit criteria and defect handling
>
> **For WHAT was built (requirements and acceptance criteria), see [requirements.md](./requirements.md).**
> **For HOW it was built (code structure, API contract), see [development.md](./development.md).**
> **For post-deployment smoke tests, see [deployment.md - Verification and Testing](./deployment.md#verification-and-testing).**

**Intended Audience:** QA Engineers, Developers, Tech Leads, AI Agents

---

## Test Strategy

| Type | Scope | Tools | Coverage Target |
|------|-------|-------|------------------|
| Unit | [Scope] | [Tools] | [Target] |
| Integration | [Scope] | [Tools] | [Target] |
| E2E | [Scope] | [Tools] | [Target] |
| Manual | [Scope] | [N/A] | [Target] |

---

## Test Environments

| Environment | Purpose | Data | Notes |
|-------------|---------|------|-------|
| Local | [Purpose] | [Data source] | [Notes] |
| CI | [Purpose] | [Data source] | [Notes] |
| Staging | [Purpose] | [Data source] | [Notes] |

---

## Test Cases (Guardrail)

> Guardrail tests protect against regressions in behavior that must never silently break. Every guardrail test gets a stable `TC-xxx` ID, referenced from code comments, PR descriptions, or [development.md](./development.md) where relevant.

| Test ID | Description | Type | Priority | Preconditions | Steps | Expected Result | Status |
|---------|--------------|------|----------|----------------|-------|-------------------|--------|
| TC-001 | [What it verifies] | [Unit/Integration/E2E/Manual] | [High/Med/Low] | [State before test] | [Steps to reproduce] | [Expected outcome] | 🔄 Pending |

---

## Entry and Exit Criteria

### Entry Criteria

- [ ] [Requirement 1, e.g., feature branch merged to test branch]
- [ ] [Requirement 2, e.g., build passes lint/type checks]

### Exit Criteria

- [ ] [Requirement 1, e.g., all High-priority TC-xxx cases pass]
- [ ] [Requirement 2, e.g., no open Critical/High defects]

---

## Defect Management

| Defect ID | Related TC | Severity | Description | Status |
|-----------|------------|----------|--------------|--------|
| [DEF-001] | [TC-xxx] | [Critical/High/Med/Low] | [Description] | 🔄 Pending |

---

## Tracker Status

> Track the completion status of each test plan section.

| Section | Status | Notes |
|---------|--------|-------|
| Test Strategy | 🔄 Pending | [Any notes] |
| Test Environments | 🔄 Pending | [Any notes] |
| Test Cases (Guardrail) | 🔄 Pending | [Any notes] |
| Entry/Exit Criteria | 🔄 Pending | [Any notes] |
| Defect Management | 🔄 Pending | [Any notes] |

**Status Legend:**
- ✅ Complete
- 🔄 In Progress
- ⚠️ Blocked
- ❌ Not Started

---

> *This is a template document. Replace all placeholder content with project-specific details.*
