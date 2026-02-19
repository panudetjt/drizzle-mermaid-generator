# Task 1: Create MermaidBuilder and Type Normalization Utilities

## Objective

Replace the `DBML` string builder class with a `MermaidBuilder` class tailored to Mermaid ER diagram syntax, and create a utility function for normalizing SQL type strings into Mermaid-safe tokens.

## Scope

**Included:**
- New file `src/mermaid.ts` containing the `MermaidBuilder` class
- New utility function `normalizeSqlType(sqlType: string): string` in `src/utils.ts`
- Unit-level validation that the builder produces correct Mermaid syntax fragments

**Excluded:**
- Generator logic (task-2)
- Dialect-specific code (task-3)
- Removal of `dbml.ts` (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-2/_contract/mermaid-er-syntax.md` (sections 1-4, Type Mapping)
- `.chief/milestone-2/_contract/edge-cases.md` (SQL Types With Complex Syntax)

## Steps

1. Create `src/mermaid.ts` with a `MermaidBuilder` class that supports:
   - `header()` - inserts `erDiagram\n`
   - `entityStart(name: string)` - inserts `    <name> {\n`
   - `entityEnd()` - inserts `    }\n`
   - `attribute(type: string, name: string, constraints?: string, comment?: string)` - inserts attribute line
   - `relationship(left: string, leftCardinality: string, rightCardinality: string, right: string, label: string)` - inserts relationship line
   - `newLine()` - inserts blank line
   - `build()` - returns the accumulated string, trimmed
2. Create `normalizeSqlType(sqlType: string): string` in `src/utils.ts`:
   - Handle array types (strip `[]` / `[N][]`, append `_array` / `_2d_array`)
   - Strip parenthesized parameters: `varchar(255)` -> `varchar`
   - Replace spaces with underscores: `double precision` -> `double_precision`
   - Apply special-case mappings: `timestamp with time zone` -> `timestamptz`
3. Create `sanitizeName(name: string): string` in `src/utils.ts`:
   - Replace non-alphanumeric/underscore characters with underscores
   - Ensure name starts with a letter or underscore

## Acceptance Criteria

- `MermaidBuilder` can produce syntactically correct Mermaid ER fragments
- `normalizeSqlType` correctly handles all types listed in the Type Mapping contract table
- `sanitizeName` produces valid Mermaid identifiers
- All new code is TypeScript, strict-mode compatible
- `bun run lint` passes on new files
- `bun run fmt:check` passes on new files

## Verification

```bash
bun run lint
bun run fmt:check
```

Builder-agent should write a small inline test or assertion in the task report to confirm type normalization works for key cases.

## Deliverables

- `src/mermaid.ts`
- Updated `src/utils.ts`
- Report at `.chief/milestone-2/_report/task-1/`
