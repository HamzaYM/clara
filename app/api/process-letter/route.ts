import { createLetter, createDeadline, createCategoryRecord } from "@/lib/db";
import { runUniversalExtraction, runCategoryExtraction } from "@/lib/extractors";
import type { UniversalExtraction } from "@/types";

export async function POST(req: Request) {
  const { user_id, image_base64, language } = await req.json();

  if (typeof image_base64 !== "string" || !image_base64) {
    return Response.json({ error: "image_base64 is required" }, { status: 400 });
  }

  const universalRaw = await runUniversalExtraction(image_base64, language ?? "English");
  if (!universalRaw) {
    return Response.json({ error: "Failed to analyze letter" }, { status: 500 });
  }
  const universalResult = universalRaw as unknown as UniversalExtraction;

  const categoryResult = await runCategoryExtraction(
    universalResult.category,
    image_base64,
    universalResult,
  );

  const letter = createLetter({
    user_id: user_id ?? null,
    category: universalResult.category,
    sender: universalResult.sender,
    letter_type: universalResult.letter_type,
    language: language ?? null,
    summary_spoken: universalResult.summary_spoken,
    urgency: universalResult.urgency,
    raw_image_data: typeof image_base64 === "string" ? image_base64.slice(0, 200) : null,
    full_extraction: JSON.stringify(universalResult),
  });

  for (const d of universalResult.deadlines) {
    createDeadline({
      letter_id: letter.id,
      user_id: user_id ?? null,
      due_date: d.date,
      what: d.what,
      consequence: d.consequence_if_missed,
      reminded_at: null,
    });
  }

  if (categoryResult) {
    createCategoryRecord(universalResult.category, {
      ...categoryResult,
      letter_id: letter.id,
      user_id: user_id ?? null,
    });
  }

  return Response.json({
    letter_id: letter.id,
    extraction: { ...universalResult, category_data: categoryResult },
  });
}
