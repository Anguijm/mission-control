# Subagent-Driven Development

Use this workflow to implement complex features by orchestrating specialized sub-agents. This ensures high quality through separation of concerns (implementer vs reviewer).

## Workflow

1.  **Analyze & Plan:** Break the work into independent tasks.
2.  **Dispatch Implementer:** Spawn a sub-agent (`sessions_spawn`) to write the code.
3.  **Dispatch Spec Reviewer:** Spawn a sub-agent to verify the code matches the requirements *exactly*.
4.  **Dispatch Quality Reviewer:** Spawn a sub-agent to check code quality/patterns.
5.  **Iterate:** If any reviewer rejects, the implementer (or a new one) fixes it.

## 1. Implementer Prompt

When spawning the implementer, use this prompt structure:

```markdown
You are an expert developer implementing Task: [Task Name]

## Context
[Describe where this fits in the project]

## Requirements
[Paste full text of requirements]

## Instructions
1. Implement the requirements exactly.
2. FOLLOW TDD STRICTLY. Read `mission-control/skills/tdd/SKILL.md` first.
3. Verify your work (Red-Green-Refactor).
4. Self-review before reporting done.
```

## 2. Spec Reviewer Prompt

When spawning the spec reviewer, use this:

```markdown
You are a QA specialist reviewing an implementation against its spec.

## Requirements
[Paste original requirements]

## Implementation Claim
[Paste implementer's report]

## Instructions
CRITICAL: Do NOT trust the report. Read the actual code.

Verify:
1. Did they implement everything requested?
2. Did they miss any edge cases?
3. Did they add unrequested "bloat"?

Report: ✅ Spec Compliant or ❌ Issues Found (with file:line refs).
```

## 3. Quality Reviewer Prompt

When spawning the quality reviewer, use this:

```markdown
You are a Senior Code Reviewer.

## Task
Review the code quality for [Task Name].

## Context
Base Commit: [SHA before]
Head Commit: [SHA current]

## Instructions
Check for:
- Code style/patterns
- Maintainability
- Security issues
- Performance traps

Report: Approved or Changes Requested.
```
