'use client';

import { use, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { AudioPlayer } from '@/components/AudioPlayer';
import { UI_STRINGS, formatDate, daysUntil } from '@/lib/content';
import { useClaraTweaks } from '@/lib/tweaks';
import { langCodeToName } from '@/lib/lang';
import type { Letter as DBLetter, Deadline, CategoryRecord, UniversalExtraction } from '@/types';

type LetterResponse = DBLetter & {
  deadlines: Deadline[];
  category_record: CategoryRecord | null;
};

export default function LetterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [t, , hydrated] = useClaraTweaks();
  const [draftOpen, setDraftOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [letter, setLetter] = useState<LetterResponse | null>(null);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const lang = t.language;
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  // Parse the universal extraction blob once.
  const extraction = useMemo<UniversalExtraction | null>(() => {
    if (!letter?.full_extraction) return null;
    try {
      return JSON.parse(letter.full_extraction) as UniversalExtraction;
    } catch {
      return null;
    }
  }, [letter]);

  // Fetch the letter.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/letters/${id}`)
      .then(r => {
        if (!r.ok) throw new Error(`Letter not found (${r.status})`);
        return r.json();
      })
      .then((data: LetterResponse) => { if (!cancelled) setLetter(data); })
      .catch(err => { if (!cancelled) setLoadError(err.message); });
    return () => { cancelled = true; };
  }, [id]);

  // Once the letter is loaded AND tweaks are hydrated, request TTS for the
  // spoken summary. The hydrated gate matters: without it, this effect runs
  // once with the default 'en' language and once with the stored language,
  // racing two ElevenLabs requests and frequently playing the wrong voice.
  useEffect(() => {
    if (!hydrated || !letter?.summary_spoken) return;
    let cancelled = false;
    let url: string | null = null;
    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: letter.summary_spoken,
        language: langCodeToName(lang),
      }),
    })
      .then(async r => {
        if (!r.ok) throw new Error('tts unavailable');
        return r.blob();
      })
      .then(blob => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setAudioSrc(url);
      })
      .catch(() => { /* AudioPlayer falls back to speechSynthesis */ });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
    };
  }, [hydrated, letter, lang]);

  const onCopy = () => {
    if (!extraction?.draft_response?.body) return;
    navigator.clipboard?.writeText(extraction.draft_response.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (loadError) {
    return (
      <>
        <TopNav active="home" lang={lang} />
        <main className="shell">
          <p style={{ color: '#B5634A' }}>{loadError}</p>
          <Link href="/upload" className="letter-back">
            <Icon name="arrow-l" size={18} /> {lang === 'fr' ? 'Retour' : lang === 'ur' ? 'واپس' : 'Back'}
          </Link>
        </main>
      </>
    );
  }

  if (!letter || !extraction) {
    return (
      <>
        <TopNav active="home" lang={lang} />
        <main className="shell" style={{ paddingTop: 80 }}>
          <p style={{ color: 'var(--ink-faint)', fontFamily: 'var(--font-display)', fontSize: 22 }}>
            {lang === 'fr' ? 'Chargement…' : lang === 'ur' ? 'لوڈ ہو رہا ہے…' : 'Loading…'}
          </p>
        </main>
      </>
    );
  }

  const summaryText = letter.summary_spoken ?? '';
  const actions = extraction.what_you_need_to_do ?? [];
  const reassureText = extraction.reassurance ?? '';
  const draft = extraction.draft_response?.needed ? extraction.draft_response.body : null;
  const urgency = (letter.urgency ?? 'low') as 'low' | 'med' | 'high';

  const summaryEl = (
    <section className="letter-section fade-up fade-up-2">
      <p className="letter-summary">{summaryText}</p>
    </section>
  );

  const playerEl = (
    <section className="fade-up fade-up-1">
      <AudioPlayer src={audioSrc} lang={lang} style={t.player} />
    </section>
  );

  const actionsEl = actions.length > 1 || (actions[0]?.length ?? 0) > 30 ? (
    <section className="letter-section fade-up fade-up-3">
      <div className="h-mono">{ui.needToDo}</div>
      <ol className="action-list">
        {actions.map((a, i) => <li key={i}>{a}</li>)}
      </ol>
    </section>
  ) : null;

  const deadlinesEl = letter.deadlines.length > 0 ? (
    <section className="letter-section fade-up fade-up-3">
      <div className="h-mono">{ui.deadlines}</div>
      {letter.deadlines.map(d => {
        const days = daysUntil(d.due_date);
        return (
          <div key={d.id} className="deadline-card" data-level={urgency} style={{ marginBottom: 12 }}>
            <div className="dl-date-block">
              <div className="dl-month h-mono">
                {d.due_date ? new Date(d.due_date).toLocaleDateString('en-US', { month: 'short' }) : ''}
              </div>
              <div className="dl-day">{d.due_date ? new Date(d.due_date).getDate() : ''}</div>
            </div>
            <div className="dl-body">
              <div className="dl-count">{days !== null ? ui.inDays(days) : ''}</div>
              <div className="dl-note">{d.what ?? ''}{d.consequence ? ` — ${d.consequence}` : ''}</div>
            </div>
            <span className="urg" data-level={urgency}><span className="urg-dot" /></span>
          </div>
        );
      })}
    </section>
  ) : null;

  const draftEl = draft ? (
    <section className="letter-section fade-up fade-up-4">
      <div className="draft-block">
        <button className="draft-head" onClick={() => setDraftOpen(o => !o)}>
          <h3>{ui.draft}</h3>
          <Icon name={draftOpen ? 'chevron-d' : 'chevron-r'} size={20} />
        </button>
        {draftOpen && (
          <div className="draft-body">
            <div className="draft-letter">{draft}</div>
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
            <h1>{letter.letter_type}</h1>
          </div>
          <div className="letter-meta">
            <span className="urg" data-level={urgency}>
              <span className="urg-dot" />
              {urgency === 'high'
                ? (lang === 'fr' ? 'Action requise' : lang === 'ur' ? 'فوری توجہ' : 'Action needed')
                : urgency === 'med'
                ? (lang === 'fr' ? 'Bientôt' : lang === 'ur' ? 'جلد' : 'Soon')
                : (lang === 'fr' ? 'Pour info' : lang === 'ur' ? 'صرف اطلاع' : 'Just FYI')}
            </span>
            <span className="muted">{ui.received} {formatDate(letter.created_at, lang)}</span>
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
              {deadlinesEl}
              {draftEl}
            </div>
          </div>
        ) : (
          <div className="letter-grid">
            {playerEl}
            {summaryEl}
            {actionsEl}
            {deadlinesEl}
            {draftEl}
          </div>
        )}

        {reassureText && (
          <div className="reassure fade-up fade-up-4">
            <div className="h-mono">{ui.reassure}</div>
            <p>&ldquo;{reassureText}&rdquo;</p>
          </div>
        )}
      </main>
    </>
  );
}
