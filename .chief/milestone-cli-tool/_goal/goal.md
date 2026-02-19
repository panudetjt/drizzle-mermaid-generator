# Milestone Goal: CLI Tool for Mermaid Generation

## Objective

Add a command-line interface (CLI) to the drizzle-mermaid-generator package, allowing users to generate Mermaid ER diagrams without writing code.

## Scope

- Create a CLI entry point (`bin/cli.js` or similar)
- Support all three dialects via command-line flags
- Support file input (drizzle schema) and output (mermaid file)
- Support schema file path or stdin input
- Include help text and version output
- Publish binary in package.json `bin` field

## Out of Scope

- Watch mode for live regeneration
- Built-in Mermaid preview/rendering
- Configuration file support (e.g., `.mermaidrc`)

## Success Criteria

1. CLI can be invoked as `npx drizzle-mermaid-generator` or `bunx drizzle-mermaid-generator`
2. `--dialect` flag accepts `pg`, `mysql`, `sqlite`
3. `--schema` flag accepts path to schema file
4. `--out` flag accepts output file path
5. `--help` displays usage information
6. `--version` displays package version
7. Exit code 0 on success, non-zero on error
8. All functionality tested with integration tests
