import { pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { resolve } from "node:path";

export async function loadSchema(schemaPath: string): Promise<Record<string, unknown>> {
	const absolutePath = resolve(schemaPath);

	if (!existsSync(absolutePath)) {
		throw new Error(`Schema file not found: ${absolutePath}`);
	}

	try {
		const moduleUrl = pathToFileURL(absolutePath).href;
		const module = await import(moduleUrl);

		// Filter out non-schema exports (functions, classes, etc.)
		const schema: Record<string, unknown> = {};

		for (const [key, value] of Object.entries(module)) {
			// Include tables, relations, and enums - skip functions and classes
			if (value && typeof value === "object") {
				schema[key] = value;
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
