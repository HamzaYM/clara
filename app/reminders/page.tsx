'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { UI_STRINGS, daysUntil } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';
import type { Letter as DBLetter, Deadline } from '@/types';

interface ReminderRow {
  id: string;
  letter_id: string;
  due_date: string;
  letter_type: string;
  sender: string;
  urgency: 'low' | 'med' | 'high';
}

export default function RemindersPage() {
  const [t] = useClaraTweaks();
  const router = useRouter();
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  const [userId, setUserId] = useState<string | null>(null);
  const [rows, setRows] = useState<ReminderRow[]>([]);
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
      .then(([letters, deadlines]: [DBLetter[], Deadline[]]) => {
        const byId = new Map(letters.map(l => [l.id, l]));
        const joined: ReminderRow[] = deadlines
          .filter(d => d.due_date && d.letter_id)
          .map(d => {
            const l = byId.get(d.letter_id!);
            return {
              id: d.id,
              letter_id: d.letter_id!,
              due_date: d.due_date!,
              letter_type: l?.letter_type ?? d.what ?? '',
              sender: l?.sender ?? '',
              urgency: (l?.urgency as ReminderRow['urgency']) ?? 'low',
            };
          })
          .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime());
        setRows(joined);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, [userId]);

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
              ? "Pas de panique — nous vous guiderons à chaque étape."
              : lang === 'ur'
              ? "گھبرائیں نہیں — ہم ہر قدم پر ساتھ ہیں۔"
              : "Take them one at a time — we'll walk through each."}
          </p>
        </section>

        {loaded && rows.length === 0 ? (
          <div className="empty-state fade-up">
            <span className="leaf"><Icon name="leaf" size={26} stroke={1.4} /></span>
            <h2>{ui.noUrgent}</h2>
            <p>{lang === 'fr' ? "Profitez de votre journée." : lang === 'ur' ? "آج کا دن خوشی سے گزاریں۔" : "Enjoy your day."}</p>
          </div>
        ) : (
          <section className="reminders-list fade-up fade-up-2" style={{ marginTop: 32 }}>
            {rows.map(r => {
              const days = daysUntil(r.due_date);
              return (
                <Link key={r.id} className="reminder-row" href={`/letter/${r.letter_id}`}>
                  <div className="reminder-date">
                    <div className="day">{new Date(r.due_date).getDate()}</div>
                    <div className="when">{monthName(r.due_date)} · {days !== null ? ui.inDays(days) : ''}</div>
                  </div>
                  <div className="reminder-body">
                    <h3>{r.letter_type}</h3>
                    <span className="src">{ui.from} {r.sender}</span>
                    <span className="urg" data-level={r.urgency} style={{ marginTop: 6 }}>
                      <span className="urg-dot" />
                      {r.urgency === 'high'
                        ? (lang === 'fr' ? 'Action requise' : lang === 'ur' ? 'فوری' : 'Action needed')
                        : r.urgency === 'med'
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
