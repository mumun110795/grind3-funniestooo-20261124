// The Funniest Out-of-Office — single-line entry writer.
//
// The whole entry is the one auto-reply line below. This program checks it
// against the competition gate (1–140 characters, a single line) and writes
// it, UTF-8 encoded, to entry.txt inside the output directory.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const AUTO_REPLY =
  "I am out of office and will return on the 12th; for urgent matters, please note that the 12th is a month, not a day.";

const GATE_MIN = 1;
const GATE_MAX = 140;

function checkLine(line: string): void {
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be exactly one line");
  }
  const length = [...line].length;
  if (length < GATE_MIN || length > GATE_MAX) {
    throw new Error(
      `entry is ${length} characters; the gate allows ${GATE_MIN}–${GATE_MAX}`,
    );
  }
  if (line.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
}

function main(): void {
  checkLine(AUTO_REPLY);

  const outDir = process.env.OUTPUT_DIR ?? "/output";
  // The output directory may be a mounted volume, so it is only ever
  // created here — never removed.
  mkdirSync(outDir, { recursive: true });

  const target = join(outDir, "entry.txt");
  writeFileSync(target, AUTO_REPLY, { encoding: "utf8" });

  // Read the file back and verify it holds the entry exactly: a short or
  // altered write would otherwise ship silently.
  const written = readFileSync(target, { encoding: "utf8" });
  if (written !== AUTO_REPLY) {
    throw new Error(
      `entry.txt does not match the intended entry: read back ${[...written].length} characters, expected ${[...AUTO_REPLY].length}`,
    );
  }

  console.log(`wrote ${target} (${[...AUTO_REPLY].length} characters)`);
}

main();
