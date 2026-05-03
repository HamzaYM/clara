'use client';

import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { CLARA_LETTERS, UI_STRINGS, daysUntil } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';

export default function RemindersPage() {
  const [t] = useClaraTweaks();
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  const upcoming = CLARA_LETTERS
    .filter(l => l.deadline)
    .sort((a, b) => new Date(a.deadline as string).getTime() - new Date(b.deadline as string).getTime());

  const monthName = (d: string) =>
    new Date(d).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-US', { month: 'short' }).toUpperCase();

  return (
    <>
      <TopNav active="reminders" lang={lang} />
      <main className="shell" data-screen-label="05 Reminders">
        <section className="profile-hero fade-up">
          <div className="h-mono" style={{ marginBottom: 12 }}>{ui.upcoming}</div>
          <h1 className="h-display">{lang === 'fr' ? 'Rappels' : lang === 'ur' ? 'یاد دہانیاں' : 'Reminders'}</h1>
          <p>
            {lang === 'fr'
              ? "Trois choses à venir. Pas de panique — nous vous guiderons à chaque étape."
              : lang === 'ur'
              ? "تین چیزیں آنے والی ہیں۔ گھبرائیں نہیں — ہم ہر قدم پر ساتھ ہیں۔"
              : "Three things coming up. Take them one at a time — we'll walk through each."}
          </p>
        </section>

        {upcoming.length === 0 ? (
          <div className="empty-state fade-up">
            <span className="leaf"><Icon name="leaf" size={26} stroke={1.4} /></span>
            <h2>{ui.noUrgent}</h2>
            <p>{lang === 'fr' ? "Profitez de votre journée." : lang === 'ur' ? "آج کا دن خوشی سے گزاریں۔" : "Enjoy your day."}</p>
          </div>
        ) : (
          <section className="reminders-list fade-up fade-up-2" style={{ marginTop: 32 }}>
            {upcoming.map(l => {
              const days = daysUntil(l.deadline);
              const dateStr = l.deadline as string;
              return (
                <Link key={l.id} className="reminder-row" href={`/letter/${l.id}`}>
                  <div className="reminder-date">
                    <div className="day">{new Date(dateStr).getDate()}</div>
                    <div className="when">{monthName(dateStr)} · {days !== null ? ui.inDays(days) : ''}</div>
                  </div>
                  <div className="reminder-body">
                    <h3>{l.type}</h3>
                    <span className="src">{ui.from} {l.sender}</span>
                    <span className="urg" data-level={l.urgency} style={{ marginTop: 6 }}>
                      <span className="urg-dot" />
                      {l.urgency === 'high'
                        ? (lang === 'fr' ? 'Action requise' : lang === 'ur' ? 'فوری' : 'Action needed')
                        : l.urgency === 'med'
                        ? (lang === 'fr' ? 'Bientôt' : lang === 'ur' ? 'جلد' : 'Soon')
                        : (lang === 'fr' ? 'Pour info' : lang === 'ur' ? 'اطلاع' : 'FYI')}
                    </span>
                  </div>
                  <div className="reminder-action">
                    <span style={{ fontSize: 15 }}>{lang === 'fr' ? 'Voir la réponse' : lang === 'ur' ? 'جواب دیکھیں' : 'See draft reply'}</span>
                    <Icon name="arrow" size={18} />
                  </div>
                </Link>
              );
            })}
          </section>
        )}
      </main>
    </>
  );
}
