import { createLetter, createDeadline, createCategoryRecord } from "@/lib/db";
import type { UniversalExtraction } from "@/types";

export async function POST(req: Request) {
  const { user_id, image_base64, language } = await req.json();

  // TODO: replace with real call to runUniversalExtraction from lib/extractors.ts
  // (prompts agent owns this — see UniversalExtraction in types/index.ts for the contract)
  const universalResult: UniversalExtraction = {
    category: "government",
    sender: "MassHealth",
    letter_type: "Medicaid Renewal Notice",
    urgency: "high",
    summary_spoken:
      "MassHealth needs to confirm you still qualify for your health insurance. They've sent you a packet of forms. If you don't return them by May 17, your coverage will stop on June 1.",
    what_you_need_to_do: [
      "Find the green packet they sent — it has the renewal forms inside.",
      "Fill in your current address, your income, and who lives with you.",
      "Mail it back in the envelope they included, or upload it at masshealth.gov.",
    ],
    deadlines: [
      {
        date: "2026-05-17",
        what: "Return renewal form",
        consequence_if_missed: "Your coverage will end",
      },
    ],
    documents_needed: ["Proof of income", "Tax return"],
    draft_response: {
      needed: true,
      to: "MassHealth Enrollment Center",
      subject: "Medicaid Renewal Submission",
      body: "Dear MassHealth, I am writing to confirm receipt of my Medicaid renewal notice. Enclosed please find my completed renewal forms. Sincerely, Elena",
    },
    reassurance:
      "This is the same form you filled out last year. Take your time — we'll walk through it together.",
  };

  // TODO: replace with real call to runCategoryExtraction from lib/extractors.ts
  const categoryResult = {
    agency: "MassHealth",
    case_number: "MH-2026-0481",
    benefit_program: "Medicaid",
    status: "renewal_required",
    form_numbers_mentioned: [] as string[],
  };

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

  createCategoryRecord(universalResult.category, {
    ...categoryResult,
    letter_id: letter.id,
    user_id: user_id ?? null,
  });

  return Response.json({
    letter_id: letter.id,
    extraction: { ...universalResult, category_data: categoryResult },
  });
}
