# Task 3: Create Usage Examples for All Three Dialects

## Objective

Add complete, copy-pasteable usage examples for pgGenerate, mysqlGenerate, and sqliteGenerate.

## Scope

**Included:**
- Installation instructions
- Import statements for each dialect
- Example schema definitions
- Example generate() calls
- Example output snippets

**Excluded:**
- Detailed output explanation (task-4)
- CLI documentation (covered in CLI milestone)

## Rules & Contracts to Follow

- Code examples must be runnable
- Use realistic but simple schema examples
- Show both file write and string return usage

## Steps

1. Add installation section:
   ```markdown
   ## Installation

   ```bash
   bun add drizzle-mermaid-generator
   # or
   npm install drizzle-mermaid-generator
   ```
   ```
2. Create usage section with subsections for each dialect:
   - PostgreSQL
   - MySQL
   - SQLite
3. For each dialect, show:
   - Import statement
   - Simple schema definition (2-3 tables)
   - Generate call
   - Write to file example
4. Keep examples consistent across dialects (same schema structure)

## Acceptance Criteria

- All three dialects have complete examples
- Examples are syntactically correct
- Import paths match actual package exports
- Examples are copy-pasteable
- Markdown code blocks have correct language tags

## Verification

Manually verify examples by copying and running in a test file.

## Deliverables

- Updated `README.md` (usage section)
