# Task 1: Design CLI API Surface and Argument Parsing Strategy

## Objective

Research and document the CLI design including argument parsing approach, supported flags, and exit behavior before implementation.

## Scope

**Included:**
- Evaluate argument parsing libraries (built-in `util.parseArgs` vs `citty` vs `yargs`)
- Document all CLI flags and their types
- Define error messages and exit codes
- Create API design document in `_report/task-1/cli-design.md`

**Excluded:**
- Actual implementation (task-2+)
- Schema loading logic (task-3)

## Rules & Contracts to Follow

- `.chief/milestone-cli-tool/_goal/goal.md` (success criteria)
- Keep dependencies minimal - prefer built-in solutions if sufficient

## Steps

1. Research Bun's built-in argument parsing capabilities
2. Evaluate `citty` library (lightweight, native ESM support)
3. Document recommended approach with justification
4. Define CLI surface:
   - `--dialect` (required: pg | mysql | sqlite)
   - `--schema` (required: path to schema file)
   - `--out` (optional: output file path, default: stdout)
   - `--help` / `-h` (show help)
   - `--version` / `-v` (show version)
5. Define exit codes:
   - 0: Success
   - 1: Validation/generation error
   - 2: Invalid arguments
6. Write design document with examples

## Acceptance Criteria

- Clear recommendation on parsing library with pros/cons
- All CLI flags documented with types and defaults
- Exit codes defined
- Example invocations documented
- Design reviewed and approved before task-2

## Verification

Design document exists at `.chief/milestone-cli-tool/_report/task-1/cli-design.md` with all required sections.

## Deliverables

- `.chief/milestone-cli-tool/_report/task-1/cli-design.md`
