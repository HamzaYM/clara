export const governmentExtractorPrompt = `You previously analyzed an official US government letter. Now extract structured data.

Return ONE JSON object, nothing else (no markdown, no preamble):

{
  "agency": "Specific agency (e.g., 'MassHealth', 'USCIS', 'IRS', 'SSA')",
  "case_number": "string or null",
  "benefit_program": "string or null (e.g., 'Medicaid', 'SNAP', 'I-485 Adjustment of Status')",
  "status": "Current status implied by the letter (e.g., 'pending review', 'renewal required', 'denied')",
  "form_numbers_mentioned": ["I-797", "CP14"]
}

Rules:
- Use null for unknown string fields and [] for unknown arrays. Never guess agency names.
- Output only the JSON object. Begin your response with {.`;
