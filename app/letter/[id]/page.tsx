'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { AudioPlayer } from '@/components/AudioPlayer';
import { DeadlineCard } from '@/components/DeadlineCard';
import { CLARA_LETTERS, UI_STRINGS, formatDate } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [t] = useClaraTweaks();
  const [draftOpen, setDraftOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;
  const letter = CLARA_LETTERS.find(l => l.id === id) || CLARA_LETTERS[0];

  const onCopy = () => {
    navigator.clipboard?.writeText(letter.draft || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const summaryText = letter.summary[lang] || letter.summary.en;
  const actions = letter.actions[lang] || letter.actions.en;
  const reassureText = letter.reassure[lang] || letter.reassure.en;

  const summaryEl = (
    <section className="letter-section fade-up fade-up-2">
      <p className="letter-summary">{summaryText}</p>
    </section>
  );

  const playerEl = (
    <section className="fade-up fade-up-1">
      <AudioPlayer summary={summaryText} lang={lang} style={t.player} />
    </section>
  );

  const actionsEl = actions.length > 1 || actions[0].length > 30 ? (
    <section className="letter-section fade-up fade-up-3">
      <div className="h-mono">{ui.needToDo}</div>
      <ol className="action-list">
        {actions.map((a, i) => <li key={i}>{a}</li>)}
      </ol>
    </section>
  ) : null;

  const deadlineEl = letter.deadline ? (
    <section className="letter-section fade-up fade-up-3">
      <div className="h-mono">{ui.deadlines}</div>
      <DeadlineCard letter={letter} lang={lang} />
    </section>
  ) : null;

  const draftEl = letter.draft ? (
    <section className="letter-section fade-up fade-up-4">
      <div className="draft-block">
        <button className="draft-head" onClick={() => setDraftOpen(o => !o)}>
          <h3>{ui.draft}</h3>
          <Icon name={draftOpen ? 'chevron-d' : 'chevron-r'} size={20} />
        </button>
        {draftOpen && (
          <div className="draft-body">
            <div className="draft-letter">{letter.draft}</div>
            <div className="draft-actions">
              <span className="draft-hint">{ui.draftHint}</span>
              <button className="btn btn-primary" onClick={onCopy}>
                <Icon name={copied ? 'check' : 'copy'} size={18} />
                {copied ? ui.copied : ui.copy}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  ) : null;

  return (
    <>
      <TopNav active="home" lang={lang} />
      <main className="letter-page-shell" data-screen-label="03 Letter">
        <Link href="/upload" className="letter-back">
          <Icon name="arrow-l" size={18} /> {lang === 'fr' ? 'Retour' : lang === 'ur' ? 'واپس' : 'Back'}
        </Link>

        <header className="letter-header fade-up">
          <div>
            <div className="h-mono">{ui.from} · {letter.sender}</div>
            <h1>{letter.type}</h1>
          </div>
          <div className="letter-meta">
            <span className="urg" data-level={letter.urgency}>
              <span className="urg-dot" />
              {letter.urgency === 'high'
                ? (lang === 'fr' ? 'Action requise' : lang === 'ur' ? 'فوری توجہ' : 'Action needed')
                : letter.urgency === 'med'
                ? (lang === 'fr' ? 'Bientôt' : lang === 'ur' ? 'جلد' : 'Soon')
                : (lang === 'fr' ? 'Pour info' : lang === 'ur' ? 'صرف اطلاع' : 'Just FYI')}
            </span>
            <span className="muted">{ui.received} {formatDate(letter.received, lang)}</span>
          </div>
        </header>

        {t.layout === 'split' ? (
          <div className="letter-grid">
            <div className="col-l">
              {playerEl}
              {summaryEl}
              {actionsEl}
            </div>
            <div className="col-r">
              {deadlineEl}
              {draftEl}
            </div>
          </div>
        ) : (
          <div className="letter-grid">
            {playerEl}
            {summaryEl}
            {actionsEl}
            {deadlineEl}
            {draftEl}
          </div>
        )}

        <div className="reassure fade-up fade-up-4">
          <div className="h-mono">{ui.reassure}</div>
          <p>&ldquo;{reassureText}&rdquo;</p>
        </div>
      </main>
    </>
  );
}
