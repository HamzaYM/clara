'use client';

import { TopNav } from '@/components/TopNav';
import { LetterCard } from '@/components/LetterCard';
import { CLARA_LETTERS, UI_STRINGS, type Category } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';

export default function ProfilePage() {
  const [t] = useClaraTweaks();
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  const categories: Category[] = ['Government', 'Health', 'Financial', 'Other'];
  const grouped = categories
    .map(c => ({
      name: c,
      label: ui.profile[c],
      letters: CLARA_LETTERS.filter(l => l.category === c),
    }))
    .filter(g => g.letters.length > 0);

  return (
    <>
      <TopNav active="profile" lang={lang} />
      <main className="shell" data-screen-label="04 Profile">
        <section className="profile-hero fade-up">
          <div className="h-mono" style={{ marginBottom: 12 }}>
            {lang === 'fr' ? 'Bonjour, Elena' : lang === 'ur' ? 'سلام، ایلینا' : 'Hello, Elena'}
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

        {grouped.map(g => (
          <section key={g.name} className="category-section fade-up">
            <div className="category-head">
              <h2>{g.label}</h2>
              <span className="category-count">{g.letters.length} {g.letters.length === 1 ? 'letter' : 'letters'}</span>
            </div>
            <div className="category-grid">
              {g.letters.map(l => <LetterCard key={l.id} letter={l} lang={lang} variant={t.card} />)}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
