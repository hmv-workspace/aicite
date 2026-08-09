# Test Plan Template

> **Created:** August 2026  
> **Owner:** Engineer

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

---

## Test Strategy

> Define scope, tools, and coverage targets for each test type (unit, integration, E2E, manual).

---

## Test Environments

> Define each test environment, its purpose, and its data source.

---

## Test Cases (Guardrail)

> Guardrail tests protect against regressions in behavior that must never silently break. Every guardrail test gets a stable `TC-xxx` ID, referenced from code comments, PR descriptions, or [development.md](./development.md) where relevant.

---

## Entry and Exit Criteria

> Define the criteria that must be met before testing begins (entry) and before the plan is considered complete (exit).

---

## Defect Management

> Track defects found during testing, linked to the guardrail test case (`TC-xxx`) that surfaced them.

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
