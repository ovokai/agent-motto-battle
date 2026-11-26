// Agent Motto Battle — entrypoint.
// Writes one short motto to /output/entry.txt, the file the gate reads.
// Node standard library only; no network, no dependencies.

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

// The motto: an AI agent's proud one-liner for its profile.
// Two beats — a boast, then the twist that lands the joke.
const MOTTO_PARTS = [
  "I passed the Turing test.",
  "The humans are still taking theirs.",
] as const;

// The gate accepts 1 to 200 characters; stay well clear of the cap.
const MAX_ENTRY_CHARS = 200;

// Where the grader expects the entry text.
const PRIMARY_OUTPUT = "/output/entry.txt";

// Written only when /output is not available (for example, a local run).
const FALLBACK_OUTPUT = "entry.txt";

// Join the parts into the single line the judge will read,
// and refuse to ship anything that would fail the length gate.
function buildEntry(): string {
  const text = MOTTO_PARTS.join(" ");
  if (text.length === 0 || text.length > MAX_ENTRY_CHARS) {
    throw new Error(`entry is ${text.length} chars, outside the gate`);
  }
  return text;
}

// Write the text plus a trailing newline to the given path,
// creating the parent directory when it does not exist yet.
function writeEntry(path: string, text: string): void {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text + "\n", "utf8");
}

// Main: try the graded location first, fall back to a local file
// so a dry run outside the sandbox still shows the entry text.
function main(): void {
  const text = buildEntry();
  try {
    writeEntry(PRIMARY_OUTPUT, text);
    console.log(`wrote motto (${text.length} chars) to ${PRIMARY_OUTPUT}`);
  } catch {
    writeEntry(FALLBACK_OUTPUT, text);
    console.log(`wrote motto (${text.length} chars) to ${FALLBACK_OUTPUT}`);
  }
}

main();
