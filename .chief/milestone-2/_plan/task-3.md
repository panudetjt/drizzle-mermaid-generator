# Task 3: Implement Dialect-Specific Generators and Public API

## Objective

Update the three dialect-specific generator files (PG, MySQL, SQLite) to work with the new Mermaid-based `BaseGenerator`, maintaining each dialect's unique behavior (auto-increment detection, enum handling, default value mapping).

## Scope

**Included:**
- Update `src/generators/pg.ts` - PG-specific overrides (serial detection, enum generation skip)
- Update `src/generators/mysql.ts` - MySQL-specific overrides (auto-increment detection)
- Update `src/generators/sqlite.ts` - SQLite-specific overrides (auto-increment, boolean default mapping)
- Ensure all three public functions (`pgGenerate`, `mysqlGenerate`, `sqliteGenerate`) return Mermaid strings
- Update `src/types.ts` if any type changes are needed

**Excluded:**
- Test file updates (task-4)
- DBML code removal (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-2/_contract/api-surface.md`
- `.chief/milestone-2/_contract/drizzle-type-coverage.md` (dialect-specific types)
- `.chief/milestone-2/_contract/mermaid-er-syntax.md` (section 7 - Enums)

## Steps

1. Update `src/generators/pg.ts`:
   - `PgGenerator` extends new `BaseGenerator`
   - Override `isIncremental()` for serial types
   - Override `generateEnum()` to return empty string (enums are not separate entities in Mermaid)
   - Remove DBML import, use MermaidBuilder if needed for any PG-specific formatting
   - `pgGenerate()` calls `writeMermaidFile` instead of `writeDBMLFile`
2. Update `src/generators/mysql.ts`:
   - `MySqlGenerator` extends new `BaseGenerator`
   - Override `isIncremental()` for serial and auto-increment columns
   - `mysqlGenerate()` calls `writeMermaidFile` instead of `writeDBMLFile`
3. Update `src/generators/sqlite.ts`:
   - `SQLiteGenerator` extends new `BaseGenerator`
   - Override `isIncremental()` for integer with autoIncrement
   - Override `mapDefaultValue()` for SQLite boolean default handling
   - `sqliteGenerate()` calls `writeMermaidFile` instead of `writeDBMLFile`
4. Ensure `src/generators/index.ts` still re-exports all three functions
5. Verify TypeScript compilation passes: `bunx tsc --noEmit`

## Acceptance Criteria

- All three generator functions compile without errors
- Each dialect correctly detects auto-increment columns
- PG generator does not produce separate enum entities
- SQLite generator maps boolean defaults to 0/1
- All functions return strings starting with `erDiagram`
- `bun run build` succeeds
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
bunx tsc --noEmit
bun run build
bun run lint
bun run fmt:check
```

## Deliverables

- Updated `src/generators/pg.ts`
- Updated `src/generators/mysql.ts`
- Updated `src/generators/sqlite.ts`
- Updated `src/types.ts` (if needed)
- Report at `.chief/milestone-2/_report/task-3/`
