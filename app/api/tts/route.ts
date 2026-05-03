// Default to Rachel (warm, multilingual via eleven_multilingual_v2). Free-tier
// ElevenLabs accounts can't use library voices via API — set ELEVENLABS_VOICE_ID
// in .env.local to a voice the account owns (Default Voices or a cloned one).
const FALLBACK_VOICE = "21m00Tcm4TlvDq8ikWAM";
const VOICES: Record<string, string> = {};

function languageToCode(language: unknown): string {
  if (typeof language !== "string") return "en";
  const l = language.trim().toLowerCase();
  if (l.length === 2) return l;
  if (l === "english") return "en";
  if (l === "spanish" || l === "español") return "es";
  if (l === "mandarin" || l === "chinese" || l === "中文") return "zh";
  if (l === "portuguese" || l === "português") return "pt";
  if (l === "haitian creole" || l === "kreyòl ayisyen") return "ht";
  if (l === "vietnamese" || l === "tiếng việt") return "vi";
  if (l === "arabic" || l === "العربية") return "ar";
  if (l === "french" || l === "français") return "fr";
  if (l === "urdu" || l === "اردو") return "ur";
  return "en";
}

export async function POST(req: Request) {
  const { text, language } = await req.json();
  if (typeof text !== "string" || !text.trim()) {
    return Response.json({ error: "text is required" }, { status: 400 });
  }

  const code = languageToCode(language);
  const voiceId = process.env.ELEVENLABS_VOICE_ID ?? VOICES[code] ?? FALLBACK_VOICE;

  const r = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY!,
      "Content-Type": "application/json",
      Accept: "audio/mpeg",
    },
    body: JSON.stringify({ text, model_id: "eleven_multilingual_v2" }),
  });

  if (!r.ok) {
    const errBody = await r.text();
    return Response.json({ error: errBody }, { status: r.status });
  }

  const buf = await r.arrayBuffer();
  return new Response(buf, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Cache-Control": "no-store",
    },
  });
}
