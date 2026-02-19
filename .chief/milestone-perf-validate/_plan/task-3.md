# Task 3: Implement Main Script with File Discovery and Worker Spawning

## Objective

Create the main `validate-mermaid.ts` script that discovers .mermaid files and coordinates validation via the worker pool.

## Scope

**Included:**
- Create `scripts/validate-mermaid.ts`
- Implement file discovery via glob pattern
- Parse command-line arguments
- Create and configure worker pool
- Dispatch files to pool
- Aggregate results
- Exit with appropriate code

**Excluded:**
- Worker implementation (task-4)
- Progress output (task-5)
- Package.json update (task-6)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_contract/worker-design.md` (API surface, exit codes)
- Default pattern: `src/__tests__/*/*.mermaid`

## Steps

1. Create `scripts/validate-mermaid.ts`:
2. Parse command-line arguments:
   ```typescript
   const args = parseArgs({
     concurrency: { type: 'number', short: 'c', default: CPU_CORES - 1 },
     timeout: { type: 'number', short: 't', default: 30000 },
     pattern: { type: 'string', short: 'p', default: 'src/__tests__/*/*.mermaid' },
     verbose: { type: 'boolean', short: 'v', default: false }
   })
   ```
3. Discover files using glob:
   ```typescript
   import { glob } from 'bun'
   const files = await glob(args.pattern)
   ```
4. Handle edge cases:
   - No files found: exit 2
   - Invalid args: exit 2
5. Create worker pool:
   ```typescript
   const pool = new WorkerPool({
     workerPath: './scripts/validate-worker.ts',
     maxWorkers: args.concurrency,
     timeout: args.timeout
   })
   ```
6. Dispatch all files:
   ```typescript
   const results = await Promise.all(
     files.map(file => pool.submit({ filePath: file }))
   )
   ```
7. Aggregate results and determine exit code
8. Clean shutdown: `pool.drain(); pool.terminate()`

## Acceptance Criteria

- File discovery works with default and custom patterns
- Worker pool created with correct options
- All files dispatched to pool
- Results aggregated correctly
- Exit codes: 0 (success), 1 (validation failure), 2 (config error)
- `bun run lint` passes

## Verification

```bash
bun run scripts/validate-mermaid.ts --verbose
# Should discover files and attempt validation (worker not yet implemented)
```

## Deliverables

- `scripts/validate-mermaid.ts`
