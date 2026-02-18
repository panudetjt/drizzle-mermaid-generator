import { BaseGenerator, writeMermaidFile } from "./common";
import { PgInlineForeignKeys } from "@/symbols";
import { CasingCache } from "drizzle-orm/casing";
import type { BuildQueryConfig } from "drizzle-orm";
import type { AnyPgColumn, PgEnum } from "drizzle-orm/pg-core";
import type { PgSchema, Options } from "@/types";

class PgGenerator extends BaseGenerator<PgSchema, AnyPgColumn> {
  protected override InlineForeignKeys: typeof PgInlineForeignKeys = PgInlineForeignKeys;
  protected override buildQueryConfig: BuildQueryConfig = {
    escapeName: (name) => `"${name}"`,
    escapeParam: (num) => `$${num + 1}`,
    escapeString: (str) => `'${str.replace(/'/g, "''")}'`,
    casing: new CasingCache(),
  };

  protected override isIncremental(column: AnyPgColumn) {
    return column.getSQLType().includes("serial");
  }

  protected override generateEnum(_enum_: PgEnum<[string, ...string[]]>): string {
    // Enums are not rendered as separate entities in Mermaid
    // Column type normalization handles this by returning "enum" type
    return "";
  }
}

export function pgGenerate<T>(options: Options<T>): string {
  options.relational ||= false;
  const mermaid = new PgGenerator(options.schema as PgSchema, options.relational).generate();
  if (options.out) writeMermaidFile(mermaid, options.out);
  return mermaid;
}
