# Contract: Worker Pool Design for Mermaid Validation

## Architecture

```
validate-mermaid.ts (main process)
    │
    ├── Discovers all .mermaid files
    │
    ├── Creates worker pool (default: CPU cores - 1, min 1)
    │
    ├── Dispatches files to workers
    │
    └── Aggregates results and reports progress

worker.ts (worker thread)
    │
    ├── Receives file path
    │
    ├── Spawns mermaid-cli subprocess with timeout
    │
    └── Returns success/failure to main process
```

## API Surface

### Main Script: `scripts/validate-mermaid.ts`

```bash
# Default usage
bun run scripts/validate-mermaid.ts

# With options
bun run scripts/validate-mermaid.ts --concurrency 4 --timeout 30000

# Options
--concurrency, -c  Number of parallel workers (default: CPU cores - 1)
--timeout, -t      Timeout per file in ms (default: 30000)
--pattern, -p      Glob pattern for files (default: src/__tests__/*/*.mermaid)
--verbose, -v      Show detailed output for each file
```

### Output Format

```
Validating Mermaid files...
[1/25] pg/types.mermaid ✓
[2/25] pg/constraints.mermaid ✓
[3/25] pg/fk.mermaid ✓
...
[25/25] sqlite/real.mermaid ✓

✓ All 25 files validated successfully
```

On failure:
```
✗ pg/types.mermaid FAILED
  Parse error on line 4: ...

✗ 1/25 files failed validation
```

## Worker Implementation

Use Bun's built-in worker API:
- `new Worker("./worker.ts")` to spawn
- `worker.postMessage()` to send work
- `worker.on("message", ...)` to receive results

Each worker:
1. Receives `{ filePath, timeout }`
2. Spawns `bunx -p @mermaid-js/mermaid-cli mmdc` with timeout
3. Returns `{ filePath, success, error? }`

## Error Handling

- Worker timeout: Kill worker, report as failed
- Worker crash: Report as failed, continue with remaining files
- Subprocess error: Capture stderr, report in output

## Exit Codes

- 0: All files validated successfully
- 1: One or more files failed validation
- 2: Configuration error (invalid args, no files found)
