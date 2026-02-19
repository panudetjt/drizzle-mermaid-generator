import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { createJiti } from "jiti";

const jiti = createJiti(import.meta.url);

export async function loadSchema(schemaPath: string): Promise<Record<string, unknown>> {
	const absolutePath = resolve(schemaPath);

	if (!existsSync(absolutePath)) {
		throw new Error(`Schema file not found: ${absolutePath}`);
	}

	try {
		const module = await jiti.import(absolutePath, {});

		// Filter out non-schema exports (functions, classes, etc.)
		const schema: Record<string, unknown> = {};

		if (module && typeof module === "object") {
			for (const [key, value] of Object.entries(module as Record<string, unknown>)) {
				// Include tables, relations, and enums - skip functions and classes
				if (value && typeof value === "object") {
					schema[key] = value;
				}
			}
		}

		if (Object.keys(schema).length === 0) {
			throw new Error(`No schema exports found in ${absolutePath}`);
		}

		return schema;
	} catch (error) {
		if (error instanceof Error) {
			throw new Error(`Failed to load schema from ${absolutePath}: ${error.message}`);
		}
		throw error;
	}
}
