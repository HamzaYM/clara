'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { LetterCard } from '@/components/LetterCard';
import { UI_STRINGS, type Category, type Letter as ContentLetter } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';
import type { Letter as DBLetter, Deadline } from '@/types';

function dbToCardLetter(l: DBLetter, deadlinesForLetter: Deadline[]): ContentLetter {
  const cat = (l.category ?? 'other').toLowerCase();
  const titled = cat === 'government' ? 'Government'
    : cat === 'health' ? 'Health'
    : cat === 'financial' ? 'Financial'
    : 'Other';
  // Pick the earliest upcoming deadline for the card meta.
  const earliest = [...deadlinesForLetter]
    .filter(d => d.due_date)
    .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())[0];
  return {
    id: l.id,
    sender: l.sender ?? '',
    type: l.letter_type ?? '',
    category: titled as Category,
    received: l.created_at,
    deadline: earliest?.due_date ?? null,
    urgency: (l.urgency as ContentLetter['urgency']) ?? 'low',
    summary: { en: l.summary_spoken ?? '' },
    actions: { en: [] },
    deadlineNotes: null,
    draft: null,
    reassure: { en: '' },
  };
}

export default function ProfilePage() {
  const [t] = useClaraTweaks();
  const router = useRouter();
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  const [userId, setUserId] = useState<string | null>(null);
  const [letters, setLetters] = useState<ContentLetter[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const id = typeof window !== 'undefined' ? localStorage.getItem('clara_user_id') : null;
    if (!id) { router.replace('/'); return; }
    setUserId(id);
  }, [router]);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      fetch(`/api/users/${userId}/letters`).then(r => r.ok ? r.json() : []),
      fetch(`/api/users/${userId}/deadlines`).then(r => r.ok ? r.json() : []),
    ])
      .then(([rows, deadlineRows]: [DBLetter[], Deadline[]]) => {
        const byLetterId = new Map<string, Deadline[]>();
        for (const d of deadlineRows) {
          if (!d.letter_id) continue;
          const list = byLetterId.get(d.letter_id) ?? [];
          list.push(d);
          byLetterId.set(d.letter_id, list);
        }
        setLetters(rows.map(l => dbToCardLetter(l, byLetterId.get(l.id) ?? [])));
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [userId]);

  const categories: Category[] = ['Government', 'Health', 'Financial', 'Other'];
  const grouped = categories
    .map(c => ({
      name: c,
      label: ui.profile[c],
      letters: letters.filter(l => l.category === c),
    }))
    .filter(g => g.letters.length > 0);

  return (
    <>
      <TopNav active="profile" lang={lang} />
      <main className="shell" data-screen-label="04 Profile">
        <section className="profile-hero fade-up">
          <div className="h-mono" style={{ marginBottom: 12 }}>
            {lang === 'fr' ? 'Bonjour' : lang === 'ur' ? 'سلام' : 'Hello'}
          </div>
          <h1 className="h-display">{lang === 'fr' ? 'Vos lettres' : lang === 'ur' ? 'آپ کے خطوط' : 'Your letters'}</h1>
          <p>
            {lang === 'fr'
              ? 'Tout ce que nous avons reçu pour vous, organisé par catégorie.'
              : lang === 'ur'
              ? 'آپ کے سب خطوط، قسم کے حساب سے ترتیب میں۔'
              : "Everything we've received for you, sorted into a tidy filing cabinet."}
          </p>
        </section>

        {loaded && letters.length === 0 ? (
          <p style={{ color: 'var(--ink-faint)', marginTop: 32, fontSize: 17 }}>
            {ui.noRecent}
          </p>
        ) : (
          grouped.map(g => (
            <section key={g.name} className="category-section fade-up">
              <div className="category-head">
                <h2>{g.label}</h2>
                <span className="category-count">{g.letters.length} {g.letters.length === 1 ? 'letter' : 'letters'}</span>
              </div>
              <div className="category-grid">
                {g.letters.map(l => <LetterCard key={l.id} letter={l} lang={lang} variant={t.card} />)}
              </div>
            </section>
          ))
        )}
      </main>
    </>
  );
}
