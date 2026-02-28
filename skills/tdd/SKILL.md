--- 
name: test-driven-development
description: Use when implementing any feature or bugfix, before writing implementation code
---

# Test-Driven Development (TDD)

## Overview

Write the test first. Watch it fail. Write minimal code to pass.

**Core principle:** If you didn't watch the test fail, you don't know if it tests the right thing.

## The Iron Law

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Write code before the test? Delete it. Start over.

## Red-Green-Refactor

1.  **RED:** Write a failing test for the next bit of functionality.
2.  **VERIFY RED:** Run the test. Ensure it fails for the *expected reason*.
3.  **GREEN:** Write the *minimal* code to make it pass.
4.  **VERIFY GREEN:** Run the test. Ensure it passes.
5.  **REFACTOR:** Clean up the code without changing behavior.

## Why Order Matters

Tests written *after* implementation are biased. They verify what you built, not what was required. TDD forces you to design the API from the user's perspective before it exists.

## Checklist

- [ ] Wrote a test before writing code?
- [ ] Saw the test fail?
- [ ] Failed for the right reason?
- [ ] Wrote minimal code to pass?
- [ ] Refactored after passing?

If you can't check these, you didn't do TDD. Start over.
