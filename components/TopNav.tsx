'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ClaraLogo } from './ClaraLogo';
import { UI_STRINGS } from '@/lib/content';
import { CLARA_PROFILES, ACCENT_PALETTES, CLARA_DEFAULTS, type Profile } from '@/lib/tweaks';

interface TopNavProps {
  active: 'home' | 'profile' | 'reminders' | 'account';
  lang?: string;
}

export function TopNav({ active, lang = 'en' }: TopNavProps) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  // Resolve active profile from localStorage on mount (avoids SSR mismatch).
  const [profile, setProfile] = useState<Profile | null>(
    CLARA_PROFILES.find(p => p.id === CLARA_DEFAULTS.activeProfile) || null
  );
  useEffect(() => {
    try {
      const raw = localStorage.getItem('clara-tweaks-v1');
      const stored = raw ? JSON.parse(raw) : {};
      const id = stored.activeProfile || CLARA_DEFAULTS.activeProfile;
      const p = CLARA_PROFILES.find(x => x.id === id);
      if (p) setProfile(p);
    } catch {}
  }, []);

  const pal = profile ? (ACCENT_PALETTES[profile.accent] || ACCENT_PALETTES.sage) : null;

  return (
    <header className="topnav">
      <ClaraLogo size="" />
      <nav className="nav-links">
        <Link href="/upload" className={active === 'home' ? 'active' : ''}>{ui.nav.home}</Link>
        <Link href="/profile" className={active === 'profile' ? 'active' : ''}>{ui.nav.profile}</Link>
        <Link href="/reminders" className={active === 'reminders' ? 'active' : ''}>{ui.nav.reminders}</Link>
        <Link href="/account" className={active === 'account' ? 'active' : ''}>{ui.nav.account}</Link>
        {profile && pal && (
          <Link
            href="/account"
            title={profile.name}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              textDecoration: 'none', marginLeft: 18,
              padding: '6px 14px 6px 6px', borderRadius: 999,
              background: 'var(--bg-elev)', border: '0.5px solid var(--rule)',
              color: 'var(--ink)',
            }}
          >
            <span style={{
              width: 28, height: 28, borderRadius: '50%',
              background: pal.soft, color: pal.ink,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 15,
            }}>{profile.initials}</span>
            <span style={{ fontSize: 14 }}>{profile.name}</span>
          </Link>
        )}
      </nav>
    </header>
  );
}
