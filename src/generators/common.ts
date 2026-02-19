import { normalizeSqlType, sanitizeName } from "@/utils";
import { MermaidBuilder } from "@/mermaid";
import {
  One,
  Relations,
  SQL,
  createMany,
  createOne,
  getTableColumns,
  is,
  Table,
} from "drizzle-orm";
import {
  AnyInlineForeignKeys,
  ExtraConfigBuilder,
  ExtraConfigColumns,
  Schema,
  TableName,
} from "@/symbols";
import {
  ForeignKey as PgForeignKey,
  PgEnum,
  PrimaryKey as PgPrimaryKey,
  isPgEnum,
  PgTable,
  Check as PgCheck,
} from "drizzle-orm/pg-core";
import {
  ForeignKey as MySqlForeignKey,
  PrimaryKey as MySqlPrimaryKey,
  MySqlTable,
  Check as MySqlCheck,
} from "drizzle-orm/mysql-core";
import {
  ForeignKey as SQLiteForeignKey,
  PrimaryKey as SQLitePrimaryKey,
  SQLiteTable,
  Check as SQLiteCheck,
} from "drizzle-orm/sqlite-core";
import { CasingCache } from "drizzle-orm/casing";
import { writeFileSync } from "fs";
import { resolve } from "path";
import type {
  PgInlineForeignKeys,
  MySqlInlineForeignKeys,
  SQLiteInlineForeignKeys,
} from "@/symbols";
import type { AnyColumn, BuildQueryConfig } from "drizzle-orm";
import type { AnyBuilder, AnySchema, AnyTable } from "@/types";

/**
 * Set of column names that are foreign keys, used to mark FK constraint markers.
 */
type ForeignKeyColumnSet = Set<string>;

export abstract class BaseGenerator<
  Schema extends AnySchema = AnySchema,
  Column extends AnyColumn = AnyColumn,
> {
  private readonly schema: Schema;
  private readonly relational: boolean;
  private generatedRelationships: string[] = [];
  protected InlineForeignKeys:
    | typeof AnyInlineForeignKeys
    | typeof PgInlineForeignKeys
    | typeof MySqlInlineForeignKeys
    | typeof SQLiteInlineForeignKeys = AnyInlineForeignKeys;
  protected buildQueryConfig: BuildQueryConfig = {
    escapeName: () => "",
    escapeParam: () => "",
    escapeString: () => "",
    casing: new CasingCache(),
  };

  constructor(schema: Schema, relational: boolean) {
    this.schema = schema;
    this.relational = relational;
  }

  protected isIncremental(_column: Column) {
    return false;
  }

  protected mapDefaultValue(value: unknown) {
    let str = "";

    if (typeof value === "string") {
      str = `'${value}'`;
    } else if (typeof value === "boolean" || typeof value === "number") {
      str = `${value}`;
    } else if (value === null) {
      str = "null";
    } else if (value instanceof Date) {
      str = `'${value.toISOString().replace("T", " ").replace("Z", "")}'`;
    } else if (is(value, SQL)) {
      str = `\`${value.toQuery(this.buildQueryConfig).sql}\``;
    } else {
      str = `\`${JSON.stringify(value)}\``;
    }

    return str;
  }

  /**
   * Generate an attribute line for a column in Mermaid syntax.
   * @param column - The column to generate
   * @param fkColumns - Set of column names that are foreign keys (for FK marker)
   * @param compositePkColumns - Set of column names in composite primary keys
   */
  protected generateColumn(
    column: Column,
    fkColumns: ForeignKeyColumnSet = new Set(),
    compositePkColumns: Set<string> = new Set(),
  ): string {
    const normalizedType = normalizeSqlType(column.getSQLType());
    const columnName = sanitizeName(column.name);

    const constraints: string[] = [];

    // Primary key marker (from column.primary or composite PK)
    if (column.primary || compositePkColumns.has(column.name)) {
      constraints.push("PK");
    }

    // Foreign key marker
    if (fkColumns.has(column.name)) {
      constraints.push("FK");
    }

    // Unique marker
    if (column.isUnique) {
      constraints.push("UK");
    }

    // Build comment string for metadata
    const commentParts: string[] = [];

    if (column.notNull) {
      commentParts.push("not null");
    }

    if (this.isIncremental(column)) {
      commentParts.push("increment");
    }

    if (column.default !== undefined) {
      commentParts.push(`default: ${this.mapDefaultValue(column.default)}`);
    }

    const constraintStr = constraints.length > 0 ? constraints.join(", ") : undefined;
    const commentStr = commentParts.length > 0 ? commentParts.join(", ") : undefined;

    const builder = new MermaidBuilder();
    builder.attribute(normalizedType, columnName, constraintStr, commentStr);
    return builder.build();
  }

  /**
   * Generate a complete entity block for a table.
   */
  protected generateTable(table: AnyTable): { entity: string; fkColumnNames: Set<string> } {
    const fkColumnNames = new Set<string>();
    const allFks: (PgForeignKey | MySqlForeignKey | SQLiteForeignKey)[] = [];

    // Collect foreign key columns from inline FKs
    if (!this.relational) {
      const inlineFks = table[this.InlineForeignKeys as typeof AnyInlineForeignKeys] as unknown as (
        | PgForeignKey
        | MySqlForeignKey
        | SQLiteForeignKey
      )[];
      if (inlineFks) {
        allFks.push(...inlineFks);
        for (const fk of inlineFks) {
          const columns = fk.reference().columns;
          for (const col of columns) {
            fkColumnNames.add(col.name);
          }
        }
      }
    }

    // Get entity name (with schema prefix if applicable)
    const entityName = this.getEntityName(table);

    const builder = new MermaidBuilder();
    builder.entityStart(entityName);

    const columns = getTableColumns(table as unknown as Table);

    // Collect composite PK columns from extra config
    const compositePkColumns = this.getCompositePkColumns(table);

    // Generate all column attributes
    for (const columnName in columns) {
      const column = columns[columnName];
      const columnLine = this.generateColumn(column as Column, fkColumnNames, compositePkColumns);
      // The generateColumn already produces properly indented attribute lines
      builder.insert(columnLine).insert("\n");
    }

    builder.entityEnd();

    // Collect FKs from extra config for relationship generation
    const extraConfigBuilder = table[ExtraConfigBuilder];
    const extraConfigColumns = table[ExtraConfigColumns];
    const extraConfig = extraConfigBuilder?.(extraConfigColumns ?? {});

    const builtIndexes = (
      Array.isArray(extraConfig) ? extraConfig : Object.values(extraConfig ?? {})
    )
      .map((b: AnyBuilder) => b?.build(table))
      .filter((b) => b !== undefined)
      .filter((index) => !(is(index, PgCheck) || is(index, MySqlCheck) || is(index, SQLiteCheck)));

    const fks = builtIndexes.filter(
      (index) =>
        is(index, PgForeignKey) || is(index, MySqlForeignKey) || is(index, SQLiteForeignKey),
    ) as unknown as (PgForeignKey | MySqlForeignKey | SQLiteForeignKey)[];

    allFks.push(...fks);

    // Track FK columns from extra config
    for (const fk of fks) {
      const columns = fk.reference().columns;
      for (const col of columns) {
        fkColumnNames.add(col.name);
      }
    }

    if (!this.relational) {
      this.generateForeignKeys(allFks);
    }

    return { entity: builder.build(), fkColumnNames };
  }

  /**
   * Get the entity name for a table, with schema prefix if applicable.
   */
  protected getEntityName(table: AnyTable): string {
    let name = table[TableName];
    const schema = table[Schema];

    if (schema) {
      name = `${schema}_${name}`;
    }

    return sanitizeName(name);
  }

  /**
   * Extract composite PK column names from extra config.
   */
  private getCompositePkColumns(table: AnyTable): Set<string> {
    const compositePkColumns = new Set<string>();

    const extraConfigBuilder = table[ExtraConfigBuilder];
    const extraConfigColumns = table[ExtraConfigColumns];
    const extraConfig = extraConfigBuilder?.(extraConfigColumns ?? {});

    const builtIndexes = (
      Array.isArray(extraConfig) ? extraConfig : Object.values(extraConfig ?? {})
    )
      .map((b: AnyBuilder) => b?.build(table))
      .filter((b) => b !== undefined);

    const primaryKeys = builtIndexes.filter(
      (index) =>
        is(index, PgPrimaryKey) || is(index, MySqlPrimaryKey) || is(index, SQLitePrimaryKey),
    ) as (PgPrimaryKey | MySqlPrimaryKey | SQLitePrimaryKey)[];

    for (const pk of primaryKeys) {
      for (const col of pk.columns) {
        compositePkColumns.add(col.name);
      }
    }

    return compositePkColumns;
  }

  /**
   * PostgreSQL enums return empty string - handled by column type normalization.
   */
  protected generateEnum(_enum_: PgEnum<[string, ...string[]]>): string {
    return "";
  }

  /**
   * Generate Mermaid relationship lines for foreign keys.
   */
  private generateForeignKeys(fks: (PgForeignKey | MySqlForeignKey | SQLiteForeignKey)[]) {
    for (const fk of fks) {
      const sourceTable = fk.table as unknown as AnyTable;
      const foreignTable = fk.reference().foreignTable as unknown as AnyTable;
      const sourceName = this.getEntityName(sourceTable);
      const foreignName = this.getEntityName(foreignTable);
      const fkName = fk.getName();

      // Mermaid FK relationship: referenced table ||--o{ source table
      this.generatedRelationships.push(
        new MermaidBuilder()
          .relationship(foreignName, "||", "o{", sourceName, fkName)
          .build()
          .trim(),
      );
    }
  }

  /**
   * Generate Mermaid relationship lines from Drizzle Relations API.
   */
  private generateRelations(relations_: Relations[]) {
    const left: Record<
      string,
      {
        type: "one" | "many";
        sourceEntity?: string;
        sourceColumns?: string[];
        foreignEntity?: string;
        foreignColumns?: string[];
      }
    > = {};
    const right: typeof left = {};

    for (let i = 0; i < relations_.length; i++) {
      const relations = relations_[i].config({
        one: createOne(relations_[i].table),
        many: createMany(relations_[i].table),
      });

      for (const relationName in relations) {
        const relation = relations[relationName];
        const sourceTable = relations_[i].table as unknown as AnyTable;
        const sourceEntity = this.getEntityName(sourceTable);
        const foreignEntity = sanitizeName(relation.referencedTableName);

        const tableNames: string[] = [sourceTable[TableName], relation.referencedTableName].sort();
        const key = `${tableNames[0]}-${tableNames[1]}${
          relation.relationName ? `-${relation.relationName}` : ""
        }`;

        if ((is(relation, One) && relation.config?.references.length) || false) {
          left[key] = {
            type: "one",
            sourceEntity,
            sourceColumns: (relation as One).config?.fields.map((col) => col.name) || [],
            foreignEntity,
            foreignColumns: (relation as One).config?.references.map((col) => col.name) || [],
          };
        } else {
          right[key] = {
            type: is(relation, One) ? "one" : "many",
          };
        }
      }
    }

    for (const key in left) {
      const sourceEntity = left[key].sourceEntity || "";
      const foreignEntity = left[key].foreignEntity || "";
      const sourceColumns = left[key].sourceColumns || [];
      const foreignColumns = left[key].foreignColumns || [];
      const relationType = right[key]?.type || "one";

      if (sourceColumns.length === 0 || foreignColumns.length === 0) {
        throw new Error(
          `Not enough information was provided to create relation between "${sourceEntity}" and "${foreignEntity}"`,
        );
      }

      // Determine cardinality based on relation type
      // For one-to-one: source ||--|| foreign
      // For one-to-many: source ||--o{ foreign (source is "one", foreign is "many")
      let leftCard = "||";
      let rightCard = relationType === "one" ? "||" : "o{";

      // Source table (with fields) goes on left, referenced table on right
      const relationship = new MermaidBuilder()
        .relationship(sourceEntity, leftCard, rightCard, foreignEntity, key)
        .build()
        .trim();

      this.generatedRelationships.push(relationship);
    }
  }

  /**
   * Main generation method - produces the complete Mermaid ER diagram.
   */
  public generate() {
    const generatedEnums: string[] = [];
    const generatedEntities: string[] = [];
    const relations: Relations[] = [];

    for (const key in this.schema) {
      const value = this.schema[key];

      if (isPgEnum(value)) {
        generatedEnums.push(this.generateEnum(value));
      } else if (is(value, PgTable) || is(value, MySqlTable) || is(value, SQLiteTable)) {
        generatedEntities.push(this.generateTable(value as unknown as AnyTable).entity);
      } else if (is(value, Relations)) {
        relations.push(value);
      }
    }

    if (this.relational) {
      this.generateRelations(relations);
    }

    const builder = new MermaidBuilder();
    builder.header();

    for (const entity of generatedEntities) {
      builder.newLine().insert(entity);
    }

    if (this.generatedRelationships.length > 0) {
      builder.newLine();
      for (const rel of this.generatedRelationships) {
        builder.insert(rel).insert("\n");
      }
    }

    return builder.build();
  }
}

/**
 * Write the generated Mermaid string to a file.
 */
export function writeMermaidFile(mermaid: string, outPath: string) {
  const path = resolve(process.cwd(), outPath);

  try {
    writeFileSync(path, mermaid, { encoding: "utf-8" });
  } catch (err) {
    console.error("An error occurred while writing the generated Mermaid");
    throw err;
  }
}
