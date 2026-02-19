# Task 5: Add Progress Reporting and Error Aggregation

## Objective

Implement user-friendly progress output and comprehensive error reporting.

## Scope

**Included:**
- Progress output during validation
- Summary at completion
- Detailed error output for failures
- Verbose mode for per-file details

**Excluded:**
- Core validation logic (already implemented)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_contract/worker-design.md` (output format)

## Steps

1. Add progress tracking in main script:
   ```typescript
   let completed = 0
   const total = files.length

   results = await Promise.all(
     files.map(async (file) => {
       const result = await pool.submit({ filePath: file })
       completed++
       if (args.verbose) {
         console.log(`[${completed}/${total}] ${file} ${result.success ? '✓' : '✗'}`)
       } else if (result.success) {
         process.stdout.write('.')
       } else {
         process.stdout.write('F')
       }
       return result
     })
   )
   ```
2. Implement summary output:
   ```typescript
   const failures = results.filter(r => !r.success)
   const successes = results.filter(r => r.success)

   console.log('') // newline after progress dots

   if (failures.length === 0) {
     console.log(`✓ All ${total} files validated successfully`)
   } else {
     console.log(`✗ ${failures.length}/${total} files failed validation\n`)
     for (const failure of failures) {
       console.log(`✗ ${failure.filePath} FAILED`)
       if (failure.error) {
         console.log(`  ${failure.error.split('\n')[0]}`) // first line only
       }
       console.log('')
     }
   }
   ```
3. Add verbose mode detailed output:
   ```typescript
   if (args.verbose) {
     for (const result of results) {
       if (!result.success && result.error) {
         console.log(`\n--- ${result.filePath} ---`)
         console.log(result.error)
       }
     }
   }
   ```
4. Format error messages to be actionable

## Acceptance Criteria

- Progress shown during validation (dots or detailed)
- Summary shows success/failure counts
- Failures listed with file names
- Error messages truncated to useful information
- Verbose mode shows full errors
- Output matches contract format

## Verification

```bash
# Test progress output
bun run scripts/validate-mermaid.ts

# Test verbose mode
bun run scripts/validate-mermaid.ts --verbose
```

## Deliverables

- Updated `scripts/validate-mermaid.ts`
