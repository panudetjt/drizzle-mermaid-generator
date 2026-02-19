/**
 * MermaidBuilder - A string builder for Mermaid ER diagram syntax.
 *
 * Produces syntactically correct Mermaid erDiagram markup.
 */
export class MermaidBuilder {
  private built = "";

  /** Insert a raw string into the output */
  public insert(str: string): this {
    this.built += str;
    return this;
  }

  /** Insert the erDiagram header */
  public header(): this {
    this.built += "erDiagram\n";
    return this;
  }

  /** Start an entity block with the given name */
  public entityStart(name: string): this {
    this.built += `    ${name} {\n`;
    return this;
  }

  /** End the current entity block */
  public entityEnd(): this {
    this.built += "    }\n";
    return this;
  }

  /**
   * Insert an attribute line for a column
   * @param type - The normalized SQL type
   * @param name - The column name
   * @param constraints - Optional constraint markers (PK, FK, UK)
   * @param comment - Optional comment string for metadata
   */
  public attribute(type: string, name: string, constraints?: string, comment?: string): this {
    this.built += `        ${type} ${name}`;
    if (constraints) {
      this.built += ` ${constraints}`;
    }
    if (comment) {
      this.built += ` "${comment}"`;
    }
    this.built += "\n";
    return this;
  }

  /**
   * Insert a relationship line
   * @param left - Left entity name
   * @param leftCardinality - Left cardinality marker (e.g., "||")
   * @param rightCardinality - Right cardinality marker (e.g., "o{")
   * @param right - Right entity name
   * @param label - Relationship label
   */
  public relationship(
    left: string,
    leftCardinality: string,
    rightCardinality: string,
    right: string,
    label: string,
  ): this {
    this.built += `    ${left} ${leftCardinality}--${rightCardinality} ${right} : "${label}"\n`;
    return this;
  }

  /** Insert a blank line */
  public newLine(): this {
    this.built += "\n";
    return this;
  }

  /** Build and return the final string, trimmed */
  public build(): string {
    return this.built.trimEnd();
  }
}
