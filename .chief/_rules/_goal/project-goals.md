# Project Goals

## Primary Goal

Convert drizzle-orm schema definitions into DBML (Database Markup Language) markup that can be used to generate ER diagrams (e.g., via dbdiagram.io or Mermaid).

## Dialect Coverage

Support all three drizzle-orm dialects:

- PostgreSQL (`drizzle-orm/pg-core`)
- MySQL (`drizzle-orm/mysql-core`)
- SQLite (`drizzle-orm/sqlite-core`)

## Design Principles

1. **Minimal public API** -- one function per dialect, uniform `Options` interface
2. **Zero runtime dependencies** -- only `drizzle-orm` as a peer dependency
3. **Pure functions** -- generators return strings; file IO is opt-in
4. **Dialect fidelity** -- output must accurately represent the schema as defined in drizzle-orm, including dialect-specific features (e.g., Pg enums, MySQL auto-increment)
5. **Dual output format** -- publish as both CJS and ESM with TypeScript declarations

## Quality Standards

- All supported drizzle-orm constructs must have corresponding test coverage
- Tests must use fixture-based comparison (generated vs expected DBML)
- Code must pass linting (oxlint) and formatting (oxfmt) checks
- TypeScript strict mode must remain enabled

## Non-Goals

- The library does not render diagrams -- it only produces markup
- The library does not validate drizzle-orm schemas
- The library does not support drizzle-orm versions below 0.45.1
