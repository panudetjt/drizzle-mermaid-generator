# Task 2: Write New Project Description and Feature Lists

## Objective

Update the README header with accurate project description emphasizing Mermaid ER diagram output.

## Scope

**Included:**
- Update title and tagline
- Rewrite description paragraph
- Add feature list highlighting Mermaid output
- Add badges (npm version, license, etc.)

**Excluded:**
- Usage examples (task-3)
- Output documentation (task-4)

## Rules & Contracts to Follow

- Keep description concise (1-2 sentences)
- Feature list should be scannable (bullet points)
- Use shields.io for badges if adding

## Steps

1. Update title:
   ```markdown
   # drizzle-mermaid-generator

   Generate Mermaid ER diagrams from Drizzle ORM schemas
   ```
2. Add badges (optional but recommended):
   ```markdown
   [![npm version](https://img.shields.io/npm/v/drizzle-mermaid-generator)](https://www.npmjs.com/package/drizzle-mermaid-generator)
   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
   ```
3. Write description:
   - Explain what the package does
   - Mention all three dialect support (PostgreSQL, MySQL, SQLite)
   - Highlight Mermaid ER diagram output
4. Add feature list:
   - Supports PostgreSQL, MySQL, and SQLite dialects
   - Generates Mermaid ER diagram syntax
   - Handles tables, columns, constraints, relationships
   - Compatible with Mermaid preview tools

## Acceptance Criteria

- Title accurately describes Mermaid output
- No DBML references in description
- Feature list is clear and accurate
- Badges (if added) render correctly
- Markdown renders properly

## Verification

Preview README in GitHub or markdown renderer to verify formatting.

## Deliverables

- Updated `README.md` (header section)
