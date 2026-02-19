# Task 5: Add Help Text, Version Flag, and Error Handling

## Objective

Implement user-friendly help output, version display, and comprehensive error handling for the CLI.

## Scope

**Included:**
- `--help` / `-h` flag displays usage information
- `--version` / `-v` flag displays package version
- Clear error messages for all failure modes
- Consistent exit codes

**Excluded:**
- Package.json bin setup (task-6)

## Rules & Contracts to Follow

- Read version from `package.json`
- Help text should include all flags with descriptions
- Error messages should be actionable (tell user what to fix)

## Steps

1. Read version from package.json:
   ```typescript
   import { version } from '../package.json'
   ```
2. Implement `--help` output:
   ```
   drizzle-mermaid-generator - Generate Mermaid ER diagrams from Drizzle schemas

   Usage:
     drizzle-mermaid-generator --dialect <pg|mysql|sqlite> --schema <path> [--out <path>]

   Options:
     --dialect, -d    Database dialect (required): pg, mysql, or sqlite
     --schema, -s     Path to Drizzle schema file (required)
     --out, -o        Output file path (default: stdout)
     --help, -h       Show this help
     --version, -v    Show version

   Examples:
     drizzle-mermaid-generator --dialect pg --schema ./src/db/schema.ts --out schema.mermaid
     drizzle-mermaid-generator -d mysql -s ./schema.ts
   ```
3. Implement `--version` output (just version number)
4. Add error handling for:
   - Schema file not found
   - Schema parse error
   - Invalid schema format
   - Generator error
   - Output file write error
5. Ensure all errors exit with appropriate code (1 for runtime, 2 for config)

## Acceptance Criteria

- `--help` displays formatted help text and exits 0
- `--version` displays version and exits 0
- Error messages are clear and actionable
- Exit codes follow convention (0 success, 1 error, 2 invalid args)
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
bun run src/cli.ts --help
bun run src/cli.ts --version
bun run src/cli.ts --schema nonexistent.ts --dialect pg  # Should error gracefully
```

## Deliverables

- Updated `src/cli.ts`
