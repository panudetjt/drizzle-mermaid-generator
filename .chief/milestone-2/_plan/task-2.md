# Task 2: Implement Mermaid BaseGenerator

## Objective

Create a new `BaseGenerator` class (replacing the DBML-oriented one) that generates Mermaid ER diagram output from drizzle schema objects.

## Scope

**Included:**
- New `src/generators/common.ts` replacing the existing DBML-based `BaseGenerator`
- Entity generation (tables to Mermaid entities with attributes)
- Attribute constraint markers (PK, FK, UK) and comment strings
- Foreign key relationship generation (both inline and extra config)
- Relational query builder relationship generation
- Enum handling (PG enums: skip entity, use `enum` type token)
- File write utility (`writeMermaidFile`)

**Excluded:**
- Dialect-specific subclass overrides (task-3)
- Test updates (task-4)
- Removing old code (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-2/_contract/mermaid-er-syntax.md` (all sections)
- `.chief/milestone-2/_contract/api-surface.md`
- `.chief/milestone-2/_contract/drizzle-type-coverage.md` (constraints, foreign keys, relations, composite PKs)
- `.chief/milestone-2/_contract/edge-cases.md` (all)

## Steps

1. Rewrite `src/generators/common.ts`:
   - Import and use `MermaidBuilder` from `src/mermaid.ts` instead of `DBML`
   - Import and use `normalizeSqlType` and `sanitizeName` from `src/utils.ts`
   - `generateColumn()`: produce attribute line with normalized type, name, constraint markers (PK/FK/UK), and comment string (not null, increment, default)
   - `generateTable()`: produce entity block with all columns. For composite PKs from extra config, mark all constituent columns with PK.
   - `generateForeignKeys()`: produce Mermaid relationship lines using `||--o{` pattern with FK name as label
   - `generateRelations()`: produce Mermaid relationship lines using appropriate cardinality (`||--||` for one-to-one, `||--o{` for one-to-many), with relation name as label
   - `generateEnum()`: return empty string (no separate entity). Column type normalization handles this.
   - `generate()`: orchestrate all generation, produce final Mermaid string via builder
2. Implement `writeMermaidFile(mermaid: string, outPath: string)` to replace `writeDBMLFile`
3. Ensure FK columns get the `FK` constraint marker on their attribute line
4. Handle schema-prefixed entity names per contract

## Acceptance Criteria

- `BaseGenerator.generate()` returns a valid Mermaid `erDiagram` string
- Entity blocks contain correctly formatted attributes with types, names, and constraint markers
- Foreign key relationships produce `||--o{` lines with correct entity references
- Relational API relationships produce correct cardinality notation
- Composite primary keys mark all constituent columns with `PK`
- Schema-prefixed entity names use underscore separator
- Empty schemas return just `erDiagram`
- Self-referencing FKs produce valid relationship lines
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
bun run lint
bun run fmt:check
```

Compilation check: `bunx tsc --noEmit` (may have errors from dialect files not yet updated -- acceptable at this stage)

## Deliverables

- Updated `src/generators/common.ts`
- Report at `.chief/milestone-2/_report/task-2/`
