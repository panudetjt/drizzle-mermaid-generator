# Task 2: Implement CLI Entry Point with Argument Parsing

## Objective

Create the CLI entry point file with argument parsing, following the design from task-1.

## Scope

**Included:**
- Create `src/cli.ts` as the CLI entry point
- Implement argument parsing using chosen library (task-1)
- Parse and validate all required/optional flags
- Map dialect string to generator function

**Excluded:**
- Schema file loading (task-3)
- Generator wiring (task-4)
- Help/version output (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-cli-tool/_report/task-1/cli-design.md`
- Use TypeScript strict mode

## Steps

1. Create `src/cli.ts` with shebang `#!/usr/bin/env bun`
2. Import chosen argument parser
3. Define argument schema:
   ```typescript
   const args = {
     dialect: { type: 'string', required: true, options: ['pg', 'mysql', 'sqlite'] },
     schema: { type: 'string', required: true },
     out: { type: 'string', required: false },
     help: { type: 'boolean', alias: 'h' },
     version: { type: 'boolean', alias: 'v' }
   }
   ```
4. Parse `process.argv` and extract arguments
5. Validate required arguments present
6. Validate dialect is one of allowed values
7. Exit with code 2 on invalid arguments
8. Export parsed args for use by other modules

## Acceptance Criteria

- CLI parses all defined flags correctly
- Missing required flags produce clear error message and exit code 2
- Invalid dialect value produces clear error message
- `bun run lint` passes
- `bun run fmt:check` passes

## Verification

```bash
bun run src/cli.ts --dialect pg --schema test.ts  # should not error
bun run src/cli.ts --dialect invalid --schema test.ts  # exit 2
bun run src/cli.ts  # exit 2 (missing required)
```

## Deliverables

- `src/cli.ts`
