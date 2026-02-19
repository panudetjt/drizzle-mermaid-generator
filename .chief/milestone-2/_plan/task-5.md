# Task 5: Remove DBML Code, Update Package Metadata, Final Verification

## Objective

Clean up the codebase by removing all DBML-specific code and artifacts, updating package metadata to reflect the Mermaid focus, and performing a final end-to-end verification.

## Scope

**Included:**
- Delete `src/dbml.ts`
- Remove all `.dbml` expected fixture files from `src/__tests__/`
- Update `.gitignore` to ignore `*.generated.mermaid` instead of `*.generated.dbml`
- Update `package.json`: description, keywords
- Verify no remaining references to "dbml" or "DBML" in source code (test files, generators, utils)
- Full build, lint, format, and test pass

**Excluded:**
- Version bump (left to human decision)
- README updates (deferred)
- CLI implementation (future milestone)

## Rules & Contracts to Follow

- `.chief/milestone-2/_goal/goal.md` (success criteria: no DBML code remains)
- `.chief/milestone-2/_contract/api-surface.md` (package exports)

## Steps

1. Delete `src/dbml.ts`
2. Search for any remaining imports of `dbml` or references to `DBML` in `src/` -- remove or update them
3. Delete all `.dbml` fixture files in `src/__tests__/pg/`, `src/__tests__/mysql/`, `src/__tests__/sqlite/`
4. Delete all `.generated.dbml` files (should already be gitignored)
5. Update `.gitignore`: change `*.generated.dbml` to `*.generated.mermaid`
6. Update `package.json`:
   - `description`: "Convert your Drizzle ORM schema into Mermaid ER diagrams"
   - `keywords`: replace "mermaid" is already present, ensure list is: `["drizzle-orm", "mermaid", "er-diagram", "typescript"]`
7. Run full verification suite

## Acceptance Criteria

- `src/dbml.ts` does not exist
- No `.dbml` fixture files exist in test directories
- No source file in `src/` contains the string "dbml" or "DBML" (case-insensitive search)
- `.gitignore` references `*.generated.mermaid`
- `package.json` description and keywords reflect Mermaid
- `bun run build` succeeds
- `bun run test:all` passes
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
bun run build
bun run test:all
bun run lint
bun run fmt:check
# Verify no DBML references remain:
grep -ri "dbml" src/ || echo "No DBML references found"
```

## Deliverables

- Deleted files: `src/dbml.ts`, all `src/__tests__/**/*.dbml`
- Updated `.gitignore`
- Updated `package.json`
- Report at `.chief/milestone-2/_report/task-5/`
