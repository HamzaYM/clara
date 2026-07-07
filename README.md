# Clara

**Clara turns confusing mail into plain language you can actually understand — and listen to.**

Government notices, health-insurance statements, and bank letters are written for
lawyers and administrators, not for people. That hits older adults hardest: a missed
deadline buried in dense jargon can mean a lost benefit, a surprise bill, or a penalty.

Clara takes a photo or PDF of a letter and gives back:

- a short, **plain-language summary** of what the letter actually says,
- the **deadlines** and what happens if you miss them,
- the **key facts** (who sent it, amounts, case/claim numbers), and
- a **read-aloud audio** version, in the reader's language.

It's built for older people and the family members who help them — a caregiver can
snap a picture of a parent's mail and instantly know whether it needs attention.

> Clara is a work in progress (it started as a hackathon project). It's useful today,
> but expect rough edges. Contributions welcome — see [CONTRIBUTING](CONTRIBUTING.md).

---

## Screens

Clara is a small Next.js app with these screens:

| Route | What it does |
|---|---|
| `/` | Home / landing |
| `/upload` | Take or upload a photo/PDF of a letter |
| `/picker` | Choose which letter to view |
| `/letter/[id]` | The plain-language summary, deadlines, key facts, and listen button |
| `/reminders` | Upcoming deadlines pulled from processed letters |
| `/profile` | Reader's name, preferred language, caregiver email |
| `/account` | Account settings |

Under the hood, Clara uses **Claude** (Anthropic) to read and explain letters, and
**ElevenLabs** to speak the summary out loud.

---

## Quickstart

**Prerequisites:** Node.js 20+ and npm.

```bash
# 1. Clone
git clone https://github.com/HamzaYM/clara.git
cd clara

# 2. Set up your keys
cp .env.example .env.local
#   then open .env.local and paste in your own API keys (see below)

# 3. Install dependencies
npm install

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The local SQLite database (`data/clara.db`) is created automatically the first time
you run the app — there's nothing to set up.

Optional: seed some sample data with `npm run seed`.

---

## Where each API key goes

All keys live in `.env.local` (which is gitignored — it is never committed). Copy
`.env.example` to `.env.local` and fill in your own values:

| Variable | Required? | What it's for | Get it from |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | **Yes** | Reads and explains letters (Claude) | https://console.anthropic.com/settings/keys |
| `ELEVENLABS_API_KEY` | Yes, for audio | Read-aloud text-to-speech | https://elevenlabs.io/app/settings/api-keys |
| `ELEVENLABS_VOICE_ID` | Optional | Override the default voice (needed on free ElevenLabs tiers) | Your ElevenLabs voice library |

- The Anthropic SDK picks up `ANTHROPIC_API_KEY` automatically — no code changes needed.
- If you skip `ELEVENLABS_API_KEY`, letters still process fine; only the audio playback fails.

---

## Connect a database

**By default, Clara needs no database setup.** It stores everything in a local SQLite
file at `./data/clara.db` using [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3).
The file and all tables are created automatically on first run (see `lib/db.ts`).

That's perfect for personal use and development. If you want to deploy Clara for
multiple users or on a platform with an ephemeral filesystem, you'll likely want a
managed database such as Postgres. Here's how to move.

### 1. The schema

Clara's data model (defined in `lib/db.ts`) is:

- `users` — id, name, preferred_language, caregiver_email, created_at
- `letters` — id, user_id, category, sender, letter_type, language, summary_spoken, urgency, raw_image_data, full_extraction, created_at
- `deadlines` — id, letter_id, user_id, due_date, what, consequence, reminded_at
- `government_records` / `health_records` / `financial_records` — category-specific details linked to a letter

The equivalent Postgres schema for the core tables looks like:

```sql
CREATE TABLE users (
  id                 TEXT PRIMARY KEY,
  name               TEXT,
  preferred_language TEXT DEFAULT 'English',
  caregiver_email    TEXT,
  created_at         TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE letters (
  id              TEXT PRIMARY KEY,
  user_id         TEXT REFERENCES users(id),
  created_at      TIMESTAMPTZ DEFAULT now(),
  category        TEXT,
  sender          TEXT,
  letter_type     TEXT,
  language        TEXT,
  summary_spoken  TEXT,
  urgency         TEXT,
  raw_image_data  TEXT,
  full_extraction TEXT
);

CREATE TABLE deadlines (
  id          TEXT PRIMARY KEY,
  letter_id   TEXT REFERENCES letters(id),
  user_id     TEXT REFERENCES users(id),
  due_date    TEXT,
  what        TEXT,
  consequence TEXT,
  reminded_at TEXT
);
-- ...plus government_records, health_records, financial_records (see lib/db.ts)
```

### 2. The env var

Add your connection string to `.env.local` (a placeholder is already in `.env.example`):

```bash
DATABASE_URL=postgres://user:password@host:5432/clara
```

### 3. Wire it up

`lib/db.ts` is the single place that talks to the database — every route imports its
helper functions (`createUser`, `createLetter`, `getLetterById`, …) from there. To
switch databases you only need to reimplement that one file:

1. Install a Postgres client (e.g. `npm install pg`).
2. In `lib/db.ts`, replace the `better-sqlite3` connection with one that reads
   `process.env.DATABASE_URL`, and run the schema above.
3. Reimplement each exported helper against your client, keeping the **same function
   signatures**. Because the rest of the app only calls those helpers, nothing else
   has to change.

---

## Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Claude** via `@anthropic-ai/sdk` for letter understanding
- **ElevenLabs** for text-to-speech
- **SQLite** via `better-sqlite3` (swappable — see above)
- **Playwright** for tests

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run lint` | Lint |
| `npm run seed` | Seed sample data |

## License

[MIT](LICENSE) — free to use, modify, and share.
