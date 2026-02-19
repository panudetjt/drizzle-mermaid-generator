# Task 7: Test with All Fixture Files and Verify No Process Kills

## Objective

Run comprehensive end-to-end testing to ensure validation works correctly and no processes are killed due to timeout or resource issues.

## Scope

**Included:**
- Test with all fixture .mermaid files
- Verify parallel execution works
- Verify no process kills/timeouts
- Verify correct exit codes
- Test error scenarios
- Document test results

**Excluded:**
- Code changes (unless bugs found)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_goal/goal.md` (success criteria)

## Steps

1. Run validation on all fixtures:
   ```bash
   bun run validate:mermaid
   ```
2. Verify:
   - All 25 files validated
   - No processes killed
   - Exit code 0
3. Test with different concurrency levels:
   ```bash
   bun run validate:mermaid --concurrency 1
   bun run validate:mermaid --concurrency 4
   bun run validate:mermaid --concurrency 8
   ```
4. Test verbose mode:
   ```bash
   bun run validate:mermaid --verbose
   ```
5. Test with intentional failure:
   - Create invalid .mermaid file
   - Run validation
   - Verify failure detected and reported
   - Verify exit code 1
   - Delete invalid file
6. Test timeout handling:
   ```bash
   bun run validate:mermaid --timeout 1  # Should timeout
   ```
7. Test shell fallback:
   ```bash
   bun run validate:mermaid:shell
   ```
8. Run full verification suite:
   ```bash
   bun run lint
   bun run fmt:check
   bun run test
   bun run validate:mermaid
   bun run build
   ```
9. Document results

## Acceptance Criteria

- All success criteria from goal.md met:
  1. `bun run validate:mermaid` uses TypeScript script
  2. Validation runs in parallel with configurable concurrency
  3. Progress displayed during validation
  4. Process completes without being killed on CI
  5. Clear error messages when validation fails
  6. Shell fallback available via `validate:mermaid:shell`
- No process kills or timeouts with default settings
- All exit codes correct
- Error messages clear and actionable

## Verification

```bash
# Full verification
bun run lint && bun run fmt:check && bun run test && bun run validate:mermaid && bun run build
```

## Deliverables

- `.chief/milestone-perf-validate/_report/task-7/test-results.md`
