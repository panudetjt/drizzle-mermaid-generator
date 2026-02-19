# Task 2: Design Worker Pool with Configurable Concurrency and Timeout

## Objective

Implement the worker pool abstraction that manages multiple workers with configurable concurrency and timeout handling.

## Scope

**Included:**
- Create `scripts/worker-pool.ts` module
- Implement pool creation with max workers
- Implement work queue distribution
- Implement worker recycling or spawning
- Implement timeout per work item
- Implement graceful shutdown

**Excluded:**
- Main script (task-3)
- Worker implementation (task-4)
- Progress reporting (task-5)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_contract/worker-design.md` (worker pool pattern)
- Default concurrency: CPU cores - 1 (minimum 1)
- Default timeout: 30000ms

## Steps

1. Create `scripts/worker-pool.ts` with class `WorkerPool`:
   ```typescript
   export interface WorkItem<T, R> {
     input: T
     resolve: (result: R) => void
     reject: (error: Error) => void
   }

   export interface WorkerPoolOptions {
     workerPath: string
     maxWorkers?: number
     timeout?: number
   }

   export class WorkerPool<T, R> {
     constructor(options: WorkerPoolOptions)
     async submit(input: T): Promise<R>
     async drain(): Promise<void>
     terminate(): void
   }
   ```
2. Implement constructor:
   - Calculate max workers from CPU count
   - Initialize empty worker array and work queue
3. Implement `submit()`:
   - Add work to queue
   - Try to assign to available worker
   - Return promise that resolves when work completes
4. Implement worker lifecycle:
   - Spawn workers on demand up to max
   - Handle worker completion and reassignment
   - Handle worker errors
5. Implement timeout:
   - Use `AbortController` with timeout
   - Kill timed-out workers
6. Implement `drain()`:
   - Wait for all pending work to complete
7. Implement `terminate()`:
   - Kill all workers immediately

## Acceptance Criteria

- Pool respects max workers limit
- Work items distributed across workers
- Timeouts work correctly (worker killed, promise rejected)
- Pool drains cleanly
- Pool terminates cleanly
- `bun run lint` passes

## Verification

Write unit-style test in report showing pool behavior.

## Deliverables

- `scripts/worker-pool.ts`
- `.chief/milestone-perf-validate/_report/task-2/pool-tests.md`
