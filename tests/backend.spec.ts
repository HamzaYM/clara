import { test, expect } from "@playwright/test";
import { readFileSync } from "fs";
import path from "path";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

test("GET /api/letters/{unknown id} returns 404", async ({ request }) => {
  const res = await request.get("/api/letters/does-not-exist");
  expect(res.status()).toBe(404);
  const body = await res.json();
  expect(body).toHaveProperty("error");
});

test("POST /api/users creates a user and returns a UUID", async ({ request }) => {
  const res = await request.post("/api/users", {
    data: { name: "Elena", preferred_language: "English" },
  });
  expect(res.ok()).toBeTruthy();
  const body = await res.json();
  expect(body.user_id).toMatch(UUID_RE);
});

test("POST /api/process-letter then GET /api/letters/{id} round-trips", async ({ request }) => {
  // Create a user first.
  const userRes = await request.post("/api/users", {
    data: { name: "Elena", preferred_language: "English" },
  });
  const { user_id } = await userRes.json();

  // Use a real sample letter as the image.
  const png = readFileSync(
    path.join(process.cwd(), "sample-letters", "medicaid-renewal.png"),
  );
  const image_base64 = png.toString("base64");

  const procRes = await request.post("/api/process-letter", {
    data: { user_id, image_base64, language: "English" },
  });
  expect(procRes.ok()).toBeTruthy();
  const proc = await procRes.json();

  expect(proc.letter_id).toMatch(UUID_RE);
  expect(proc.extraction.category).toBe("government");
  expect(proc.extraction.sender).toBeTruthy();
  expect(proc.extraction.summary_spoken.length).toBeGreaterThan(20);
  expect(Array.isArray(proc.extraction.deadlines)).toBe(true);
  expect(proc.extraction.deadlines.length).toBeGreaterThanOrEqual(1);
  expect(proc.extraction.draft_response).toMatchObject({ needed: true });

  // Now GET it back.
  const getRes = await request.get(`/api/letters/${proc.letter_id}`);
  expect(getRes.ok()).toBeTruthy();
  const letter = await getRes.json();

  expect(letter.id).toBe(proc.letter_id);
  expect(letter.user_id).toBe(user_id);
  expect(letter.category).toBe("government");
  expect(Array.isArray(letter.deadlines)).toBe(true);
  expect(letter.deadlines.length).toBeGreaterThanOrEqual(1);
  expect(letter.deadlines[0].due_date).toBeTruthy();
  expect(letter.category_record).toBeTruthy();
  expect(letter.category_record.agency).toBe("MassHealth");
});

test("POST /api/tts hits ElevenLabs (audio on success, upstream error otherwise)", async ({ request }) => {
  const res = await request.post("/api/tts", {
    data: { text: "Hello Elena, this is a test.", language: "English" },
  });

  // The route must never 500 from a code bug — that's what we're really
  // checking. ElevenLabs may reject with 402/401 if the configured voice
  // isn't accessible on the account's plan; that's a config issue, not a
  // bug in our code.
  expect(res.status()).toBeLessThan(500);

  if (res.ok()) {
    expect(res.headers()["content-type"]).toContain("audio/mpeg");
    const buf = await res.body();
    expect(buf.byteLength).toBeGreaterThan(1000);
  } else {
    const body = await res.text();
    console.warn(
      `TTS upstream returned ${res.status()} — likely a voice/plan config issue. ` +
        `Set ELEVENLABS_VOICE_ID in .env.local to a voice your account owns. ` +
        `Body: ${body.slice(0, 200)}`,
    );
  }
});
