# Task 6: Final Review and Commit

## Objective

Perform final review of the updated README, ensure all changes are accurate, and commit.

## Scope

**Included:**
- Review entire README for accuracy
- Verify all code examples work
- Check for any remaining DBML references
- Verify markdown renders correctly on GitHub
- Commit changes

**Excluded:**
- Major rewrites (should be done in previous tasks)

## Rules & Contracts to Follow

- `.chief/milestone-readme-update/_goal/goal.md` (success criteria)

## Steps

1. Read complete README.md
2. Verify success criteria:
   - [ ] README contains accurate description of Mermaid output
   - [ ] No references to DBML remain
   - [ ] Code examples are copy-pasteable and work
   - [ ] README renders correctly on GitHub/npm
   - [ ] All three dialects have example usage
3. Run all code examples to verify they work
4. Preview README in markdown renderer
5. Fix any issues found
6. Commit with message:
   ```
   docs: update README for Mermaid ER diagram output

   - Replace DBML references with Mermaid
   - Add usage examples for all dialects
   - Document output format and markers
   - Add mermaid-cli validation instructions
   ```

## Acceptance Criteria

- All success criteria from goal.md met
- No DBML references remain
- All examples tested and working
- Markdown renders correctly
- Changes committed

## Verification

```bash
# Check for DBML references
grep -i "dbml" README.md  # Should return nothing

# Check markdown renders
# Preview in IDE or push to branch and view on GitHub
```

## Deliverables

- Final `README.md`
- Commit with updated README
