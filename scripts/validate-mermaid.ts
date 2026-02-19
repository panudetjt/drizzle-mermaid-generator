#!/usr/bin/env bun
import { spawn } from "node:child_process";
import { cpus } from "node:os";
import { Glob } from "bun";

interface ValidationResult {
	file: string;
	success: boolean;
	error?: string;
	duration: number;
}

interface WorkerResponse {
	file: string;
	success: boolean;
	error?: string;
	duration: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_CONCURRENCY = Math.min(cpus().length, 4);

async function validateFileWithMmdc(filePath: string, timeout: number): Promise<WorkerResponse> {
	const start = Date.now();

	return new Promise((resolve) => {
		const proc = spawn(
			"bunx",
			["-p", "@mermaid-js/mermaid-cli", "mmdc", "-i", filePath, "-o", "/tmp/test.svg", "-q"],
			{
				timeout,
				shell: true,
			}
		);

		let stderr = "";

		proc.stderr?.on("data", (data) => {
			stderr += data.toString();
		});

		proc.on("close", (code) => {
			const duration = Date.now() - start;
			resolve({
				file: filePath,
				success: code === 0,
				error: code !== 0 ? stderr || `Process exited with code ${code}` : undefined,
				duration,
			});
		});

		proc.on("error", (err) => {
			const duration = Date.now() - start;
			resolve({
				file: filePath,
				success: false,
				error: err.message,
				duration,
			});
		});
	});
}

function discoverMermaidFiles(pattern: string): string[] {
	const glob = new Glob(pattern);
	const files = [...glob.scanSync(".")];
	return files.sort();
}

async function validateWithPool(
	files: string[],
	concurrency: number,
	timeout: number
): Promise<ValidationResult[]> {
	const results: ValidationResult[] = [];
	const queue = [...files];
	let active = 0;

	return new Promise((resolve) => {
		const processNext = () => {
			if (queue.length === 0 && active === 0) {
				resolve(results);
				return;
			}

			while (active < concurrency && queue.length > 0) {
				const file = queue.shift()!;
				active++;

				validateFileWithMmdc(file, timeout).then((result) => {
					results.push(result);
					active--;

					// Progress output
					const completed = results.length;
					const total = files.length;
					const status = result.success ? "✓" : "✗";
					process.stdout.write(`\r[${completed}/${total}] ${status} ${file}\n`);

					processNext();
				});
			}
		};

		processNext();
	});
}

function printSummary(results: ValidationResult[]): void {
	console.log("\n--- Validation Summary ---");

	const passed = results.filter((r) => r.success);
	const failed = results.filter((r) => !r.success);

	const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

	console.log(`Total files: ${results.length}`);
	console.log(`Passed: ${passed.length}`);
	console.log(`Failed: ${failed.length}`);
	console.log(`Total time: ${(totalDuration / 1000).toFixed(2)}s`);

	if (failed.length > 0) {
		console.log("\nFailed files:");
		for (const result of failed) {
			console.log(`  ✗ ${result.file}`);
			if (result.error) {
				console.log(`    Error: ${result.error.split("\n")[0]}`);
			}
		}
	}
}

async function main(): Promise<void> {
	const args = process.argv.slice(2);

	// Parse arguments
	let concurrency = DEFAULT_CONCURRENCY;
	let timeout = DEFAULT_TIMEOUT;
	let pattern = "src/__tests__/*/*.mermaid";

	for (let i = 0; i < args.length; i++) {
		if (args[i] === "-c" || args[i] === "--concurrency") {
			concurrency = Number.parseInt(args[++i]) || DEFAULT_CONCURRENCY;
		} else if (args[i] === "-t" || args[i] === "--timeout") {
			timeout = Number.parseInt(args[++i]) * 1000 || DEFAULT_TIMEOUT;
		} else if (args[i] === "-p" || args[i] === "--pattern") {
			pattern = args[++i];
		} else if (args[i] === "-h" || args[i] === "--help") {
			console.log(`
validate-mermaid - Validate Mermaid files using mermaid-cli

USAGE:
  validate-mermaid [OPTIONS]

OPTIONS:
  -c, --concurrency <n>  Number of parallel validations (default: ${DEFAULT_CONCURRENCY})
  -t, --timeout <secs>   Timeout per file in seconds (default: ${DEFAULT_TIMEOUT / 1000})
  -p, --pattern <glob>   Glob pattern for Mermaid files (default: src/__tests__/*/*.mermaid)
  -h, --help             Show this help message
`);
			process.exit(0);
		}
	}

	console.log(`Discovering Mermaid files matching: ${pattern}`);
	const files = discoverMermaidFiles(pattern);

	if (files.length === 0) {
		console.log("No Mermaid files found.");
		process.exit(0);
	}

	console.log(`Found ${files.length} file(s)`);
	console.log(`Concurrency: ${concurrency}, Timeout: ${timeout / 1000}s\n`);

	const results = await validateWithPool(files, concurrency, timeout);

	printSummary(results);

	// Exit with error code if any validation failed
	const hasFailures = results.some((r) => !r.success);
	process.exit(hasFailures ? 1 : 0);
}

main();
