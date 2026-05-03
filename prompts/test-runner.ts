import { readFileSync } from "node:fs";
import { runUniversalExtraction, runCategoryExtraction } from "@/lib/extractors";

async function main() {
  const imagePath = process.argv[2];
  if (!imagePath) {
    console.error("usage: npx tsx --env-file=.env.local prompts/test-runner.ts <image-path>");
    process.exit(1);
  }

  const language = process.env.CLARA_LANG ?? "Spanish";
  const b64 = readFileSync(imagePath).toString("base64");

  console.log(`\n=== Universal Extraction (language: ${language}) ===`);
  const t0 = performance.now();
  const universal = await runUniversalExtraction(b64, language);
  console.log(`(${((performance.now() - t0) / 1000).toFixed(1)}s)`);
  console.log(JSON.stringify(universal, null, 2));

  if (universal && typeof universal.category === "string") {
    const cat = universal.category;
    if (cat === "government" || cat === "health" || cat === "financial") {
      console.log(`\n=== Category Extraction (${cat}) ===`);
      const t1 = performance.now();
      const detail = await runCategoryExtraction(cat, b64, universal);
      console.log(`(${((performance.now() - t1) / 1000).toFixed(1)}s)`);
      console.log(JSON.stringify(detail, null, 2));
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
