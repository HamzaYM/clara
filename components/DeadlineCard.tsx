import { UI_STRINGS, daysUntil, type Letter } from '@/lib/content';

interface DeadlineCardProps {
  letter: Letter;
  lang?: string;
}

export function DeadlineCard({ letter, lang = 'en' }: DeadlineCardProps) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const days = daysUntil(letter.deadline);
  if (!letter.deadline || days === null) return null;
  const note = letter.deadlineNotes?.[lang] || letter.deadlineNotes?.en || '';

  return (
    <div className="deadline-card" data-level={letter.urgency}>
      <div className="dl-date-block">
        <div className="dl-month h-mono">{new Date(letter.deadline).toLocaleDateString('en-US', { month: 'short' })}</div>
        <div className="dl-day">{new Date(letter.deadline).getDate()}</div>
      </div>
      <div className="dl-body">
        <div className="dl-count">{ui.inDays(days)}</div>
        <div className="dl-note">{note}</div>
      </div>
      <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
    </div>
  );
}
