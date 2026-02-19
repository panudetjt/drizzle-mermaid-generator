# Verification Rules

## Commands

All commands use **Bun** as the runtime. Never use npm, yarn, or pnpm.

### Install Dependencies

```bash
bun install
```

### Typecheck

```bash
bun run typecheck
```

TypeScript compiler: **tsc** with `--noEmit`. Must have zero errors.

### Run Tests

```bash
# All dialects
bun run test:all

# Single dialect
bun run test:pg
bun run test:mysql
bun run test:sqlite
```

Test runner: **Vitest** (configured in `vitest.config.js`).

### Build

```bash
bun run build
```

Build tool: **tsdown**. Outputs CJS + ESM + DTS to `dist/`.

### Lint

```bash
bun run lint
```

Linter: **oxlint**. Fix with `bun run lint:fix`.

### Format

```bash
bun run fmt:check
```

Formatter: **oxfmt**. Fix with `bun run fmt`.

## Definition of Done

A task is considered complete when **all** of the following pass:

1. **Typecheck passes**: `bun run typecheck` exits with code 0 (zero TypeScript errors)
2. **Tests pass**: `bun run test:all` exits with code 0
3. **Build succeeds**: `bun run build` exits with code 0
4. **Lint passes**: `bun run lint` exits with code 0
5. **Format passes**: `bun run fmt:check` exits with code 0
6. **No regressions**: existing fixture `.mermaid` files still match generated output
7. **New features have tests**: any new generator feature must include a corresponding test case with expected `.mermaid` fixture

## Test Structure

```
src/__tests__/
  ├── utils.ts              # Shared test utilities (compareContents)
  ├── pg/_pg.test.ts         # PostgreSQL dialect tests
  ├── mysql/_mysql.test.ts   # MySQL dialect tests
  └── sqlite/_sqlite.test.ts # SQLite dialect tests
```

### Test Pattern

Each test case follows this pattern:

1. Define drizzle-orm schema objects inline
2. Call the dialect's generate function with `out` path
3. Compare generated `.generated.mermaid` against expected `.mermaid` fixture
4. Assert equality via `compareContents()` which normalizes line breaks

### Adding New Tests

1. Create the test function in the appropriate `_<dialect>.test.ts`
2. Create the expected fixture file `src/__tests__/<dialect>/<name>.mermaid`
3. Register the test in the `describe` block
4. The `.generated.mermaid` file is created at runtime and is gitignored via `*.generated.mermaid`

## CI Verification Sequence

When verifying a change, run in this order:

```bash
bun install
bun run fmt:check
bun run lint
bun run typecheck
bun run test:all
bun run build
```

If any step fails, the change is not ready.
