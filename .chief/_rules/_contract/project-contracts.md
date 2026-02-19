# Project Contracts

## Package Identity

- **Name**: `drizzle-mermaid-generator`
- **Type**: Library (published as npm package)
- **Peer dependency**: `drizzle-orm >= 0.45.1`
- **Output formats**: CJS (`dist/index.cjs`), ESM (`dist/index.js`), DTS (`dist/index.d.ts`)
- **License**: MIT

## Public API Surface

The library exports one generator function per supported dialect.

### Exported Functions

```ts
function pgGenerate<T>(options: Options<T>): string;
function mysqlGenerate<T>(options: Options<T>): string;
function sqliteGenerate<T>(options: Options<T>): string;
```

### Options Type

```ts
type Options<Schema> = {
  schema: Schema;   // drizzle-orm schema object
  out?: string;     // optional file path to write output
  relational?: boolean; // use RQB relations instead of FK refs
};
```

### Rules

- Generator functions must always return a string (the DBML markup)
- File write is optional and triggered only when `out` is provided
- The `relational` flag defaults to `false`
- No other functions or classes are part of the public API

## Internal Architecture Contract

### Generator Hierarchy

```
BaseGenerator (abstract)
  ├── PgGenerator
  ├── MySqlGenerator
  └── SQLiteGenerator
```

- `BaseGenerator` contains all shared generation logic
- Dialect generators override protected methods for dialect-specific behavior:
  - `InlineForeignKeys` symbol
  - `buildQueryConfig` (escape functions)
  - `isIncremental(column)` (auto-increment detection)
  - `generateEnum(enum_)` (Pg only)
  - `mapDefaultValue(value)` (SQLite overrides boolean handling)
- Generator classes are **not exported** -- only wrapper functions are public

### DBML Builder

The `DBML` class is a fluent string builder for constructing DBML markup.

```ts
class DBML {
  insert(str: string): this;
  concatAll(strs: string[]): this;
  escapeSpaces(str: string): this;
  escapeType(str: string): this;
  newLine(n?: number): this;
  tab(n?: number): this;
  build(): string;
}
```

- Indentation: 2 spaces per tab level
- All builder methods return `this` for chaining
- `build()` trims trailing whitespace and returns the final string

### Symbol Constants

Drizzle-orm internal symbols are re-exported from `src/symbols.ts`:

```ts
export const AnyInlineForeignKeys = Symbol.for("drizzle:AnyInlineForeignKeys");
export const TableName = Symbol.for("drizzle:Name");
export const Schema = Symbol.for("drizzle:Schema");
export const ExtraConfigBuilder = Symbol.for("drizzle:ExtraConfigBuilder");
export const ExtraConfigColumns = Symbol.for("drizzle:ExtraConfigColumns");
```

These are used to access internal drizzle-orm table metadata.

## Type Contracts

### Core Types (src/types.ts)

```ts
type AnyTable     // Augmented drizzle Table with symbol-keyed metadata
type AnyBuilder   // Object with build() returning constraint/index/FK
type AnySchema    // Record<string, DialectTypes | Relations | AnyTable | Table>
type PgSchema     // AnySchema + PgEnum support
type MySqlSchema  // AnySchema alias
type SQLiteSchema // AnySchema alias
```

### Rules

- Schema types are dialect-specific only when dialect-specific entities exist (e.g., `PgEnum`)
- All type exports live in `src/types.ts`
- Use `import type` for all type imports

## Supported Drizzle Features

The library must handle these drizzle-orm constructs:

| Feature | Pg | MySQL | SQLite |
|---|---|---|---|
| Column types | Yes | Yes | Yes |
| Primary keys (inline + composite) | Yes | Yes | Yes |
| Foreign keys (inline + config) | Yes | Yes | Yes |
| Unique constraints | Yes | Yes | Yes |
| Indexes | Yes | Yes | Yes |
| Enums | Yes (pgEnum) | No | No |
| Schemas | Yes | Yes | No |
| RQB Relations | Yes | Yes | Yes |
| Auto-increment | serial | serial + autoIncrement | autoIncrement |
| Default values | Yes | Yes | Yes (boolean maps to 0/1) |
| Check constraints | Filtered out (DBML limitation) | Filtered out | Filtered out |

## Test Contract

- Tests use **snapshot comparison**: generate DBML output, write to `*.generated.dbml`, compare against `*.dbml` fixture
- One test file per dialect in `src/__tests__/<dialect>/`
- Test utility `compareContents()` normalizes line breaks before comparison
- Tests cover: types, constraints, inline FK, config FK, indexes, schemas, RQB relations, and a "realistic" integration scenario

## TypeScript Dependencies

### Bun Types

- Use `@types/bun` for Bun runtime type definitions
- `bun-types` is **deprecated** — do not use
- Required for scripts that use Bun-specific APIs (e.g., `scripts/validate-mermaid.ts`)
