# Task 4: Wire CLI to Existing Generator Functions

## Objective

Connect the CLI entry point to the schema loader and existing generator functions to produce Mermaid output.

## Scope

**Included:**
- Import generator functions (`pgGenerate`, `mysqlGenerate`, `sqliteGenerate`)
- Map dialect argument to correct generator
- Call generator with loaded schema
- Write output to file or stdout

**Excluded:**
- Help text (task-5)
- Package.json bin setup (task-6)

## Rules & Contracts to Follow

- Use existing generator API from `src/generators/pg.ts`, `src/generators/mysql.ts`, `src/generators/sqlite.ts`
- Follow output format defined in milestone-2 contracts

## Steps

1. In `src/cli.ts`, import generators:
   ```typescript
   import { pgGenerate } from './generators/pg'
   import { mysqlGenerate } from './generators/mysql'
   import { sqliteGenerate } from './generators/sqlite'
   import { loadSchema } from './loader'
   ```
2. Create dialect-to-generator map:
   ```typescript
   const generators = {
     pg: pgGenerate,
     mysql: mysqlGenerate,
     sqlite: sqliteGenerate
   }
   ```
3. Load schema using `loadSchema(args.schema)`
4. Call generator with schema: `const mermaid = generator(schema)`
5. If `--out` specified, write to file; otherwise print to stdout
6. Handle generator errors gracefully (exit 1)

## Acceptance Criteria

- CLI generates correct Mermaid output for all three dialects
- Output to file works correctly
- Output to stdout works correctly
- Generator errors produce exit code 1 with error message
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
# Test with existing fixture
bun run src/cli.ts --dialect pg --schema src/__tests__/pg/fixtures/types.ts --out /tmp/test.mermaid
cat /tmp/test.mermaid  # Should contain erDiagram

bun run src/cli.ts --dialect mysql --schema src/__tests__/mysql/fixtures/basic.ts  # Should output to stdout
```

## Deliverables

- Updated `src/cli.ts`
