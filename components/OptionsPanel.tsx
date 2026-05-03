'use client';

// Floating bottom-left "Options" panel — design-environment debug surface.
// Click the FAB or press "O" to open, Esc to close, drag header to move.
// All state lives in useClaraTweaks (localStorage-backed).

import { useCallback, useEffect, useRef, useState } from 'react';
import { useClaraTweaks, type Tweaks } from '@/lib/tweaks';

const OPTIONS_STYLE = `
  .opt-fab{position:fixed;left:20px;bottom:20px;z-index:2147483645;
    appearance:none;border:0;cursor:pointer;
    display:inline-flex;align-items:center;gap:8px;
    padding:12px 18px;border-radius:999px;
    background:rgba(42,38,34,.92);color:#FBF7EF;
    font:500 14px/1 ui-sans-serif,system-ui,-apple-system,sans-serif;
    letter-spacing:0.01em;
    box-shadow:0 6px 20px rgba(0,0,0,.18),0 1px 0 rgba(255,255,255,.06) inset;
    -webkit-backdrop-filter:blur(12px);backdrop-filter:blur(12px);
    transition:transform .12s ease,box-shadow .12s ease}
  .opt-fab:hover{transform:translateY(-1px);box-shadow:0 10px 28px rgba(0,0,0,.24)}
  .opt-fab svg{flex-shrink:0;opacity:.85}

  .opt-panel{position:fixed;left:20px;bottom:20px;z-index:2147483646;width:300px;
    max-height:calc(100vh - 40px);display:flex;flex-direction:column;
    background:rgba(250,249,247,.86);color:#29261b;
    -webkit-backdrop-filter:blur(28px) saturate(160%);backdrop-filter:blur(28px) saturate(160%);
    border:.5px solid rgba(255,255,255,.7);border-radius:16px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 16px 48px rgba(0,0,0,.22);
    font:12px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden;
    animation:opt-in .18s cubic-bezier(.2,.8,.3,1)}
  @keyframes opt-in{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
  .opt-hd{display:flex;align-items:center;justify-content:space-between;
    padding:12px 10px 12px 16px;cursor:move;user-select:none;
    border-bottom:.5px solid rgba(0,0,0,.06)}
  .opt-hd b{font-size:13px;font-weight:600;letter-spacing:.01em}
  .opt-hd .opt-hint{font-size:10px;font-weight:500;letter-spacing:.06em;
    text-transform:uppercase;color:rgba(41,38,27,.4);margin-left:8px}
  .opt-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:26px;height:26px;border-radius:7px;cursor:pointer;font-size:14px;line-height:1}
  .opt-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .opt-body{padding:4px 16px 16px;display:flex;flex-direction:column;gap:11px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .opt-body::-webkit-scrollbar{width:8px}
  .opt-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .opt-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}

  .opt-row{display:flex;flex-direction:column;gap:5px}
  .opt-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .opt-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .opt-lbl>span:first-child{font-weight:500}
  .opt-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .opt-sect{font-size:10px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:12px 0 2px}
  .opt-sect:first-child{padding-top:2px}

  .opt-field{appearance:none;width:100%;height:28px;padding:0 10px;
    border:.5px solid rgba(0,0,0,.1);border-radius:8px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .opt-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.opt-field{padding-right:24px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 10px center}

  .opt-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .opt-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:pointer}
  .opt-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:pointer}

  .opt-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .opt-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.92);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .opt-seg.dragging .opt-seg-thumb{transition:none}
  .opt-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:24px;
    border-radius:6px;cursor:pointer;padding:5px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .opt-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:pointer;padding:0}
  .opt-toggle[data-on="1"]{background:#7A8B6F}
  .opt-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .opt-toggle[data-on="1"] i{transform:translateX(14px)}
`;

type Option<V extends string | number> = V | { value: V; label: string };

interface PanelChromeProps {
  title?: string;
  children: React.ReactNode;
}

function PanelChrome({ title = 'Options', children }: PanelChromeProps) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement | null>(null);
  const offsetRef = useRef({ x: 20, y: 20 });
  const PAD = 16;

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    const maxLeft = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxLeft, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.left = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    const onResize = () => clampToViewport();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open, clampToViewport]);

  // Keyboard: 'o' toggles, Esc closes
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
      if ((e.key === 'o' || e.key === 'O') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName ?? '';
        if (tag === 'INPUT' || tag === 'TEXTAREA' || target?.isContentEditable) return;
        setOpen(v => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    const startLeft = r.left;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startLeft + (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };

  return (
    <>
      <style>{OPTIONS_STYLE}</style>
      {!open && (
        <button className="opt-fab" onClick={() => setOpen(true)} aria-label="Open options">
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          {title}
        </button>
      )}
      {open && (
        <div
          ref={dragRef}
          className="opt-panel"
          style={{ left: offsetRef.current.x, bottom: offsetRef.current.y }}
        >
          <div className="opt-hd" onMouseDown={onDragStart}>
            <div style={{ display: 'flex', alignItems: 'baseline' }}>
              <b>{title}</b>
              <span className="opt-hint">demo</span>
            </div>
            <button
              className="opt-x"
              aria-label="Close options"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
          </div>
          <div className="opt-body">{children}</div>
        </div>
      )}
    </>
  );
}

function OptSection({ label }: { label: string }) {
  return <div className="opt-sect">{label}</div>;
}

interface OptRowProps {
  label: string;
  value?: string | number;
  inline?: boolean;
  children?: React.ReactNode;
}

function OptRow({ label, value, children, inline = false }: OptRowProps) {
  return (
    <div className={inline ? 'opt-row opt-row-h' : 'opt-row'}>
      <div className="opt-lbl">
        <span>{label}</span>
        {value != null && <span className="opt-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

interface OptSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}

function OptSlider({ label, value, min = 0, max = 100, step = 1, unit = '', onChange }: OptSliderProps) {
  return (
    <OptRow label={label} value={`${value}${unit}`}>
      <input
        type="range"
        className="opt-slider"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </OptRow>
  );
}

interface OptToggleProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function OptToggle({ label, value, onChange }: OptToggleProps) {
  return (
    <div className="opt-row opt-row-h">
      <div className="opt-lbl"><span>{label}</span></div>
      <button
        type="button"
        className="opt-toggle"
        data-on={value ? '1' : '0'}
        role="switch"
        aria-checked={!!value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  );
}

interface OptRadioProps<V extends string> {
  label: string;
  value: V;
  options: Option<V>[];
  onChange: (v: V) => void;
}

function OptRadio<V extends string>({ label, value, options, onChange }: OptRadioProps<V>) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const opts = options.map((o) => (typeof o === 'object' ? o : { value: o, label: String(o) }));
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const valueRef = useRef(value);
  valueRef.current = value;

  const segAt = (clientX: number): V => {
    const r = trackRef.current!.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor(((clientX - r.left - 2) / inner) * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };

  const onPointerDown = (e: React.PointerEvent) => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev: PointerEvent) => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };

  return (
    <OptRow label={label}>
      <div
        ref={trackRef}
        role="radiogroup"
        onPointerDown={onPointerDown}
        className={dragging ? 'opt-seg dragging' : 'opt-seg'}
      >
        <div
          className="opt-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {opts.map((o) => (
          <button key={String(o.value)} type="button" role="radio" aria-checked={o.value === value}>
            {o.label}
          </button>
        ))}
      </div>
    </OptRow>
  );
}

interface OptSelectProps<V extends string> {
  label: string;
  value: V;
  options: Option<V>[];
  onChange: (v: V) => void;
}

function OptSelect<V extends string>({ label, value, options, onChange }: OptSelectProps<V>) {
  return (
    <OptRow label={label}>
      <select
        className="opt-field"
        value={value}
        onChange={(e) => onChange(e.target.value as V)}
      >
        {options.map((o) => {
          const v = typeof o === 'object' ? o.value : o;
          const l = typeof o === 'object' ? o.label : String(o);
          return <option key={String(v)} value={v}>{l}</option>;
        })}
      </select>
    </OptRow>
  );
}

// ── Public — drop into root layout ───────────────────────────────────────────
export function OptionsPanel() {
  const [t, setTweak] = useClaraTweaks();
  const set = <K extends keyof Tweaks>(key: K) => (v: Tweaks[K]) => setTweak(key, v);

  return (
    <PanelChrome title="Options">
      <OptSection label="Theme" />
      <OptRadio
        label="Accent"
        value={t.accent}
        options={[
          { value: 'sage', label: 'Sage' },
          { value: 'terracotta', label: 'Terra' },
          { value: 'amber', label: 'Amber' },
          { value: 'walnut', label: 'Walnut' },
        ]}
        onChange={set('accent')}
      />
      <OptSelect
        label="Background"
        value={t.background}
        options={[
          { value: 'cream',     label: 'Cream (warm)' },
          { value: 'ivory',     label: 'Ivory' },
          { value: 'offwhite',  label: 'Off-white (neutral)' },
          { value: 'linen',     label: 'Linen' },
          { value: 'parchment', label: 'Parchment' },
        ]}
        onChange={set('background')}
      />
      <OptToggle label="Warm dark mode" value={t.dark} onChange={set('dark')} />
      <OptToggle label="Paper grain" value={t.paperGrain} onChange={set('paperGrain')} />

      <OptSection label="Type" />
      <OptSelect
        label="Pairing"
        value={t.type}
        options={[
          { value: 'serif-grotesk', label: 'Source Serif + Inter Tight' },
          { value: 'news-dm', label: 'Newsreader + DM Sans' },
          { value: 'all-serif', label: 'Fraunces + Source Serif (editorial)' },
        ]}
        onChange={set('type')}
      />
      <OptSlider
        label="Body size"
        value={t.fontSize}
        min={18}
        max={26}
        step={2}
        unit="px"
        onChange={set('fontSize')}
      />

      <OptSection label="Density" />
      <OptRadio
        label="Spacing"
        value={t.density}
        options={['airy', 'standard', 'compact']}
        onChange={set('density')}
      />

      <OptSection label="Letter view" />
      <OptRadio
        label="Layout"
        value={t.layout}
        options={[
          { value: 'stacked', label: 'Stacked' },
          { value: 'split', label: 'Split' },
          { value: 'story', label: 'Story' },
        ]}
        onChange={set('layout')}
      />
      <OptRadio
        label="Audio player"
        value={t.player}
        options={[
          { value: 'ribbon', label: 'Ribbon' },
          { value: 'big', label: 'Big' },
          { value: 'tape', label: 'Tape' },
        ]}
        onChange={set('player')}
      />

      <OptSection label="Cards & urgency" />
      <OptRadio
        label="Letter card"
        value={t.card}
        options={[
          { value: 'calm', label: 'Calm' },
          { value: 'detailed', label: 'Detail' },
          { value: 'minimal', label: 'Minimal' },
        ]}
        onChange={set('card')}
      />
      <OptRadio
        label="Urgency"
        value={t.urgency}
        options={[
          { value: 'dot', label: 'Dot' },
          { value: 'bar', label: 'Bar' },
          { value: 'badge', label: 'Badge' },
        ]}
        onChange={set('urgency')}
      />

      <OptSection label="Loading state" />
      <OptRadio
        label="Style"
        value={t.loading}
        options={[
          { value: 'rotating', label: 'Lines' },
          { value: 'single', label: 'One' },
          { value: 'illus', label: 'Visual' },
        ]}
        onChange={set('loading')}
      />

      <OptSection label="Language (demo)" />
      <OptSelect
        label="Read in"
        value={t.language}
        options={[
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Español' },
          { value: 'fr', label: 'Français' },
          { value: 'pt', label: 'Português' },
          { value: 'zh', label: '中文 (Mandarin)' },
          { value: 'ht', label: 'Kreyòl ayisyen' },
          { value: 'vi', label: 'Tiếng Việt' },
          { value: 'ar', label: 'العربية' },
          { value: 'ur', label: 'اردو' },
        ]}
        onChange={set('language')}
      />
    </PanelChrome>
  );
}
