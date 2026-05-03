export const healthExtractorPrompt = `You previously analyzed a health-related letter (bill, EOB, appointment notice, prescription, or insurance decision). Now extract structured data.

Return ONE JSON object, nothing else (no markdown, no preamble):

{
  "provider": "Doctor, hospital, or insurer name",
  "patient_name": "string or null",
  "service_date": "YYYY-MM-DD or null",
  "appointment_date": "YYYY-MM-DD or null",
  "amount_due": "number or null (no $ or commas)",
  "amount_insurance_paid": "number or null",
  "claim_number": "string or null",
  "letter_subtype": "bill" | "eob" | "appointment" | "prescription" | "insurance_decision" | "other"
}

Rules:
- Use null for unknown values. Numbers are bare numbers (e.g., 1247.50, not "$1,247.50").
- Output only the JSON object. Begin your response with {.`;
