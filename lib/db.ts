import Database from "better-sqlite3";
import { mkdirSync } from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type {
  User,
  Letter,
  Deadline,
  GovernmentRecord,
  HealthRecord,
  FinancialRecord,
  CategoryRecord,
} from "@/types";

const DATA_DIR = path.join(process.cwd(), "data");
mkdirSync(DATA_DIR, { recursive: true });

export const db = new Database(path.join(DATA_DIR, "clara.db"));
db.pragma("journal_mode = WAL");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    preferred_language TEXT DEFAULT 'English',
    caregiver_email TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS letters (
    id TEXT PRIMARY KEY,
    user_id TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    category TEXT,
    sender TEXT,
    letter_type TEXT,
    language TEXT,
    summary_spoken TEXT,
    urgency TEXT,
    raw_image_data TEXT,
    full_extraction TEXT
  );

  CREATE TABLE IF NOT EXISTS deadlines (
    id TEXT PRIMARY KEY,
    letter_id TEXT,
    user_id TEXT,
    due_date TEXT,
    what TEXT,
    consequence TEXT,
    reminded_at TEXT
  );

  CREATE TABLE IF NOT EXISTS government_records (
    id TEXT PRIMARY KEY,
    letter_id TEXT,
    user_id TEXT,
    agency TEXT,
    case_number TEXT,
    benefit_program TEXT,
    status TEXT,
    form_numbers_mentioned TEXT
  );

  CREATE TABLE IF NOT EXISTS health_records (
    id TEXT PRIMARY KEY,
    letter_id TEXT,
    user_id TEXT,
    provider TEXT,
    patient_name TEXT,
    service_date TEXT,
    appointment_date TEXT,
    amount_due REAL,
    amount_insurance_paid REAL,
    claim_number TEXT,
    letter_subtype TEXT
  );

  CREATE TABLE IF NOT EXISTS financial_records (
    id TEXT PRIMARY KEY,
    letter_id TEXT,
    user_id TEXT,
    institution TEXT,
    account_last4 TEXT,
    amount REAL,
    transaction_type TEXT,
    minimum_payment REAL,
    interest_rate_mentioned REAL
  );
`);

export function createUser(input: {
  name?: string;
  preferred_language?: string;
  caregiver_email?: string;
}): User {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO users (id, name, preferred_language, caregiver_email)
     VALUES (?, ?, ?, ?)`,
  ).run(
    id,
    input.name ?? null,
    input.preferred_language ?? "English",
    input.caregiver_email ?? null,
  );
  return getUser(id)!;
}

export function getUser(id: string): User | null {
  const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
  return row ?? null;
}

export function createLetter(input: Omit<Letter, "id" | "created_at">): Letter {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO letters
       (id, user_id, category, sender, letter_type, language,
        summary_spoken, urgency, raw_image_data, full_extraction)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.user_id ?? null,
    input.category ?? null,
    input.sender ?? null,
    input.letter_type ?? null,
    input.language ?? null,
    input.summary_spoken ?? null,
    input.urgency ?? null,
    input.raw_image_data ?? null,
    input.full_extraction ?? null,
  );
  return db.prepare(`SELECT * FROM letters WHERE id = ?`).get(id) as Letter;
}

export function getLetterById(id: string): (Letter & {
  deadlines: Deadline[];
  category_record: CategoryRecord | null;
}) | null {
  const letter = db.prepare(`SELECT * FROM letters WHERE id = ?`).get(id) as Letter | undefined;
  if (!letter) return null;

  const deadlines = db
    .prepare(`SELECT * FROM deadlines WHERE letter_id = ? ORDER BY due_date ASC`)
    .all(id) as Deadline[];

  let category_record: CategoryRecord | null = null;
  const cat = (letter.category ?? "").toLowerCase();
  if (cat === "government") {
    category_record =
      (db.prepare(`SELECT * FROM government_records WHERE letter_id = ?`).get(id) as GovernmentRecord | undefined) ?? null;
  } else if (cat === "health") {
    category_record =
      (db.prepare(`SELECT * FROM health_records WHERE letter_id = ?`).get(id) as HealthRecord | undefined) ?? null;
  } else if (cat === "financial") {
    category_record =
      (db.prepare(`SELECT * FROM financial_records WHERE letter_id = ?`).get(id) as FinancialRecord | undefined) ?? null;
  }

  return { ...letter, deadlines, category_record };
}

export function getLettersByUserId(userId: string): Letter[] {
  return db
    .prepare(`SELECT * FROM letters WHERE user_id = ? ORDER BY created_at DESC`)
    .all(userId) as Letter[];
}

export function createDeadline(input: Omit<Deadline, "id">): Deadline {
  const id = randomUUID();
  db.prepare(
    `INSERT INTO deadlines (id, letter_id, user_id, due_date, what, consequence, reminded_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    id,
    input.letter_id ?? null,
    input.user_id ?? null,
    input.due_date ?? null,
    input.what ?? null,
    input.consequence ?? null,
    input.reminded_at ?? null,
  );
  return db.prepare(`SELECT * FROM deadlines WHERE id = ?`).get(id) as Deadline;
}

export function getDeadlinesByUserId(userId: string): Deadline[] {
  return db
    .prepare(`SELECT * FROM deadlines WHERE user_id = ? ORDER BY due_date ASC`)
    .all(userId) as Deadline[];
}

// Routes a category-specific record to the right table.
// Returns null for "other" / unknown categories — full_extraction on the
// letter row still holds the data.
export function createCategoryRecord(
  category: string,
  data: Record<string, unknown> & { letter_id: string; user_id?: string | null },
): CategoryRecord | null {
  const id = randomUUID();
  const cat = category.toLowerCase();

  if (cat === "government") {
    db.prepare(
      `INSERT INTO government_records
         (id, letter_id, user_id, agency, case_number, benefit_program, status, form_numbers_mentioned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      data.letter_id,
      data.user_id ?? null,
      (data.agency as string) ?? null,
      (data.case_number as string) ?? null,
      (data.benefit_program as string) ?? null,
      (data.status as string) ?? null,
      data.form_numbers_mentioned ? JSON.stringify(data.form_numbers_mentioned) : null,
    );
    return db.prepare(`SELECT * FROM government_records WHERE id = ?`).get(id) as GovernmentRecord;
  }

  if (cat === "health") {
    db.prepare(
      `INSERT INTO health_records
         (id, letter_id, user_id, provider, patient_name, service_date, appointment_date,
          amount_due, amount_insurance_paid, claim_number, letter_subtype)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      data.letter_id,
      data.user_id ?? null,
      (data.provider as string) ?? null,
      (data.patient_name as string) ?? null,
      (data.service_date as string) ?? null,
      (data.appointment_date as string) ?? null,
      (data.amount_due as number) ?? null,
      (data.amount_insurance_paid as number) ?? null,
      (data.claim_number as string) ?? null,
      (data.letter_subtype as string) ?? null,
    );
    return db.prepare(`SELECT * FROM health_records WHERE id = ?`).get(id) as HealthRecord;
  }

  if (cat === "financial") {
    db.prepare(
      `INSERT INTO financial_records
         (id, letter_id, user_id, institution, account_last4, amount,
          transaction_type, minimum_payment, interest_rate_mentioned)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      data.letter_id,
      data.user_id ?? null,
      (data.institution as string) ?? null,
      (data.account_last4 as string) ?? null,
      (data.amount as number) ?? null,
      (data.transaction_type as string) ?? null,
      (data.minimum_payment as number) ?? null,
      (data.interest_rate_mentioned as number) ?? null,
    );
    return db.prepare(`SELECT * FROM financial_records WHERE id = ?`).get(id) as FinancialRecord;
  }

  return null;
}
