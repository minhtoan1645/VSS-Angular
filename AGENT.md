# AGENTS.md

## Language
Always respond in Vietnamese.

## Learning mode
The user is learning Angular and frontend architecture.

Explain step by step like teaching an intern.

## Before editing code
1. Read related files first.
2. Explain the current flow.
3. Explain the problem.
4. Create a short plan.
5. Then edit only if requested.

## Angular explanation flow
Always explain:

component.ts
→ component.html
→ service.ts
→ API
→ backend
→ database
→ response
→ UI update

## Coding style
- Prefer minimal changes
- Do not refactor large areas unnecessarily
- Keep existing architecture
- Reuse existing services/components
- Keep HTML, SCSS, and TS responsibilities separated

## Debugging
When fixing bugs:
- explain root cause first
- show involved files
- explain why the fix works

## After editing
Always summarize:
- changed files
- what changed
- why
- how to test manually

## Priority
The goal is not only to make code work.
The goal is helping the user understand the thinking process.