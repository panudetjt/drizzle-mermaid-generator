# Milestone Goal: Migrate validate:mermaid to TypeScript with Worker Threads

## Problem Statement

The current `validate:mermaid` script is a shell loop that spawns multiple `mmdc` (mermaid-cli) processes sequentially. This is CPU-intensive and can cause:
- Process timeout/killed in CI environments
- Slow feedback loop during development
- No parallelization of validation

## Objective

Replace the shell script with a TypeScript/Bun script that:
1. Uses worker threads for parallel validation
2. Provides progress output
3. Handles timeouts gracefully
4. Reports which files failed with clear error messages

## Scope

- Create `scripts/validate-mermaid.ts` as a Bun TypeScript script
- Implement worker pool pattern using Bun's worker API
- Add configurable concurrency limit
- Add timeout per file (default 30s)
- Add progress reporting (X/Y files validated)
- Update package.json script to use new TypeScript script
- Keep shell script as fallback for environments without Bun

## Out of Scope

- Watching mode for continuous validation
- Caching of validation results
- Integration with mermaid-cli via API (still uses CLI subprocess)

## Success Criteria

1. `bun run validate:mermaid` uses the new TypeScript script
2. Validation runs in parallel with configurable concurrency
3. Progress is displayed during validation
4. Process completes without being killed on CI
5. Clear error messages when validation fails
6. Shell script fallback available via `validate:mermaid:shell`
