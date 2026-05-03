import { test, expect } from "@playwright/test";
import { readFileSync, existsSync } from "node:fs";
import { universalPrompt } from "@/prompts/universal";
import { runUniversalExtraction, runCategoryExtraction } from "@/lib/extractors";

test("universalPrompt interpolates language", () => {
  expect(universalPrompt("Spanish")).toContain("Spanish");
  expect(universalPrompt("Vietnamese")).toContain("Vietnamese");
});

test("universalPrompt contains the JSON shape keys", () => {
  const p = universalPrompt("Spanish");
  for (const key of [
    "summary_spoken",
    "what_you_need_to_do",
    "deadlines",
    "draft_response",
    "reassurance",
  ]) {
    expect(p).toContain(key);
  }
});

test("runCategoryExtraction returns null for unknown categories without calling API", async () => {
  expect(await runCategoryExtraction("legal", "", {})).toBeNull();
  expect(await runCategoryExtraction("other", "", {})).toBeNull();
  expect(await runCategoryExtraction("nonsense", "", {})).toBeNull();
});

test("real-letter extraction (Medicaid renewal in Spanish)", async () => {
  test.skip(
    !process.env.RUN_REAL_LETTER_TEST,
    "set RUN_REAL_LETTER_TEST=1 to run (costs ~1 API call)",
  );
  const fixture = "sample-letters/medicaid-renewal.png";
  test.skip(!existsSync(fixture), "fixture not found");
  const b64 = readFileSync(fixture).toString("base64");
  const result = await runUniversalExtraction(b64, "Spanish");
  expect(result).not.toBeNull();
  expect(result?.category).toBe("government");
  expect(typeof result?.summary_spoken).toBe("string");
  expect(((result?.summary_spoken as string) ?? "").length).toBeGreaterThan(20);
});
