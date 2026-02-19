# Contract: API Surface

This contract defines the public API of the package after the pivot to Mermaid output.

## Exported Functions

### `pgGenerate(options: Options<T>): string`

Generates a Mermaid ER diagram string from a PostgreSQL drizzle schema.

### `mysqlGenerate(options: Options<T>): string`

Generates a Mermaid ER diagram string from a MySQL drizzle schema.

### `sqliteGenerate(options: Options<T>): string`

Generates a Mermaid ER diagram string from a SQLite drizzle schema.

## Options Type

```ts
export type Options<Schema> = {
  schema: Schema;
  out?: string;
  relational?: boolean;
};
```

- `schema` - The drizzle schema object containing tables, relations, and (for PG) enums
- `out` - Optional file path. If provided, writes the generated Mermaid string to this file
- `relational` - If `true`, uses drizzle `relations()` to determine relationships instead of foreign keys. Defaults to `false`.

## Schema Types

Retain the existing schema type definitions:

```ts
export type AnySchema = Schema;
export type PgSchema = Schema<PgEnum<[string, ...string[]]>>;
export type MySqlSchema = Schema;
export type SQLiteSchema = Schema;
```

## Return Value

All three functions return a `string` containing valid Mermaid `erDiagram` markup.

## File Output

When `out` is provided:
- Write the generated string to the specified path
- Use UTF-8 encoding
- Resolve the path relative to `process.cwd()`

## Entry Point

`src/index.ts` re-exports from `src/generators/index.ts`. This remains unchanged.

```ts
// src/index.ts
export * from "./generators";
```

## Package Exports

The package.json `main`, `module`, and `typings` fields remain unchanged:

```json
{
  "main": "dist/index.cjs",
  "module": "dist/index.js",
  "typings": "dist/index.d.ts"
}
```

## Breaking Changes

This is a **breaking change** from the DBML output. The function signatures remain the same, but the output format changes entirely. The major version should be bumped when released.
