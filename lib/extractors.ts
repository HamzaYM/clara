import { anthropic } from "./anthropic";
import { universalPrompt } from "@/prompts/universal";
import { governmentExtractorPrompt } from "@/prompts/government";
import { healthExtractorPrompt } from "@/prompts/health";
import { financialExtractorPrompt } from "@/prompts/financial";

const MODEL = "claude-sonnet-4-6";

const CATEGORY_PROMPTS: Record<string, string> = {
  government: governmentExtractorPrompt,
  health: healthExtractorPrompt,
  financial: financialExtractorPrompt,
};

function safeParseJSON(raw: string): Record<string, unknown> | null {
  const stripped = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();
  try {
    return JSON.parse(stripped);
  } catch {
    return null;
  }
}

export async function runUniversalExtraction(
  imageBase64: string,
  language: string,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 2000,
      system: universalPrompt(language),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/png", data: imageBase64 },
            },
            { type: "text", text: "Please analyze this letter." },
          ],
        },
      ],
    });
    const block = res.content.find((b) => b.type === "text");
    if (block?.type !== "text") return null;
    return safeParseJSON(block.text);
  } catch {
    return null;
  }
}

export async function runCategoryExtraction(
  category: string,
  imageBase64: string,
  universalResult: object,
): Promise<Record<string, unknown> | null> {
  const system = CATEGORY_PROMPTS[category];
  if (!system) return null;
  try {
    const res = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1000,
      system,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: { type: "base64", media_type: "image/png", data: imageBase64 },
            },
            {
              type: "text",
              text: `Universal extraction result:\n${JSON.stringify(universalResult, null, 2)}`,
            },
          ],
        },
      ],
    });
    const block = res.content.find((b) => b.type === "text");
    if (block?.type !== "text") return null;
    return safeParseJSON(block.text);
  } catch {
    return null;
  }
}
