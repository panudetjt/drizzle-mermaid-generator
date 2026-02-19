#!/usr/bin/env node
import { pgGenerate, mysqlGenerate, sqliteGenerate } from "./generators";
import { loadSchema } from "./loader";
import { resolve } from "node:path";

const PACKAGE_VERSION = "0.0.1";

interface CliArgs {
	dialect: "pg" | "mysql" | "sqlite" | null;
	schema: string | null;
	out: string | null;
	relational: boolean;
	help: boolean;
	version: boolean;
}

function parseArgs(args: string[]): CliArgs {
	const result: CliArgs = {
		dialect: null,
		schema: null,
		out: null,
		relational: false,
		help: false,
		version: false,
	};

	for (let i = 0; i < args.length; i++) {
		const arg = args[i];

		if (arg === "--help" || arg === "-h") {
			result.help = true;
		} else if (arg === "--version" || arg === "-v") {
			result.version = true;
		} else if (arg === "--dialect" || arg === "-d") {
			const value = args[++i];
			if (value && ["pg", "mysql", "sqlite"].includes(value)) {
				result.dialect = value as "pg" | "mysql" | "sqlite";
			} else {
				console.error(`Error: Invalid dialect '${value}'. Must be pg, mysql, or sqlite.`);
				process.exit(1);
			}
		} else if (arg === "--schema" || arg === "-s") {
			result.schema = args[++i] || null;
		} else if (arg === "--out" || arg === "-o") {
			result.out = args[++i] || null;
		} else if (arg === "--relational" || arg === "-r") {
			result.relational = true;
		}
	}

	return result;
}

function printHelp(): void {
	console.log(`
drizzle-mermaid-generator - Convert Drizzle ORM schemas to Mermaid ER diagrams

USAGE:
  drizzle-mermaid-generator [OPTIONS]

OPTIONS:
  -d, --dialect <pg|mysql|sqlite>  Database dialect (required)
  -s, --schema <path>              Path to schema file (required)
  -o, --out <path>                 Output file path (prints to stdout if not set)
  -r, --relational                 Include relationship definitions
  -v, --version                    Print version
  -h, --help                       Print this help message

EXAMPLES:
  # Generate from PostgreSQL schema
  drizzle-mermaid-generator --dialect pg --schema ./src/db/schema.ts

  # Generate with output file
  drizzle-mermaid-generator -d mysql -s ./schema.ts -o ./diagrams/schema.mermaid

  # Include relationships
  drizzle-mermaid-generator --dialect sqlite --schema ./schema.ts --relational
`);
}

function printVersion(): void {
	console.log(`drizzle-mermaid-generator v${PACKAGE_VERSION}`);
}

async function main(): Promise<void> {
	const args = parseArgs(process.argv.slice(2));

	if (args.help) {
		printHelp();
		process.exit(0);
	}

	if (args.version) {
		printVersion();
		process.exit(0);
	}

	if (!args.dialect) {
		console.error("Error: --dialect is required. Use --help for usage information.");
		process.exit(1);
	}

	if (!args.schema) {
		console.error("Error: --schema is required. Use --help for usage information.");
		process.exit(1);
	}

	try {
		const schemaPath = resolve(args.schema);
		const schema = await loadSchema(schemaPath);

		const options = {
			schema,
			out: args.out,
			relational: args.relational,
		};

		let mermaid: string;

		switch (args.dialect) {
			case "pg":
				mermaid = pgGenerate(options);
				break;
			case "mysql":
				mermaid = mysqlGenerate(options);
				break;
			case "sqlite":
				mermaid = sqliteGenerate(options);
				break;
		}

		if (!args.out) {
			console.log(mermaid);
		}
	} catch (error) {
		console.error(`Error: ${error instanceof Error ? error.message : String(error)}`);
		process.exit(1);
	}
}

main();
