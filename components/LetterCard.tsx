import Link from 'next/link';
import { Icon } from './Icon';
import { UI_STRINGS, daysUntil, formatDateShort, type Letter } from '@/lib/content';

interface LetterCardProps {
  letter: Letter;
  lang?: string;
  variant?: 'calm' | 'detailed' | 'minimal';
}

export function LetterCard({ letter, lang = 'en', variant = 'calm' }: LetterCardProps) {
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const days = daysUntil(letter.deadline);
  const summary = letter.summary[lang] || letter.summary.en;
  const senderShort = letter.sender;

  if (variant === 'minimal') {
    return (
      <Link href={`/letter/${letter.id}`} className="letter-card minimal">
        <div className="lc-row">
          <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
          <div className="lc-stack">
            <div className="lc-sender">{senderShort}</div>
            <div className="lc-type">{letter.type}</div>
          </div>
          <div className="lc-meta">
            {letter.deadline && days !== null && <span>{ui.inDays(days)}</span>}
          </div>
          <Icon name="chevron-r" size={18} />
        </div>
      </Link>
    );
  }

  if (variant === 'detailed') {
    return (
      <Link href={`/letter/${letter.id}`} className="letter-card detailed">
        <div className="lc-head">
          <div>
            <div className="h-mono">{senderShort} · {formatDateShort(letter.received, lang)}</div>
            <h3 className="lc-title">{letter.type}</h3>
          </div>
          <span className="urg" data-level={letter.urgency}>
            <span className="urg-dot" />
            {letter.urgency === 'high' ? 'Action needed' : letter.urgency === 'med' ? 'Soon' : 'Just FYI'}
          </span>
        </div>
        <p className="lc-summary">{summary}</p>
        {letter.deadline && days !== null && (
          <div className="lc-deadline">
            <Icon name="clock" size={16} />
            <span>{ui.deadline}: {formatDateShort(letter.deadline, lang)} · {ui.inDays(days)}</span>
          </div>
        )}
      </Link>
    );
  }

  // calm (default)
  return (
    <Link href={`/letter/${letter.id}`} className="letter-card calm">
      <div className="lc-row">
        <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
        <div className="lc-stack" style={{ flex: 1, minWidth: 0 }}>
          <div className="lc-sender h-mono">{senderShort}</div>
          <h3 className="lc-title">{letter.type}</h3>
        </div>
        {letter.deadline && days !== null ? (
          <div className="lc-meta">
            <div className="lc-meta-main">{formatDateShort(letter.deadline, lang)}</div>
            <div className="lc-meta-sub">{ui.inDays(days)}</div>
          </div>
        ) : (
          <div className="lc-meta lc-meta-quiet">{formatDateShort(letter.received, lang)}</div>
        )}
        <Icon name="chevron-r" size={18} />
      </div>
    </Link>
  );
}
