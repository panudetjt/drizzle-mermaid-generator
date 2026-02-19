# Milestone 2 Goal: Drizzle ORM to Mermaid ER Diagram

## Objective

Replace the existing DBML output format with **Mermaid ER diagram** output. The project pivots from generating DBML markup to generating Mermaid `erDiagram` markup from drizzle-orm schema definitions.

## Scope

- Support all three drizzle dialects: **PostgreSQL**, **MySQL**, **SQLite**
- Convert drizzle tables, columns, column types, constraints, and relationships into valid Mermaid ER diagram syntax
- Maintain the same programmatic API pattern (`pgGenerate`, `mysqlGenerate`, `sqliteGenerate`) but output Mermaid instead of DBML
- Support both foreign-key-based relationships and drizzle `relations()` API (relational query builder)
- Maintain file output capability (write `.mermaid` or `.md` files)
- Update all tests to validate Mermaid output instead of DBML
- Remove all DBML-specific code (`dbml.ts`, DBML string builder)

## Out of Scope

- CLI tool (deferred to a future milestone)
- Mermaid rendering or preview functionality
- Support for non-ER Mermaid diagram types
- Database migration or introspection features

## Success Criteria

1. All three dialect generators produce valid Mermaid `erDiagram` syntax
2. All existing test scenarios (types, constraints, foreign keys, indexes, relations, schemas, real-world) pass with Mermaid output
3. The generated Mermaid diagrams render correctly when pasted into a Mermaid-compatible renderer
4. No DBML code remains in the codebase
5. `bun run build` succeeds
6. `bun run test:all` passes
7. `bun run lint` and `bun run fmt:check` pass
