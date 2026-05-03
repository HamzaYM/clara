'use client';

import { useEffect, useState } from 'react';
import { Icon } from './Icon';
import { UI_STRINGS } from '@/lib/content';

interface AudioPlayerProps {
  summary: string;
  lang?: string;
  style?: 'ribbon' | 'big' | 'tape';
}

export function AudioPlayer({ lang = 'en', style = 'ribbon' }: AudioPlayerProps) {
  const [playing, setPlaying] = useState(true); // auto-plays per brief
  const [progress, setProgress] = useState(0.18);
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(p => p >= 1 ? 0 : p + 0.003);
    }, 60);
    return () => clearInterval(id);
  }, [playing]);

  const total = "1:42";
  const cur = `0:${String(Math.floor(progress * 102)).padStart(2, '0')}`;

  if (style === 'tape') {
    return (
      <div className="player tape">
        <button className="play-btn" onClick={() => setPlaying(p => !p)} aria-label={playing ? ui.pause : ui.listen}>
          <Icon name={playing ? 'pause' : 'play'} size={26} />
        </button>
        <div className="tape-body">
          <div className="tape-label h-mono">Clara · {ui.listen}</div>
          <div className="tape-reels">
            <div className={"reel" + (playing ? " spin" : "")} />
            <div className="tape-tracks">
              {[...Array(28)].map((_, i) => {
                const h = 20 + Math.sin(i * 0.7 + progress * 20) * 14 + Math.cos(i * 1.1) * 8;
                return (
                  <div key={i} className="track" style={{
                    height: `${h.toFixed(2)}px`,
                    opacity: i / 28 < progress ? 1 : 0.25,
                  }} />
                );
              })}
            </div>
            <div className={"reel" + (playing ? " spin" : "")} />
          </div>
          <div className="tape-time">
            <span>{cur}</span><span>{total}</span>
          </div>
        </div>
      </div>
    );
  }

  if (style === 'big') {
    return (
      <div className="player big">
        <button className="play-btn play-btn-xl" onClick={() => setPlaying(p => !p)} aria-label={playing ? ui.pause : ui.listen}>
          <Icon name={playing ? 'pause' : 'play'} size={34} />
        </button>
        <div className="big-body">
          <div className="h-mono">{ui.listen} · Clara</div>
          <div className="big-bar">
            <div className="big-bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <div className="big-time"><span>{cur}</span><span>{total}</span></div>
        </div>
      </div>
    );
  }

  // ribbon (default)
  return (
    <div className="player ribbon">
      <button className="play-btn" onClick={() => setPlaying(p => !p)} aria-label={playing ? ui.pause : ui.listen}>
        <Icon name={playing ? 'pause' : 'play'} size={26} />
      </button>
      <div className="ribbon-body">
        <div className="ribbon-label">
          <span className="h-mono">{ui.listen}</span>
          <span className="ribbon-time">{cur} / {total}</span>
        </div>
        <div className="ribbon-wave">
          {[...Array(56)].map((_, i) => {
            const h = 4 + Math.abs(Math.sin(i * 0.32)) * 18 + Math.cos(i * 0.7) * 6;
            const active = i / 56 < progress;
            return <span key={i} style={{
              height: `${Math.abs(h).toFixed(2)}px`,
              opacity: active ? 1 : 0.3,
              background: active ? 'var(--accent)' : 'var(--ink-soft)',
            }} />;
          })}
        </div>
      </div>
    </div>
  );
}
