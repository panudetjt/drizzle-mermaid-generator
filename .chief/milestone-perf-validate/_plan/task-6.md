# Task 6: Update Package.json Scripts (Add Shell Fallback)

## Objective

Update package.json to use the new TypeScript validation script and provide a shell fallback.

## Scope

**Included:**
- Update `validate:mermaid` script to use TypeScript version
- Add `validate:mermaid:shell` as fallback
- Ensure scripts work on all platforms

**Excluded:**
- Testing (task-7)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_goal/goal.md` (shell script fallback requirement)

## Steps

1. Read current package.json scripts section
2. Find existing `validate:mermaid` script (likely a shell loop)
3. Rename to `validate:mermaid:shell`:
   ```json
   "validate:mermaid:shell": "for f in src/__tests__/*/*.mermaid; do bunx -p @mermaid-js/mermaid-cli mmdc -i \"$f\" -o /dev/null || exit 1; done"
   ```
4. Update `validate:mermaid` to use TypeScript:
   ```json
   "validate:mermaid": "bun run scripts/validate-mermaid.ts"
   ```
5. Verify script order in package.json

## Acceptance Criteria

- `bun run validate:mermaid` uses TypeScript worker pool version
- `bun run validate:mermaid:shell` uses original shell fallback
- Both scripts produce exit code 0 on success
- JSON is valid (no syntax errors)

## Verification

```bash
bun run validate:mermaid --help
bun run validate:mermaid:shell  # Should work as before
```

## Deliverables

- Updated `package.json`
