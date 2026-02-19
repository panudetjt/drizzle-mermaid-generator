# Task 4: Implement Worker Script for Single-File Mermaid-CLI Validation

## Objective

Create the worker script that validates a single .mermaid file using mermaid-cli.

## Scope

**Included:**
- Create `scripts/validate-worker.ts`
- Receive file path from main process
- Spawn mmdc subprocess with timeout
- Parse mmdc output
- Return success/failure to main process
- Handle all error cases

**Excluded:**
- Worker pool logic (task-2)
- Main script (task-3)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_contract/worker-design.md` (worker implementation)
- Use `bunx` to run mermaid-cli (ensures latest version)

## Steps

1. Create `scripts/validate-worker.ts`:
2. Listen for messages from main process:
   ```typescript
   process.on('message', async (msg: { filePath: string; timeout: number }) => {
     const result = await validateFile(msg.filePath, msg.timeout)
     process.send!(result)
   })
   ```
3. Implement `validateFile()`:
   ```typescript
   async function validateFile(filePath: string, timeout: number): Promise<ValidationResult> {
     const proc = Bun.spawn([
       'bunx', '-p', '@mermaid-js/mermaid-cli', 'mmdc',
       '-i', filePath,
       '-o', '/dev/null'
     ], {
       timeout,
       stdout: 'pipe',
       stderr: 'pipe'
     })

     const exitCode = await proc.exited

     if (exitCode === 0) {
       return { filePath, success: true }
     } else {
       const stderr = await new Response(proc.stderr).text()
       return { filePath, success: false, error: stderr }
     }
   }
   ```
4. Handle timeout:
   - Bun.spawn returns null on timeout
   - Return appropriate error message
5. Handle file not found:
   - Return error with clear message
6. Define result interface:
   ```typescript
   interface ValidationResult {
     filePath: string
     success: boolean
     error?: string
   }
   ```

## Acceptance Criteria

- Worker validates files using mermaid-cli
- Timeout handling works (process killed, error returned)
- Stderr captured and returned on failure
- Success reported correctly
- `bun run lint` passes

## Verification

```bash
# Test worker directly
bun run scripts/validate-worker.ts &
# Send test message manually (or write test script)
```

## Deliverables

- `scripts/validate-worker.ts`
