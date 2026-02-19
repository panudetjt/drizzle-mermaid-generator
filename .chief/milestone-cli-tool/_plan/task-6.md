# Task 6: Update Package.json with Bin Field and Test CLI Manually

## Objective

Configure package.json for CLI distribution and perform end-to-end testing.

## Scope

**Included:**
- Add `bin` field to package.json
- Create build output for npm distribution
- Manual testing of all CLI features
- Update any relevant scripts

**Excluded:**
- Publishing to npm (out of scope for this milestone)
- CI integration (future work)

## Rules & Contracts to Follow

- Bin entry should point to built JS file, not TS source
- Follow npm conventions for bin naming

## Steps

1. Add `bin` field to package.json:
   ```json
   "bin": {
     "drizzle-mermaid-generator": "./dist/cli.js"
   }
   ```
2. Ensure build script includes CLI: `bun build ./src/cli.ts --outdir ./dist --target bun`
3. Update build script if needed to compile CLI properly
4. Test with `bun link`:
   ```bash
   bun link
   drizzle-mermaid-generator --help
   drizzle-mermaid-generator --version
   ```
5. Test with npx pattern:
   ```bash
   bunx . --dialect pg --schema src/__tests__/pg/fixtures/basic.ts
   ```
6. Test all three dialects
7. Test error scenarios
8. Document any issues found

## Acceptance Criteria

- `npx drizzle-mermaid-generator --help` works after install
- `npx drizzle-mermaid-generator --version` shows correct version
- All dialects produce correct output
- Error handling works as expected
- `bun run lint` passes
- `bun run fmt:check` passes
- Build completes without errors

## Verification

```bash
bun run build
bun link
drizzle-mermaid-generator --help
drizzle-mermaid-generator --version
drizzle-mermaid-generator --dialect pg --schema src/__tests__/pg/fixtures/basic.ts --out /tmp/test.mermaid
cat /tmp/test.mermaid
bun unlink
```

## Deliverables

- Updated `package.json`
- Report at `.chief/milestone-cli-tool/_report/task-6/test-results.md`
