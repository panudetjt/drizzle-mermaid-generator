# Task 3: Add Schema File Loading and Dynamic Import Logic

## Objective

Implement the logic to load a drizzle schema file and extract the schema object for generation.

## Scope

**Included:**
- Resolve schema file path (relative or absolute)
- Dynamic import of schema file
- Extract schema object from default export or named export
- Handle TypeScript/JavaScript schema files
- Handle ES modules and CommonJS

**Excluded:**
- Generator wiring (task-4)
- CLI help text (task-5)

## Rules & Contracts to Follow

- Schema files may export default schema or named `schema` export
- Support both `*.ts` and `*.js` files
- Bun can import TypeScript directly

## Steps

1. Create `src/loader.ts` with schema loading function:
   ```typescript
   export async function loadSchema(filePath: string): Promise<DrizzleSchema>
   ```
2. Resolve file path using `path.resolve()`
3. Check file exists using `fs.existsSync()` or Bun's `Bun.file()`
4. Dynamic import: `const module = await import(resolvedPath)`
5. Extract schema:
   - Check `module.default` (default export)
   - Check `module.schema` (named export)
   - If array, use directly; if object with tables, extract tables
6. Throw descriptive error if schema cannot be extracted
7. Return normalized schema object

## Acceptance Criteria

- Loads TypeScript schema files via Bun's native TS support
- Handles both default and named exports
- Produces clear error for missing files
- Produces clear error for invalid schema format
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
# Manual test with existing fixture schemas
bun run -e "import { loadSchema } from './src/loader'; console.log(await loadSchema('./src/__tests__/pg/fixtures/types.ts'))"
```

## Deliverables

- `src/loader.ts`
