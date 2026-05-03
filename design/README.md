# Clara

A calmer way to read the mail. Designed for people who get a lot of important paperwork in a language that isn't quite their first.

## What's here

A working hi-fi prototype, 8 screens, plain HTML + React via in-browser Babel (no build step).

```
index.html       Overview canvas — links to every screen
picker.html      "Whose mail are we looking at today?" (caregiver profile picker)
setup.html       First-run onboarding (name, language, optional caregiver email)
upload.html      Home — greeting, big upload area, recent letters, loading state
letter.html      The heart — auto-playing audio, plain-language summary, actions, deadlines
profile.html     "My letters" grouped by category
reminders.html   Upcoming deadlines, sorted
account.html     Settings — voice, caregivers, language, privacy
```

Open `index.html` in a browser to start. Everything else is reachable from there.

## File map

```
index.html               Canvas overview
*.html                   Pages (each is a thin React app)
clara.css                Design tokens + base styles (theme variables, type scale, cards)
clara-pages.css          Page-specific layouts (hero, letter view, lists, reminders)
clara-content.jsx        Static content — letters, copy, translations, UI strings
clara-components.jsx     Shared React components (TopNav, ClaraLogo, Icons, AudioPlayer, cards)
clara-tweaks.jsx         Options state + DOM application + persistence
options-panel.jsx        Standalone Options panel (bottom-left button on every page)
```

## The Options panel

A floating "Options" button sits in the **bottom-left** of every screen. Click it (or press **O**) to open a panel of demo controls. **Esc** closes.

Settings persist across pages via `localStorage` (key: `clara-tweaks-v1`).

| Section | Controls |
|---|---|
| Theme | Accent (Sage / Terra / Amber / Walnut), Background (Cream / Ivory / Off-white / Linen / Parchment), Warm dark mode, Paper grain |
| Type | Pairing (Source Serif + Inter Tight / Newsreader + DM Sans / Fraunces + Source Serif), Body size 18–26px |
| Density | Airy / Standard / Compact |
| Letter view | Layout (Stacked / Split / Story), Audio player (Ribbon / Big / Tape) |
| Cards & urgency | Card style (Calm / Detail / Minimal), Urgency indicator (Dot / Bar / Badge) |
| Loading state | Lines / One / Visual |
| Language | English / Français / اردو (Urdu reflows the entire app right-to-left) |

Defaults live in `clara-tweaks.jsx` in `CLARA_DEFAULTS`.

## Profiles

Three demo profiles ship preconfigured (see `CLARA_PROFILES` in `clara-tweaks.jsx`):

- **Elena** — Mom, English, Sage accent, 6 letters
- **Amir** — Dad, Urdu (RTL), Walnut accent, 3 letters
- **Marie** — Auntie, Français, Terracotta accent, 4 letters

Switching profiles via the picker also switches language + accent in one tap.

## Demo flow

1. `index.html` — overview, click any thumbnail
2. `picker.html` → tap **Amir** → app reflows RTL with Urdu strings, walnut accent
3. `upload.html` → "Did anything come in the mail today?" with Amir's name
4. Click any letter → `letter.html` with audio player, plain-language summary, deadline cards, draft reply
5. Open **Options** (bottom-left) → switch language to Français, accent to Terracotta — every page restyles instantly
6. `account.html` → see settings, switch back to Elena from the "other people you help" chips

## Architecture notes

- **No build step.** Each HTML page loads React 18.3.1 + Babel 7.29 via `<script>` tag and renders inline JSX. Pinned versions with integrity hashes.
- **Shared scope by convention.** Each `<script type="text/babel">` gets its own scope — components are exported to `window` at the end of `clara-components.jsx` so other pages can use them.
- **Tokens as data attributes.** `clara-tweaks.jsx` writes `data-theme`, `data-density`, `data-type`, `data-layout`, etc. to `<html>`, and `clara.css` keys off them with attribute selectors. Adding a new variant = add the option, add the matching CSS rule.
- **i18n is plain string maps.** `UI_STRINGS` and per-letter content blocks in `clara-content.jsx` carry English / French / Urdu side-by-side. Direction is set by `<html dir>`.
- **Audio is mocked.** The "play" button advances a fake progress bar — wire `window.claude.complete` or a real TTS endpoint into `AudioPlayer` in `clara-components.jsx` to make it real.

## Possible next steps

- Real OCR + summarization on upload (drop a service into the upload handler in `upload.html`)
- Real TTS in `AudioPlayer`
- Caregiver email digest job
- Persisted server-side profiles (currently `localStorage` only)
- More languages — strings already keyed by code, just add entries to `UI_STRINGS` and `CLARA_GREETINGS`
- Real calendar integration for the deadline cards

## Running locally

Just open `index.html`. No server needed (Babel + React load from unpkg). If you want to serve over HTTP for cleaner module behavior:

```
python3 -m http.server 8000
# then open http://localhost:8000/index.html
```
