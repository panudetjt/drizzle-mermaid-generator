# Verification Rules

## Commands

All commands use **Bun** as the runtime. Never use npm, yarn, or pnpm.

### Install Dependencies

```bash
bun install
```

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

1. **Tests pass**: `bun run test:all` exits with code 0
2. **Build succeeds**: `bun run build` exits with code 0
3. **Lint passes**: `bun run lint` exits with code 0
4. **Format passes**: `bun run fmt:check` exits with code 0
5. **No regressions**: existing fixture `.dbml` files still match generated output
6. **New features have tests**: any new generator feature must include a corresponding test case with expected `.dbml` fixture

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
3. Compare generated `.generated.dbml` against expected `.dbml` fixture
4. Assert equality via `compareContents()` which normalizes line breaks

### Adding New Tests

1. Create the test function in the appropriate `_<dialect>.test.ts`
2. Create the expected fixture file `src/__tests__/<dialect>/<name>.dbml`
3. Register the test in the `describe` block
4. The `.generated.dbml` file is created at runtime and is gitignored via `*.generated.dbml`

## CI Verification Sequence

When verifying a change, run in this order:

```bash
bun install
bun run fmt:check
bun run lint
bun run test:all
bun run build
```

If any step fails, the change is not ready.
