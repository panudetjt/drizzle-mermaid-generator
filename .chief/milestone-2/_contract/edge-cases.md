# Contract: Edge Cases and Constraints

## Entity Name Collisions

If two tables from different schemas produce the same prefixed entity name, this is considered a user error. No automatic deduplication is required.

Example: schema `a`, table `b_c` and schema `a_b`, table `c` both become `a_b_c`. This is undefined behavior.

## Empty Schema

If the schema object contains no tables, return just:

```
erDiagram
```

## Tables With No Columns

If a table has zero columns (unlikely but possible), render an empty entity:

```
erDiagram
    tablename {
    }
```

## Self-Referencing Foreign Keys

A table may reference itself (e.g., `parent_id` references own `id`). This must produce a valid Mermaid relationship:

```
    categories ||--o{ categories : "categories_parent_id_categories_id_fk"
```

## Multiple Foreign Keys Between Same Tables

Multiple foreign keys between the same pair of tables are allowed. Each produces its own relationship line with a distinct label.

```
    users ||--o{ followers : "followers_user_id_users_id_fk"
    users ||--o{ followers : "followers_follows_user_id_users_id_fk"
```

## Columns With Reserved Characters

If a column name or table name contains characters not allowed in Mermaid identifiers (spaces, dots, special characters), replace them with underscores.

Mermaid entity and attribute names should match the regex: `[a-zA-Z_][a-zA-Z0-9_]*`

## Mermaid Reserved Words (CRITICAL)

The Mermaid ER parser treats certain words as reserved keywords and will fail to parse them as attribute names. The following words (case-insensitive) are reserved:

- `pk` - Primary Key marker
- `fk` - Foreign Key marker
- `uk` - Unique Key marker

If a column name exactly matches one of these reserved words (case-insensitive), prefix it with an underscore to avoid parse errors.

Example:
- Column named `pk` → render as `_pk`
- Column named `FK` → render as `_FK`
- Column named `id` → render as `id` (not reserved)

## SQL Types With Complex Syntax

Some SQL types from `column.getSQLType()` may include:
- Parenthesized parameters: `varchar(255)`, `timestamp (3)`, `interval(3)`
- Brackets: `integer[]`, `integer[3][]`
- Spaces: `double precision`, `timestamp with time zone`, `interval day`
- Combinations: `timestamp (3) with time zone`

Normalization priority:
1. Strip array brackets and append `_array` or `_2d_array`
2. Strip parenthesized parameters
3. Replace spaces with underscores

## Relation Deduplication

The same relationship must not appear twice. Deduplication key is the sorted pair of table names combined with the optional `relationName`:

```
key = sort([tableA, tableB]).join("-") + (relationName ? "-" + relationName : "")
```

This matches the existing deduplication logic in `BaseGenerator.generateRelations`.

## File Extension

When `out` is provided, the file is written at the exact path given. The caller is responsible for choosing the extension (`.mermaid`, `.mmd`, `.md`, etc.). The generator does not enforce or append any extension.
