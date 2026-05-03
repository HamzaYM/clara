import fs from "node:fs";
import path from "node:path";

const BASE_URL = process.env.CLARA_BASE_URL ?? "http://localhost:3000";
const REPO_ROOT = path.resolve(import.meta.dirname, "..");
const LETTERS_DIR = path.join(REPO_ROOT, "sample-letters");

const LETTERS = [
  "medicaid-renewal.png",
  "uscis-notice.png",
  "irs-cp14.png",
  "hospital-bill.png",
  "bank-notice.png",
  "social-security.png",
];

const ELENA = {
  name: "Elena Garcia",
  preferred_language: "Spanish",
  caregiver_email: "carmen@example.com",
};

function postJSON(url: string, body: unknown): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

async function describeFail(res: Response): Promise<string> {
  const body = (await res.text()).replace(/\s+/g, " ").trim();
  const snippet = body.length > 160 ? body.slice(0, 160) + "…" : body;
  return `${res.status} ${res.statusText}${snippet ? ` — ${snippet}` : ""}`;
}

async function main() {
  const userRes = await postJSON(`${BASE_URL}/api/users`, ELENA);
  if (!userRes.ok) {
    throw new Error(`POST /api/users failed: ${await describeFail(userRes)}`);
  }
  const { user_id } = (await userRes.json()) as { user_id: string };

  let succeeded = 0;
  for (let i = 0; i < LETTERS.length; i++) {
    const filename = LETTERS[i];
    const filepath = path.join(LETTERS_DIR, filename);
    process.stdout.write(`Processing ${i + 1}/${LETTERS.length}: ${filename}... `);

    try {
      const image_base64 = fs.readFileSync(filepath).toString("base64");
      const res = await postJSON(`${BASE_URL}/api/process-letter`, {
        user_id,
        image_base64,
        language: "Spanish",
      });

      if (!res.ok) {
        console.log(`failed: ${await describeFail(res)}`);
        continue;
      }
      console.log("done");
      succeeded++;
    } catch (err) {
      console.log(`failed: ${(err as Error).message}`);
    }
  }

  console.log(
    `\nSeeded user_id: ${user_id}. ${succeeded}/${LETTERS.length} letters processed.`,
  );
}

main().catch((err: Error & { cause?: unknown }) => {
  const cause = err.cause as { code?: string } | undefined;
  if (cause?.code === "ECONNREFUSED") {
    console.error(`Cannot reach ${BASE_URL} — is \`npm run dev\` running?`);
  } else {
    console.error(err);
  }
  process.exit(1);
});
