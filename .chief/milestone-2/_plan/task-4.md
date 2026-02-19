# Task 4: Write Expected Mermaid Fixtures and Update All Tests

## Objective

Create expected Mermaid output fixture files for all test scenarios across all three dialects, and update the test infrastructure to compare against `.mermaid` files instead of `.dbml` files.

## Scope

**Included:**
- Create expected `.mermaid` fixture files for all existing test scenarios:
  - PG: types, constraints, inline-fk, fk, indexes, schemas, relations, schemas-rqb, real
  - MySQL: types, constraints, inline-fk, fk, indexes, schemas, relations, schemas-rqb, real
  - SQLite: types, constraints, inline-fk, fk, indexes, relations, real
- Update `src/__tests__/utils.ts` to compare `.mermaid` files
- Update all three test files to generate `.mermaid` output files
- Verify all tests pass

**Excluded:**
- Generator logic changes (tasks 1-3 must be complete)
- DBML file cleanup (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-2/_contract/mermaid-er-syntax.md` (all sections, used to write expected outputs)
- `.chief/milestone-2/_contract/drizzle-type-coverage.md` (what each fixture must cover)
- `.chief/milestone-2/_contract/edge-cases.md`

## Steps

1. For each test scenario, manually derive the expected Mermaid output by applying the contract rules to the drizzle schema defined in the test. Write each as `<name>.mermaid` in the corresponding test directory.
2. Update `src/__tests__/utils.ts`:
   - Change `compareContents()` to look for `.mermaid` extension instead of `.dbml`
   - Update the file path replacement: `.generated.mermaid` -> `.mermaid`
3. Update `src/__tests__/pg/_pg.test.ts`:
   - Change all `out` paths from `.generated.dbml` to `.generated.mermaid`
   - Import `pgGenerate` (unchanged)
4. Update `src/__tests__/mysql/_mysql.test.ts`:
   - Change all `out` paths from `.generated.dbml` to `.generated.mermaid`
5. Update `src/__tests__/sqlite/_sqlite.test.ts`:
   - Change all `out` paths from `.generated.dbml` to `.generated.mermaid`
6. Run `bun run test:all` and fix any fixture mismatches

## Acceptance Criteria

- All expected `.mermaid` fixture files exist and contain valid Mermaid ER syntax
- `bun run test:pg` passes (9 tests)
- `bun run test:mysql` passes (9 tests)
- `bun run test:sqlite` passes (7 tests)
- `bun run test:all` passes (25 tests total)
- Each fixture renders correctly in a Mermaid renderer (manual spot-check for at least the "real" scenarios)

## Verification

```bash
bun run test:all
```

## Deliverables

- Expected fixture files: `src/__tests__/pg/*.mermaid`, `src/__tests__/mysql/*.mermaid`, `src/__tests__/sqlite/*.mermaid`
- Updated `src/__tests__/utils.ts`
- Updated `src/__tests__/pg/_pg.test.ts`
- Updated `src/__tests__/mysql/_mysql.test.ts`
- Updated `src/__tests__/sqlite/_sqlite.test.ts`
- Report at `.chief/milestone-2/_report/task-4/`
