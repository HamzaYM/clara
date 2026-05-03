'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { LetterCard } from '@/components/LetterCard';
import { CLARA_LETTERS, UI_STRINGS, CLARA_GREETINGS } from '@/lib/content';
import { CLARA_PROFILES, useClaraTweaks } from '@/lib/tweaks';

const LOADING_LINES: Record<string, string[]> = {
  en: [
    "Clara is reading your letter carefully…",
    "Looking for the important parts…",
    "Finding any deadlines…",
    "Translating into plain words…",
    "Almost ready.",
  ],
  fr: [
    "Clara lit votre lettre attentivement…",
    "Repérage des points importants…",
    "Recherche des échéances…",
    "Traduction en mots simples…",
    "Presque prêt.",
  ],
  ur: [
    "کلارا آپ کا خط احتیاط سے پڑھ رہی ہے…",
    "اہم باتیں ڈھونڈ رہی ہے…",
    "آخری تاریخیں دیکھ رہی ہے…",
    "آسان الفاظ میں ترجمہ کر رہی ہے…",
    "تقریباً تیار۔",
  ],
};

export default function UploadPage() {
  const [t] = useClaraTweaks();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const greet = CLARA_GREETINGS[lang] || CLARA_GREETINGS.en;
  const activeProfile = CLARA_PROFILES.find(p => p.id === t.activeProfile) || { name: greet.you };

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLineIdx(i => i + 1), 1400);
    const done = setTimeout(() => {
      router.push('/letter/masshealth-renewal');
    }, 6500);
    return () => { clearInterval(id); clearTimeout(done); };
  }, [loading, router]);

  const startProcessing = () => { setLoading(true); setLineIdx(0); };

  const recent = CLARA_LETTERS.slice(0, 3);
  const lines = LOADING_LINES[lang] || LOADING_LINES.en;

  return (
    <>
      <TopNav active="home" lang={lang} />
      <main className="shell" data-screen-label="02 Upload">
        <section className="upload-hero fade-up">
          <h1 className="greeting">{greet.hi}, <em>{activeProfile.name}</em>.</h1>
          <p className="greeting-sub">
            {lang === 'fr' ? "Avez-vous reçu quelque chose ?" : lang === 'ur' ? "کیا آج کوئی خط آیا؟" : "Did anything come in the mail today?"}{' '}
            <Link href="/picker" style={{ color: 'var(--ink-faint)', textDecoration: 'none', fontSize: 14, marginLeft: 8, borderBottom: '1px solid var(--rule)' }}>
              {lang === 'fr' ? 'changer de profil' : lang === 'ur' ? 'پروفائل بدلیں' : 'switch profile'}
            </Link>
          </p>
        </section>

        {!loading && (
          <div
            className={"dropzone fade-up fade-up-2" + (drag ? " drag" : "")}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => { e.preventDefault(); setDrag(false); startProcessing(); }}
          >
            <div className="dropzone-icon"><Icon name="camera" size={40} stroke={1.4} /></div>
            <div>
              <h2>{ui.upload}</h2>
              <p style={{ marginTop: 8 }}>{ui.uploadHint}</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={startProcessing}>
              <Icon name="camera" size={18} /> {lang === 'fr' ? 'Prendre une photo' : lang === 'ur' ? 'تصویر لیں' : 'Take a photo'}
            </button>
            <span className="or">{lang === 'fr' ? 'ou glissez une image ici' : lang === 'ur' ? 'یا یہاں چھوڑ دیں' : 'or drag an image here'}</span>
          </div>
        )}

        {loading && (
          <div className="loading-state fade-up">
            {t.loading === 'rotating' && (
              <>
                <div className="loading-rotating">{lines[lineIdx % lines.length]}</div>
                <div className="loading-line"></div>
              </>
            )}
            {t.loading === 'single' && (
              <>
                <div className="loading-rotating" style={{ fontSize: 28 }}>
                  {lang === 'fr' ? 'Clara lit votre lettre…' : lang === 'ur' ? 'کلارا پڑھ رہی ہے…' : 'Clara is reading…'}
                </div>
                <div className="loading-line" style={{ marginTop: 24 }}></div>
              </>
            )}
            {t.loading === 'illus' && (
              <div className="loading-illus">
                <div className="pulse-circle">
                  <Icon name="envelope" size={44} stroke={1.4} />
                </div>
                <div className="loading-rotating" style={{ minHeight: 'auto', fontSize: 24 }}>
                  {lines[lineIdx % lines.length]}
                </div>
              </div>
            )}
          </div>
        )}

        {!loading && (
          <section className="recent-section fade-up fade-up-3">
            <div className="section-head">
              <h2>{ui.recent}</h2>
              <Link href="/profile" style={{ color: 'var(--ink-soft)', textDecoration: 'none', fontSize: 15 }}>
                {lang === 'fr' ? 'Tout voir' : lang === 'ur' ? 'سب دیکھیں' : 'See all'} →
              </Link>
            </div>
            <div className="recent-grid">
              {recent.map(l => <LetterCard key={l.id} letter={l} lang={lang} variant={t.card} />)}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
