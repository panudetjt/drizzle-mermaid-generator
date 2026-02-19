# Contract: Drizzle Type Coverage

This contract defines the drizzle-orm schema elements that must be supported in the Mermaid generator.

## Tables

All three dialect table types must be supported:

- `pgTable` / `pgSchema(...).table(...)` (PostgreSQL)
- `mysqlTable` / `mysqlSchema(...).table(...)` (MySQL)
- `sqliteTable` (SQLite)

Tables with named schemas must prefix entity names: `schemaName_tableName`.

## Column Types by Dialect

### PostgreSQL

Must support all types currently tested:

| Drizzle Function | SQL Type |
|------------------|----------|
| `integer()` | `integer` |
| `smallint()` | `smallint` |
| `bigint()` | `bigint` |
| `serial()` | `serial` |
| `smallserial()` | `smallserial` |
| `bigserial()` | `bigserial` |
| `boolean()` | `boolean` |
| `text()` | `text` |
| `varchar()` | `varchar` |
| `char()` | `char` |
| `numeric()` | `numeric` |
| `real()` | `real` |
| `doublePrecision()` | `double precision` |
| `json()` | `json` |
| `jsonb()` | `jsonb` |
| `time()` | `time` |
| `timestamp()` | `timestamp` |
| `timestamp({ precision })` | `timestamp (N)` |
| `timestamp({ withTimezone })` | `timestamp with time zone` |
| `date()` | `date` |
| `interval()` | `interval` |
| `interval({ fields })` | `interval <field>` |
| `interval({ precision })` | `interval(N)` |
| `pgEnum()` | enum reference |
| `.array()` | `type[]` |
| `.array(N).array()` | `type[N][]` |

### MySQL

| Drizzle Function | SQL Type |
|------------------|----------|
| `int()` | `int` |
| `tinyint()` | `tinyint` |
| `smallint()` | `smallint` |
| `mediumint()` | `mediumint` |
| `bigint()` | `bigint` |
| `real()` | `real` |
| `decimal()` | `decimal` |
| `double()` | `double` |
| `float()` | `float` |
| `serial()` | `serial` |
| `binary()` | `binary` |
| `varbinary()` | `varbinary` |
| `char()` | `char` |
| `varchar()` | `varchar` |
| `text()` | `text` |
| `boolean()` | `boolean` |
| `datetime()` | `datetime` |
| `time()` | `time` |
| `year()` | `year` |
| `timestamp()` | `timestamp` |
| `mysqlEnum()` | `enum(...)` |

### SQLite

| Drizzle Function | SQL Type |
|------------------|----------|
| `integer()` | `integer` |
| `real()` | `real` |
| `text()` | `text` |
| `blob()` | `blob` |

## Column Constraints

All dialects must handle:

| Constraint | Detection Method |
|------------|------------------|
| Primary key | `column.primary === true` |
| Not null | `column.notNull === true` |
| Unique | `column.isUnique === true` |
| Default value | `column.default !== undefined` |
| Auto-increment | Dialect-specific (serial types for PG, `autoIncrement` for MySQL/SQLite) |

## Foreign Keys

Two sources of foreign keys:

1. **Inline foreign keys**: via `.references(() => otherTable.column)` on column definition
2. **Extra config foreign keys**: via `foreignKey({ columns, foreignColumns })` in table's extra config

Both produce relationship lines in the Mermaid output.

## Relations (Relational Query Builder API)

When `relational: true`:

- `relations(table, ({ one, many }) => ({ ... }))` definitions are used
- `one()` with `fields` and `references` defines the owning side
- `many()` defines the inverse side
- Relation names and `relationName` options are used for deduplication

## Composite Primary Keys

Defined via `primaryKey(col1, col2, ...)` in table extra config. All constituent columns must be marked with `PK`.

## Indexes

Indexes (`index()`, `uniqueIndex()`, `unique()`) are **not represented** in Mermaid output. However:

- Columns that are part of a `unique()` constraint defined at column level (`.unique()`) still get the `UK` marker.
- Unique constraints defined in extra config via `unique().on(...)` do not get reflected as column markers since they apply at the table level and may be composite.

## Check Constraints

Check constraints are **not supported** by Mermaid ER diagrams. Skip them entirely (same as current DBML behavior).
