'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { LetterCard } from '@/components/LetterCard';
import { CLARA_GREETINGS, UI_STRINGS, type Letter as ContentLetter } from '@/lib/content';
import { CLARA_PROFILES, useClaraTweaks } from '@/lib/tweaks';
import { langCodeToName } from '@/lib/lang';
import type { Letter as DBLetter } from '@/types';

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

// File → base64 (without the "data:image/...;base64," prefix).
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const comma = result.indexOf(',');
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function dbToCardLetter(l: DBLetter): ContentLetter {
  const cat = (l.category ?? 'other').toLowerCase();
  const titled = cat === 'government' ? 'Government'
    : cat === 'health' ? 'Health'
    : cat === 'financial' ? 'Financial'
    : 'Other';
  return {
    id: l.id,
    sender: l.sender ?? '',
    type: l.letter_type ?? '',
    category: titled as ContentLetter['category'],
    received: l.created_at,
    deadline: null,
    urgency: (l.urgency as ContentLetter['urgency']) ?? 'low',
    summary: { en: l.summary_spoken ?? '' },
    actions: { en: [] },
    deadlineNotes: null,
    draft: null,
    reassure: { en: '' },
  };
}

const LANGUAGE_OPTIONS: Array<{ value: string; label: string }> = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'fr', label: 'Français' },
  { value: 'pt', label: 'Português' },
  { value: 'zh', label: '中文' },
  { value: 'ht', label: 'Kreyòl' },
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'ar', label: 'العربية' },
  { value: 'ur', label: 'اردو' },
];

export default function UploadPage() {
  const [t, setTweak] = useClaraTweaks();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [lineIdx, setLineIdx] = useState(0);
  const [drag, setDrag] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [recent, setRecent] = useState<ContentLetter[]>([]);
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const greet = CLARA_GREETINGS[lang] || CLARA_GREETINGS.en;
  const activeProfile = CLARA_PROFILES.find(p => p.id === t.activeProfile) || { name: greet.you };

  // On mount: require a user id.
  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('clara_user_id') : null;
    if (!id) {
      router.replace('/');
      return;
    }
    setUserId(id);
  }, [router]);

  // Fetch the user's recent letters once we have an id.
  useEffect(() => {
    if (!userId) return;
    fetch(`/api/users/${userId}/letters`)
      .then(r => r.ok ? r.json() : [])
      .then((rows: DBLetter[]) => setRecent(rows.slice(0, 3).map(dbToCardLetter)))
      .catch(() => setRecent([]));
  }, [userId]);

  // Loading-line ticker (only runs while we're processing).
  useEffect(() => {
    if (!loading) return;
    const id = setInterval(() => setLineIdx(i => i + 1), 1400);
    return () => clearInterval(id);
  }, [loading]);

  const processFile = async (file: File) => {
    if (!userId) return;
    setError(null);
    setLoading(true);
    setLineIdx(0);
    try {
      const image_base64 = await fileToBase64(file);
      const res = await fetch('/api/process-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          image_base64,
          language: langCodeToName(lang),
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Upload failed (${res.status})`);
      }
      const data = await res.json();
      router.push(`/letter/${data.letter_id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setLoading(false);
    }
  };

  const onPick = () => inputRef.current?.click();
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const lines = LOADING_LINES[lang] || LOADING_LINES.en;

  return (
    <>
      <TopNav active="home" lang={lang} />
      <main className="shell" data-screen-label="02 Upload">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onFileChange}
          style={{ display: 'none' }}
        />

        <section className="upload-hero fade-up">
          <h1 className="greeting">{greet.hi}, <em>{activeProfile.name}</em>.</h1>
          <p className="greeting-sub">
            {lang === 'fr' ? "Avez-vous reçu quelque chose ?" : lang === 'ur' ? "کیا آج کوئی خط آیا؟" : "Did anything come in the mail today?"}{' '}
            <Link href="/picker" style={{ color: 'var(--ink-faint)', textDecoration: 'none', fontSize: 14, marginLeft: 8, borderBottom: '1px solid var(--rule)' }}>
              {lang === 'fr' ? 'changer de profil' : lang === 'ur' ? 'پروفائل بدلیں' : 'switch profile'}
            </Link>
          </p>
          <div style={{ marginTop: 18, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span className="h-mono">{lang === 'fr' ? 'Langue' : lang === 'ur' ? 'زبان' : 'Read in'}</span>
            <select
              value={lang}
              onChange={(e) => {
                const next = e.target.value;
                try {
                  const raw = localStorage.getItem('clara-tweaks-v1');
                  const stored = raw ? JSON.parse(raw) : {};
                  stored.language = next;
                  localStorage.setItem('clara-tweaks-v1', JSON.stringify(stored));
                } catch {}
                setTweak('language', next);
              }}
              style={{
                appearance: 'none',
                background: 'var(--bg-elev)',
                border: '0.5px solid var(--rule-strong)',
                borderRadius: 8,
                padding: '8px 14px',
                font: 'inherit',
                fontSize: 15,
                color: 'var(--ink)',
              }}
            >
              {LANGUAGE_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </section>

        {!loading && (
          <div
            className={"dropzone fade-up fade-up-2" + (drag ? " drag" : "")}
            onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
            onDragLeave={() => setDrag(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDrag(false);
              const file = e.dataTransfer.files?.[0];
              if (file) processFile(file);
            }}
          >
            <div className="dropzone-icon"><Icon name="camera" size={40} stroke={1.4} /></div>
            <div>
              <h2>{ui.upload}</h2>
              <p style={{ marginTop: 8 }}>{ui.uploadHint}</p>
            </div>
            <button className="btn btn-primary btn-lg" onClick={onPick}>
              <Icon name="camera" size={18} /> {lang === 'fr' ? 'Prendre une photo' : lang === 'ur' ? 'تصویر لیں' : 'Take a photo'}
            </button>
            <span className="or">{lang === 'fr' ? 'ou glissez une image ici' : lang === 'ur' ? 'یا یہاں چھوڑ دیں' : 'or drag an image here'}</span>
            {error && <p style={{ marginTop: 12, color: '#B5634A', fontSize: 14 }}>{error}</p>}
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
            {recent.length === 0 ? (
              <p style={{ color: 'var(--ink-faint)', fontSize: 16, marginTop: 16 }}>{ui.noRecent}</p>
            ) : (
              <div className="recent-grid">
                {recent.map(l => <LetterCard key={l.id} letter={l} lang={lang} variant={t.card} />)}
              </div>
            )}
          </section>
        )}
      </main>
    </>
  );
}
