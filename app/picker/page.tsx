'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ClaraLogo } from '@/components/ClaraLogo';
import { ACCENT_PALETTES, CLARA_PROFILES, useClaraTweaks, type Profile } from '@/lib/tweaks';

export default function PickerPage() {
  const [t, setTweak] = useClaraTweaks();
  const router = useRouter();
  const lang = t.language;

  const avatarStyle = (p: Profile): React.CSSProperties => {
    const pal = ACCENT_PALETTES[p.accent] || ACCENT_PALETTES.sage;
    return { ['--avatar-bg' as string]: pal.soft, ['--avatar-ink' as string]: pal.ink };
  };

  const flagFor = (l: string) =>
    l === 'fr' ? '🇫🇷' : l === 'ur' ? 'اُر' : l === 'es' ? '🇪🇸' : 'EN';

  const onPick = (p: Profile) => {
    // Write directly first — router.push can outpace the persist useEffect.
    try {
      const raw = localStorage.getItem('clara-tweaks-v1');
      const stored = raw ? JSON.parse(raw) : {};
      Object.assign(stored, { activeProfile: p.id, language: p.language, accent: p.accent });
      localStorage.setItem('clara-tweaks-v1', JSON.stringify(stored));
    } catch {}
    setTweak({ activeProfile: p.id, language: p.language, accent: p.accent });
    setTimeout(() => router.push('/upload'), 200);
  };

  const greetCopy =
    lang === 'fr'
      ? { hi: "Bon retour sur Clara.", sub: "Le courrier de qui regardons-nous aujourd'hui ?" }
      : lang === 'ur'
      ? { hi: "کلارا میں خوش آمدید۔", sub: "آج کس کا خط دیکھنا ہے؟" }
      : { hi: "Welcome back to Clara.", sub: "Whose mail are we looking at today?" };

  return (
    <div className="pp-page" data-screen-label="00b Profile picker">
      <div>
        <ClaraLogo size="" />
      </div>

      <div className="fade-up">
        <h1 className="pp-greet">{greetCopy.hi}</h1>
        <p className="pp-sub">{greetCopy.sub}</p>
      </div>

      <div className="pp-grid fade-up fade-up-2">
        {CLARA_PROFILES.slice(0, 3).map(p => (
          <button key={p.id} className="pp-card" onClick={() => onPick(p)}>
            <div className="pp-avatar" style={avatarStyle(p)}>
              {p.initials}
              <span className="pp-flag">{flagFor(p.language)}</span>
            </div>
            <div>
              <div className="pp-relation">{p.relation}</div>
              <div className="pp-name">{p.name}</div>
              <div className="pp-letters">{p.letters} {lang === 'fr' ? 'lettres' : lang === 'ur' ? 'خطوط' : 'letters'}</div>
            </div>
          </button>
        ))}
        <button className="pp-card" onClick={() => alert('Add a new profile — coming soon')}>
          <div className="pp-avatar add">＋</div>
          <div>
            <div className="pp-relation">{lang === 'fr' ? 'Nouveau' : lang === 'ur' ? 'نیا' : 'New'}</div>
            <div className="pp-name">{lang === 'fr' ? 'Ajouter' : lang === 'ur' ? 'شامل کریں' : 'Add someone'}</div>
            <div className="pp-letters muted">{lang === 'fr' ? 'Parent, ami…' : lang === 'ur' ? 'گھر والا، دوست…' : 'A parent, friend…'}</div>
          </div>
        </button>
      </div>

      <div className="pp-foot fade-up fade-up-3">
        <span>
          {lang === 'fr' ? 'Vous êtes connecté en tant que' : lang === 'ur' ? 'آپ بطور لاگ ان' : 'Signed in as'}{' '}
          <Link href="/account">caregiver@email.com</Link>
        </span>
        <Link href="/" style={{ marginTop: 8, fontSize: 13, border: 0 }}>
          {lang === 'fr' ? 'Configurer un nouveau profil' : lang === 'ur' ? 'نیا پروفائل بنائیں' : 'Set up a new profile from scratch'} →
        </Link>
      </div>
    </div>
  );
}
