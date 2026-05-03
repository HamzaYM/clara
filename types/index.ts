// DB-row types — match column-for-column with lib/db.ts schemas.

export interface User {
  id: string;
  name: string | null;
  preferred_language: string | null;
  caregiver_email: string | null;
  created_at: string;
}

export interface Letter {
  id: string;
  user_id: string | null;
  created_at: string;
  category: string | null;
  sender: string | null;
  letter_type: string | null;
  language: string | null;
  summary_spoken: string | null;
  urgency: string | null;
  raw_image_data: string | null;
  full_extraction: string | null;
}

export interface Deadline {
  id: string;
  letter_id: string | null;
  user_id: string | null;
  due_date: string | null;
  what: string | null;
  consequence: string | null;
  reminded_at: string | null;
}

export interface GovernmentRecord {
  id: string;
  letter_id: string | null;
  user_id: string | null;
  agency: string | null;
  case_number: string | null;
  benefit_program: string | null;
  status: string | null;
  form_numbers_mentioned: string | null;
}

export interface HealthRecord {
  id: string;
  letter_id: string | null;
  user_id: string | null;
  provider: string | null;
  patient_name: string | null;
  service_date: string | null;
  appointment_date: string | null;
  amount_due: number | null;
  amount_insurance_paid: number | null;
  claim_number: string | null;
  letter_subtype: string | null;
}

export interface FinancialRecord {
  id: string;
  letter_id: string | null;
  user_id: string | null;
  institution: string | null;
  account_last4: string | null;
  amount: number | null;
  transaction_type: string | null;
  minimum_payment: number | null;
  interest_rate_mentioned: number | null;
}

export type CategoryRecord = GovernmentRecord | HealthRecord | FinancialRecord;

// Shape produced by the universal extraction pass. The prompts agent will
// implement runUniversalExtraction in lib/extractors.ts and must return this
// shape. Stored as JSON.stringify on letters.full_extraction.
export interface UniversalExtraction {
  category: "government" | "health" | "financial" | "other";
  sender: string;
  letter_type: string;
  urgency: "low" | "med" | "high";
  summary_spoken: string;
  what_you_need_to_do: string[];
  deadlines: Array<{
    date: string;
    what: string;
    consequence_if_missed: string;
  }>;
  documents_needed: string[];
  draft_response: {
    needed: boolean;
    to: string;
    subject: string;
    body: string;
  };
  reassurance: string;
}
