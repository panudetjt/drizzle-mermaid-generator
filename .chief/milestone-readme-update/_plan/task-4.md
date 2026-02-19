# Task 4: Add Sample Mermaid Output with Explanation of Markers

## Objective

Include a rendered Mermaid ER diagram example with explanation of the output format.

## Scope

**Included:**
- Sample Mermaid code block showing erDiagram output
- Explanation of constraint markers (PK, FK, UK)
- Explanation of relationship notation
- Explanation of comment strings (not null, default, etc.)

**Excluded:**
- Mermaid rendering tutorial (out of scope)
- All possible edge cases (keep concise)

## Rules & Contracts to Follow

- Use output from one of the test fixtures as example
- Follow Mermaid ER diagram syntax from milestone-2 contracts

## Steps

1. Create "Output Format" section
2. Add sample Mermaid output (use existing fixture output):
   ```mermaid
   erDiagram
       users {
           bigint id PK
           varchar(255) email UK
           varchar(255) name
           timestamp created_at "not null, default: now()"
       }
       posts {
           bigint id PK
           bigint author_id FK
           varchar(255) title
           text content
       }
       users ||--o{ posts : "author_id"
   ```
3. Add explanation subsections:
   - **Entity Blocks**: Tables become entities
   - **Attributes**: Columns with types
   - **Constraint Markers**: PK (primary key), FK (foreign key), UK (unique)
   - **Comment Strings**: Additional info in quotes (not null, defaults, increment)
   - **Relationships**: `||--o{` notation (one-to-many), `||--||` (one-to-one)
4. Keep explanations brief but clear

## Acceptance Criteria

- Sample output is valid Mermaid syntax
- All markers explained
- Relationship notation explained
- Examples match actual generator output
- Markdown renders correctly with Mermaid highlighting

## Verification

Copy sample output into Mermaid live editor to verify it renders correctly.

## Deliverables

- Updated `README.md` (output format section)
