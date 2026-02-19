# Task 5: Document Mermaid-CLI Validation Usage

## Objective

Add documentation for using mermaid-cli to validate and render the generated diagrams.

## Scope

**Included:**
- How to install mermaid-cli
- How to validate a .mermaid file
- How to render to PNG/SVG
- How to use the project's validate:mermaid script

**Excluded:**
- Full mermaid-cli documentation (link to official docs)
- CI integration details

## Rules & Contracts to Follow

- Keep practical and actionable
- Provide copy-pasteable commands

## Steps

1. Create "Validation & Rendering" section
2. Document mermaid-cli installation:
   ```markdown
   ## Validation & Rendering

   ### Install mermaid-cli

   ```bash
   bun add -g @mermaid-js/mermaid-cli
   # or
   npm install -g @mermaid-js/mermaid-cli
   ```
   ```
3. Document validation:
   ```markdown
   ### Validate Mermaid Syntax

   ```bash
   mmdc -i schema.mermaid -o /dev/null
   ```
   ```
4. Document rendering:
   ```markdown
   ### Render to PNG/SVG

   ```bash
   mmdc -i schema.mermaid -o schema.png
   mmdc -i schema.mermaid -o schema.svg
   ```
   ```
5. Document project's built-in validation:
   ```markdown
   ### Project Validation Script

   This project includes a validation script to check all fixture files:

   ```bash
   bun run validate:mermaid
   ```
   ```
6. Add link to mermaid-cli docs

## Acceptance Criteria

- Installation instructions are clear
- Validation and rendering commands work
- Built-in script documented
- Link to official docs included
- Markdown renders correctly

## Verification

Run documented commands to verify they work.

## Deliverables

- Updated `README.md` (validation section)
