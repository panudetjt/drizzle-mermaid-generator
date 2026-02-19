# Task 1: Research Bun Worker Threads API and Create Proof-of-Concept

## Objective

Research Bun's worker thread implementation and create a minimal proof-of-concept to validate the approach.

## Scope

**Included:**
- Research Bun's Worker API documentation
- Create minimal main/worker pair that communicates
- Test worker spawning and message passing
- Document findings

**Excluded:**
- Full worker pool implementation (task-2)
- Mermaid validation logic (task-4)

## Rules & Contracts to Follow

- `.chief/milestone-perf-validate/_contract/worker-design.md` (architecture overview)
- Use Bun's native Worker API (not Node.js worker_threads)

## Steps

1. Research Bun Worker API:
   - How to spawn workers: `new Worker("./worker.ts")`
   - How to send messages: `worker.postMessage()`
   - How to receive messages: `worker.on("message", ...)`
   - How to handle errors: `worker.on("error", ...)`
2. Create `scripts/poc-main.ts`:
   - Spawn a single worker
   - Send a test message
   - Receive and log response
3. Create `scripts/poc-worker.ts`:
   - Listen for messages
   - Process and respond
4. Test the POC
5. Document findings in report

## Acceptance Criteria

- POC successfully spawns a worker
- Message passing works in both directions
- Error handling works
- Documentation captures key learnings
- `bun run lint` passes on POC files

## Verification

```bash
bun run scripts/poc-main.ts
# Should see worker communication succeed
```

## Deliverables

- `scripts/poc-main.ts`
- `scripts/poc-worker.ts`
- `.chief/milestone-perf-validate/_report/task-1/poc-findings.md`
