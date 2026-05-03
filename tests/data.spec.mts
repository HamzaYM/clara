import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const LETTERS_DIR = path.join(REPO_ROOT, "sample-letters");
const SEED_PATH = path.join(REPO_ROOT, "sample-data", "seed.ts");

const LETTERS = [
  "medicaid-renewal.png",
  "uscis-notice.png",
  "irs-cp14.png",
  "hospital-bill.png",
  "bank-notice.png",
  "social-security.png",
];

const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

test.describe("sample letters", () => {
  for (const filename of LETTERS) {
    test(`${filename} is a valid ~850×1100 PNG > 10KB`, () => {
      const filepath = path.join(LETTERS_DIR, filename);
      expect(fs.existsSync(filepath), `missing ${filepath}`).toBe(true);

      const buf = fs.readFileSync(filepath);
      expect(buf.subarray(0, 8).equals(PNG_MAGIC)).toBe(true);
      expect(buf.byteLength).toBeGreaterThan(10_000);

      const width = buf.readUInt32BE(16);
      const height = buf.readUInt32BE(20);
      expect(Math.abs(width - 850)).toBeLessThanOrEqual(50);
      expect(Math.abs(height - 1100)).toBeLessThanOrEqual(50);
    });
  }
});

test("seed script and tests type-check (no errors in our files)", () => {
  expect(fs.existsSync(SEED_PATH)).toBe(true);

  const result = spawnSync("npx", ["tsc", "--noEmit", "-p", "."], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });

  const output = result.stdout + result.stderr;
  const ourErrors = output
    .split("\n")
    .filter((line) => /^(sample-data|tests|playwright\.config)/.test(line));
  expect(ourErrors, ourErrors.join("\n")).toHaveLength(0);
});
