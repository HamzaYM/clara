// Clara — shared tweaks panel + state
// Each page imports this after React + Babel + tweaks-panel.jsx.
// State is persisted across pages via localStorage so changes follow the user.

const STORAGE_KEY = 'clara-tweaks-v1';

const CLARA_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "sage",
  "background": "cream",
  "type": "serif-grotesk",
  "density": "standard",
  "fontSize": 20,
  "layout": "stacked",
  "player": "ribbon",
  "card": "calm",
  "urgency": "dot",
  "loading": "rotating",
  "dark": false,
  "language": "en",
  "paperGrain": true,
  "activeProfile": "elena"
}/*EDITMODE-END*/;

const ACCENT_PALETTES = {
  sage:       { accent: '#7A8B6F', soft: '#DDE3D5', ink: '#4A5A40' },
  terracotta: { accent: '#C97B5C', soft: '#F1DDD0', ink: '#7E4528' },
  amber:      { accent: '#B8956A', soft: '#EFE3D0', ink: '#7A5A30' },
  walnut:     { accent: '#8B6F47', soft: '#E5DBC9', ink: '#5C4625' },
};

// Background palettes — tints the whole canvas
const BACKGROUND_PALETTES = {
  cream:    { bg: '#F5EFE6', elev: '#FBF7EF', tint: '#EDE5D6' },
  ivory:    { bg: '#F8F2E4', elev: '#FDF8EC', tint: '#F0E6D0' },
  offwhite: { bg: '#F4F2ED', elev: '#FBFAF6', tint: '#ECE9E1' },
  linen:    { bg: '#EFE9DC', elev: '#F7F1E2', tint: '#E5DDC9' },
  parchment:{ bg: '#EDE3CC', elev: '#F5ECD8', tint: '#E0D4B8' },
};

const CLARA_PROFILES = [
  { id: 'elena',  name: 'Elena',   relation: 'Mom',     language: 'en', accent: 'sage',       letters: 6, initials: 'E' },
  { id: 'amir',   name: 'Amir',    relation: 'Dad',     language: 'ur', accent: 'walnut',     letters: 3, initials: 'A' },
  { id: 'marie',  name: 'Marie',   relation: 'Auntie',  language: 'fr', accent: 'terracotta', letters: 4, initials: 'M' },
  { id: 'self',   name: 'Yourself',relation: 'You',     language: 'en', accent: 'amber',      letters: 2, initials: '+' },
];

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch (e) { return {}; }
}

function applyTweaksToDOM(t) {
  const html = document.documentElement;
  const pal = ACCENT_PALETTES[t.accent] || ACCENT_PALETTES.sage;
  const bg = BACKGROUND_PALETTES[t.background] || BACKGROUND_PALETTES.cream;
  html.dataset.theme = t.dark ? 'dark' : 'light';
  html.dataset.density = t.density;
  html.dataset.type = t.type;
  html.dataset.layout = t.layout;
  html.dataset.player = t.player;
  html.dataset.card = t.card;
  html.dataset.urgency = t.urgency;
  html.dataset.loading = t.loading;
  html.dataset.lang = t.language;
  html.dataset.background = t.background;
  html.dir = t.language === 'ur' ? 'rtl' : 'ltr';
  html.lang = t.language;
  html.style.setProperty('--accent', pal.accent);
  html.style.setProperty('--accent-soft', pal.soft);
  html.style.setProperty('--accent-ink', pal.ink);
  if (!t.dark) {
    html.style.setProperty('--bg', bg.bg);
    html.style.setProperty('--bg-elev', bg.elev);
    html.style.setProperty('--bg-tint', bg.tint);
  } else {
    html.style.removeProperty('--bg');
    html.style.removeProperty('--bg-elev');
    html.style.removeProperty('--bg-tint');
  }
  html.style.setProperty('--text-base', t.fontSize + 'px');
  html.style.setProperty('--paper-opacity', t.paperGrain ? '1' : '0');
}

function useClaraTweaks() {
  const stored = React.useMemo(loadStored, []);
  const init = { ...CLARA_DEFAULTS, ...stored };
  const [t, setRaw] = React.useState(init);

  // Apply once on mount and on each change
  React.useEffect(() => {
    applyTweaksToDOM(t);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch (e) {}
    // Notify other tabs/pages
    window.dispatchEvent(new CustomEvent('clara-tweaks-changed', { detail: t }));
  }, [t]);

  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null
      ? keyOrEdits : { [keyOrEdits]: val };
    setRaw((prev) => ({ ...prev, ...edits }));
  }, []);

  return [t, setTweak];
}

// Apply stored tweaks ASAP to avoid flash. This runs on script load.
(function earlyApply() {
  const stored = loadStored();
  const t = { ...CLARA_DEFAULTS, ...stored };
  applyTweaksToDOM(t);
})();

function ClaraTweaksPanel({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Options">
      <TweakSection label="Theme" />
      <TweakRadio label="Accent" value={tweaks.accent}
                  options={[
                    {value: 'sage', label: 'Sage'},
                    {value: 'terracotta', label: 'Terra'},
                    {value: 'amber', label: 'Amber'},
                    {value: 'walnut', label: 'Walnut'},
                  ]}
                  onChange={(v) => setTweak('accent', v)} />
      <TweakSelect label="Background" value={tweaks.background}
                   options={[
                     {value: 'cream',     label: 'Cream (warm)'},
                     {value: 'ivory',     label: 'Ivory'},
                     {value: 'offwhite',  label: 'Off-white (neutral)'},
                     {value: 'linen',     label: 'Linen'},
                     {value: 'parchment', label: 'Parchment'},
                   ]}
                   onChange={(v) => setTweak('background', v)} />
      <TweakToggle label="Warm dark mode" value={tweaks.dark}
                   onChange={(v) => setTweak('dark', v)} />
      <TweakToggle label="Paper grain" value={tweaks.paperGrain}
                   onChange={(v) => setTweak('paperGrain', v)} />

      <TweakSection label="Type" />
      <TweakSelect label="Pairing" value={tweaks.type}
                   options={[
                     {value: 'serif-grotesk', label: 'Source Serif + Inter Tight'},
                     {value: 'news-dm', label: 'Newsreader + DM Sans'},
                     {value: 'all-serif', label: 'Fraunces + Source Serif (editorial)'},
                   ]}
                   onChange={(v) => setTweak('type', v)} />
      <TweakSlider label="Body size" value={tweaks.fontSize} min={18} max={26} step={2} unit="px"
                   onChange={(v) => setTweak('fontSize', v)} />

      <TweakSection label="Density" />
      <TweakRadio label="Spacing" value={tweaks.density}
                  options={['airy', 'standard', 'compact']}
                  onChange={(v) => setTweak('density', v)} />

      <TweakSection label="Letter view" />
      <TweakRadio label="Layout" value={tweaks.layout}
                  options={[
                    {value: 'stacked', label: 'Stacked'},
                    {value: 'split', label: 'Split'},
                    {value: 'story', label: 'Story'},
                  ]}
                  onChange={(v) => setTweak('layout', v)} />
      <TweakRadio label="Audio player" value={tweaks.player}
                  options={[
                    {value: 'ribbon', label: 'Ribbon'},
                    {value: 'big', label: 'Big'},
                    {value: 'tape', label: 'Tape'},
                  ]}
                  onChange={(v) => setTweak('player', v)} />

      <TweakSection label="Cards & urgency" />
      <TweakRadio label="Letter card" value={tweaks.card}
                  options={[
                    {value: 'calm', label: 'Calm'},
                    {value: 'detailed', label: 'Detail'},
                    {value: 'minimal', label: 'Minimal'},
                  ]}
                  onChange={(v) => setTweak('card', v)} />
      <TweakRadio label="Urgency" value={tweaks.urgency}
                  options={[
                    {value: 'dot', label: 'Dot'},
                    {value: 'bar', label: 'Bar'},
                    {value: 'badge', label: 'Badge'},
                  ]}
                  onChange={(v) => setTweak('urgency', v)} />

      <TweakSection label="Loading state" />
      <TweakRadio label="Style" value={tweaks.loading}
                  options={[
                    {value: 'rotating', label: 'Lines'},
                    {value: 'single', label: 'One'},
                    {value: 'illus', label: 'Visual'},
                  ]}
                  onChange={(v) => setTweak('loading', v)} />

      <TweakSection label="Language (demo)" />
      <TweakRadio label="Show in" value={tweaks.language}
                  options={[
                    {value: 'en', label: 'English'},
                    {value: 'fr', label: 'Français'},
                    {value: 'ur', label: 'اردو'},
                  ]}
                  onChange={(v) => setTweak('language', v)} />
    </TweaksPanel>
  );
}

Object.assign(window, {
  CLARA_DEFAULTS, ACCENT_PALETTES, BACKGROUND_PALETTES, CLARA_PROFILES,
  useClaraTweaks, ClaraTweaksPanel,
  applyTweaksToDOM, loadStoredClaraTweaks: loadStored,
});
