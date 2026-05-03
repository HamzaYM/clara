'use client';

import { useEffect, useRef, useState } from 'react';
import { Icon } from './Icon';
import { UI_STRINGS } from '@/lib/content';

interface AudioPlayerProps {
  src?: string | null;        // blob URL from /api/tts
  fallbackText?: string;      // played via speechSynthesis if src is missing
  fallbackLang?: string;      // BCP-47 (e.g. 'es-ES')
  lang?: string;
  style?: 'ribbon' | 'big' | 'tape';
}

export function AudioPlayer({
  src,
  fallbackText,
  fallbackLang,
  lang = 'en',
  style = 'ribbon',
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState<number>(0);
  const ui = UI_STRINGS[lang] || UI_STRINGS.en;

  // Reset when src changes
  useEffect(() => {
    setProgress(0);
    setPlaying(false);
    setDuration(0);
  }, [src]);

  // Wire <audio> events
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onTimeUpdate = () => {
      if (a.duration > 0 && isFinite(a.duration)) {
        setProgress(a.currentTime / a.duration);
      }
    };
    const onLoadedMeta = () => {
      if (isFinite(a.duration)) setDuration(a.duration);
    };
    const onEnd = () => { setPlaying(false); setProgress(0); };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener('timeupdate', onTimeUpdate);
    a.addEventListener('loadedmetadata', onLoadedMeta);
    a.addEventListener('ended', onEnd);
    a.addEventListener('pause', onPause);
    a.addEventListener('play', onPlay);
    return () => {
      a.removeEventListener('timeupdate', onTimeUpdate);
      a.removeEventListener('loadedmetadata', onLoadedMeta);
      a.removeEventListener('ended', onEnd);
      a.removeEventListener('pause', onPause);
      a.removeEventListener('play', onPlay);
    };
  }, [src]);

  // Stop any speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggle = () => {
    const a = audioRef.current;
    if (src && a) {
      if (playing) {
        a.pause();
      } else {
        a.play().catch(() => setPlaying(false));
      }
      return;
    }
    // Fallback to speech synthesis
    if (typeof window !== 'undefined' && 'speechSynthesis' in window && fallbackText) {
      if (playing) {
        window.speechSynthesis.cancel();
        setPlaying(false);
        return;
      }
      const utter = new SpeechSynthesisUtterance(fallbackText);
      if (fallbackLang) utter.lang = fallbackLang;
      utter.onend = () => setPlaying(false);
      utter.onerror = () => setPlaying(false);
      window.speechSynthesis.speak(utter);
      setPlaying(true);
    }
  };

  const formatTime = (s: number) => {
    if (!s || !isFinite(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${String(sec).padStart(2, '0')}`;
  };
  const total = duration ? formatTime(duration) : '–:––';
  const cur = duration ? formatTime(progress * duration) : '0:00';

  const audioEl = src ? (
    <audio ref={audioRef} src={src} preload="auto" style={{ display: 'none' }} />
  ) : null;

  if (style === 'tape') {
    return (
      <div className="player tape">
        {audioEl}
        <button className="play-btn" onClick={toggle} aria-label={playing ? ui.pause : ui.listen}>
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
        {audioEl}
        <button className="play-btn play-btn-xl" onClick={toggle} aria-label={playing ? ui.pause : ui.listen}>
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
      {audioEl}
      <button className="play-btn" onClick={toggle} aria-label={playing ? ui.pause : ui.listen}>
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
