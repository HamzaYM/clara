// Clara — design tokens + tweaks state.
// The full debug "Options" panel was design-environment-only; this is the minimum
// the production pages need: defaults, palettes, profiles, and a hook that
// persists changes via localStorage and applies them to the <html> element.

'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'clara-tweaks-v1';

export interface Tweaks {
  accent: 'sage' | 'terracotta' | 'amber' | 'walnut';
  background: 'cream' | 'ivory' | 'offwhite' | 'linen' | 'parchment';
  type: 'serif-grotesk' | 'news-dm' | 'all-serif';
  density: 'airy' | 'standard' | 'compact';
  fontSize: number;
  layout: 'stacked' | 'split' | 'story';
  player: 'ribbon' | 'big' | 'tape';
  card: 'calm' | 'detailed' | 'minimal';
  urgency: 'dot' | 'bar' | 'badge';
  loading: 'rotating' | 'single' | 'illus';
  dark: boolean;
  language: string;
  paperGrain: boolean;
  activeProfile: string;
}

export const CLARA_DEFAULTS: Tweaks = {
  accent: 'sage',
  background: 'cream',
  type: 'serif-grotesk',
  density: 'standard',
  fontSize: 20,
  layout: 'stacked',
  player: 'ribbon',
  card: 'calm',
  urgency: 'dot',
  loading: 'rotating',
  dark: false,
  language: 'en',
  paperGrain: true,
  activeProfile: 'elena',
};

export interface AccentPalette { accent: string; soft: string; ink: string }
export const ACCENT_PALETTES = {
  sage:       { accent: '#7A8B6F', soft: '#DDE3D5', ink: '#4A5A40' },
  terracotta: { accent: '#C97B5C', soft: '#F1DDD0', ink: '#7E4528' },
  amber:      { accent: '#B8956A', soft: '#EFE3D0', ink: '#7A5A30' },
  walnut:     { accent: '#8B6F47', soft: '#E5DBC9', ink: '#5C4625' },
} satisfies Record<string, AccentPalette>;

export interface BackgroundPalette { bg: string; elev: string; tint: string }
export const BACKGROUND_PALETTES = {
  cream:    { bg: '#F5EFE6', elev: '#FBF7EF', tint: '#EDE5D6' },
  ivory:    { bg: '#F8F2E4', elev: '#FDF8EC', tint: '#F0E6D0' },
  offwhite: { bg: '#F4F2ED', elev: '#FBFAF6', tint: '#ECE9E1' },
  linen:    { bg: '#EFE9DC', elev: '#F7F1E2', tint: '#E5DDC9' },
  parchment:{ bg: '#EDE3CC', elev: '#F5ECD8', tint: '#E0D4B8' },
} satisfies Record<string, BackgroundPalette>;

export interface Profile {
  id: string;
  name: string;
  relation: string;
  language: string;
  accent: keyof typeof ACCENT_PALETTES;
  letters: number;
  initials: string;
}

export const CLARA_PROFILES: Profile[] = [
  { id: 'elena',  name: 'Elena',    relation: 'Mom',    language: 'en', accent: 'sage',       letters: 6, initials: 'E' },
  { id: 'amir',   name: 'Amir',     relation: 'Dad',    language: 'ur', accent: 'walnut',     letters: 3, initials: 'A' },
  { id: 'marie',  name: 'Marie',    relation: 'Auntie', language: 'fr', accent: 'terracotta', letters: 4, initials: 'M' },
  { id: 'self',   name: 'Yourself', relation: 'You',    language: 'en', accent: 'amber',      letters: 2, initials: '+' },
];

function applyTweaksToDOM(t: Tweaks) {
  if (typeof document === 'undefined') return;
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
  html.dir = t.language === 'ur' || t.language === 'ar' ? 'rtl' : 'ltr';
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

type TweakKey = keyof Tweaks;
type SetTweak = {
  <K extends TweakKey>(key: K, val: Tweaks[K]): void;
  (edits: Partial<Tweaks>): void;
};

export function useClaraTweaks(): [Tweaks, SetTweak] {
  const [t, setT] = useState<Tweaks>(CLARA_DEFAULTS);

  // Load stored tweaks once on mount (avoids SSR/hydration mismatch).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setT(prev => ({ ...prev, ...JSON.parse(raw) }));
    } catch {}
  }, []);

  // Persist + apply to DOM on change.
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(t)); } catch {}
    applyTweaksToDOM(t);
  }, [t]);

  const setTweak = useCallback(((keyOrEdits: TweakKey | Partial<Tweaks>, val?: unknown) => {
    const edits = (typeof keyOrEdits === 'object' && keyOrEdits !== null)
      ? keyOrEdits
      : { [keyOrEdits as TweakKey]: val } as Partial<Tweaks>;
    setT(prev => ({ ...prev, ...edits }));
  }) as SetTweak, []);

  return useMemo(() => [t, setTweak] as [Tweaks, SetTweak], [t, setTweak]);
}
