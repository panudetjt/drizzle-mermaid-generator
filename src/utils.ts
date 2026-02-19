import type { AnyColumn } from "drizzle-orm";

export function formatList(
  items: string[],
  escapeName: (name: string) => string,
  escapeSpaces: boolean = false,
) {
  return items
    .reduce(
      (str, item) => `${str}, ${escapeSpaces && item.includes(" ") ? escapeName(item) : item}`,
      "",
    )
    .slice(2);
}

export function wrapColumns(columns: AnyColumn[], escapeName: (name: string) => string) {
  const formatted = formatList(
    columns.map((column) => column.name),
    escapeName,
    true,
  );
  return columns.length === 1 ? columns[0].name : `(${formatted})`;
}

export function wrapColumnNames(columns: string[], escapeName: (name: string) => string) {
  return columns.length === 1 ? columns[0] : `(${formatList(columns, escapeName)})`;
}

/**
 * Normalize SQL type strings into Mermaid-safe tokens.
 *
 * Handles:
 * - Array types (appends _array or _2d_array)
 * - Parenthesized parameters (stripped)
 * - Spaces (replaced with underscores)
 * - Special case mappings (e.g., timestamp with time zone -> timestamptz)
 */
export function normalizeSqlType(sqlType: string): string {
  let type = sqlType.toLowerCase();

  // Handle special case mappings first
  if (type === "timestamp with time zone") {
    return "timestamptz";
  }

  // Handle array types - check before modifying parentheses
  // Match patterns like "integer[]" or "integer[3][]" (2D arrays)
  const array2dPattern = /^(.+?)\[\d+\]\[\]$/;
  const array1dPattern = /^(.+?)\[\]$/;
  const array2dMatch = type.match(array2dPattern);
  const array1dMatch = type.match(array1dPattern);

  if (array2dMatch) {
    type = array2dMatch[1];
    // Strip parameters and then append _2d_array
    type = stripParenthesizedParameters(type);
    return replaceSpacesWithUnderscores(type) + "_2d_array";
  }

  if (array1dMatch) {
    type = array1dMatch[1];
    // Strip parameters and then append _array
    type = stripParenthesizedParameters(type);
    return replaceSpacesWithUnderscores(type) + "_array";
  }

  // Strip parenthesized parameters for non-array types
  type = stripParenthesizedParameters(type);

  // Replace remaining spaces with underscores
  type = replaceSpacesWithUnderscores(type);

  return type;
}

/**
 * Strip parenthesized parameters from SQL type names.
 * e.g., "varchar(255)" -> "varchar", "timestamp (3)" -> "timestamp"
 */
function stripParenthesizedParameters(type: string): string {
  // Remove pattern like (255) or ( 3 )
  return type.replace(/\s*\([^)]*\)\s*/g, "");
}

/**
 * Replace spaces in type names with underscores.
 * e.g., "double precision" -> "double_precision"
 */
function replaceSpacesWithUnderscores(type: string): string {
  return type.replace(/\s+/g, "_");
}

/**
 * Sanitize names to be valid Mermaid identifiers.
 *
 * Replaces non-alphanumeric/underscore characters with underscores.
 * Ensures the name starts with a letter or underscore.
 * Prefixes Mermaid reserved words (pk, fk, uk) with underscore.
 */
export function sanitizeName(name: string): string {
  let sanitized = name;

  // Replace any character that's not alphanumeric or underscore with underscore
  sanitized = sanitized.replace(/[^\w]/g, "_");

  // Ensure name starts with a letter or underscore
  if (/^[0-9]/.test(sanitized)) {
    sanitized = "_" + sanitized;
  }

  // Mermaid ER reserves these words as key markers (case-insensitive)
  // They must be prefixed to avoid parse errors
  const reservedWords = ["pk", "fk", "uk"];
  if (reservedWords.includes(sanitized.toLowerCase())) {
    sanitized = "_" + sanitized;
  }

  return sanitized;
}
