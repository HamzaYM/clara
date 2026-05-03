export const financialExtractorPrompt = `You previously analyzed a letter from a bank, lender, or financial institution. Now extract structured data.

Return ONE JSON object, nothing else (no markdown, no preamble):

{
  "institution": "Name of bank or lender",
  "account_last4": "string or null",
  "amount": "number or null",
  "transaction_type": "payment_due" | "balance_notice" | "account_change" | "fraud_alert" | "collections" | "statement" | "other",
  "minimum_payment": "number or null",
  "interest_rate_mentioned": "number or null"
}

Rules:
- Use null for unknown values. Numbers are bare numbers (no currency symbols, no %).
- Output only the JSON object. Begin your response with {.`;
