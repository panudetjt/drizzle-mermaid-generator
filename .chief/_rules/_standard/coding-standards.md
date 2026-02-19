# Coding Standards

## Runtime & Package Manager

- **Runtime**: Bun
- **Package manager**: Bun (`bun install`, `bun add`, `bun remove`)
- **Never use**: npm, yarn, pnpm
- **Lockfile**: `bun.lock` (text-based format)
- Run scripts via `bun run <script>` or direct `bunx <tool>`

## Language

- TypeScript, strict mode enabled
- Target: ESNext
- Module system: ESM (`"type": "module"` in package.json)

## tsconfig

Key compiler options:

```json
{
  "target": "ESNext",
  "module": "ESNext",
  "moduleResolution": "node",
  "strict": true,
  "baseUrl": "./",
  "paths": { "@/*": ["./src/*"] }
}
```

## Path Aliases

- Use `@/` prefix for all intra-project imports resolving to `./src/`
- Example: `import { DBML } from "@/dbml"`
- Never use relative paths like `../../src/` from within `src/`

## Import Conventions

- Use `import type` for type-only imports
- Group imports in this order:
  1. External packages (`drizzle-orm`, `drizzle-orm/*`, `fs`, `path`)
  2. Internal modules (`@/symbols`, `@/dbml`, `@/utils`, `@/types`)
- Destructure named imports; no default imports unless required by the library

```ts
// type-only
import type { AnyColumn, BuildQueryConfig } from "drizzle-orm";
import type { PgSchema, Options } from "@/types";

// value imports
import { is, SQL } from "drizzle-orm";
import { DBML } from "@/dbml";
```

## File Naming

- Source files: **kebab-case** (e.g., `common.ts`, `dbml.ts`)
- Exception: single-word files (e.g., `types.ts`, `utils.ts`, `symbols.ts`)
- Test directories: underscore-prefixed with double underscores (`__tests__`)
- Test files: `_<dialect>.test.ts` (e.g., `_pg.test.ts`, `_mysql.test.ts`)
- Test fixture files: `<name>.dbml` (expected) and `<name>.generated.dbml` (output)
- Barrel exports: `index.ts`

## Module Structure

- One class or a cohesive set of functions per file
- Use barrel `index.ts` files for re-exporting public API
- Entry point: `src/index.ts` re-exports from `src/generators/index.ts`

## Class & Function Conventions

- Abstract base classes for shared logic (e.g., `BaseGenerator`)
- Dialect-specific subclasses override protected methods
- Public API functions are standalone (e.g., `pgGenerate`, `mysqlGenerate`, `sqliteGenerate`)
- Generator classes are not exported; only the `*Generate` functions are public

## Code Style

- Formatter: **oxfmt** (`bun run fmt`)
- Linter: **oxlint** (`bun run lint`)
- Use `const` by default; `let` only when reassignment is needed
- No `var`
- Use double quotes for strings (enforced by oxfmt)
- Use 2-space indentation (enforced by oxfmt)
- Trailing commas in multi-line structures

## Error Handling

- Throw `Error` with descriptive messages for unrecoverable states
- Use `try/catch` only at IO boundaries (file writes)
- Log errors to `console.error` before re-throwing at IO boundaries

## No Side Effects in Library Code

- Generator functions return strings; file writes only happen when `out` option is provided
- Keep pure logic separate from IO
