// Clara — shared UI fragments used across pages

function Icon({ name, size = 20, stroke = 1.6 }) {
  const props = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: stroke, strokeLinecap: "round", strokeLinejoin: "round" };
  switch (name) {
    case 'play':     return <svg {...props}><polygon points="6 4 20 12 6 20 6 4" fill="currentColor" stroke="none" /></svg>;
    case 'pause':    return <svg {...props}><rect x="6" y="4" width="4" height="16" fill="currentColor" stroke="none" /><rect x="14" y="4" width="4" height="16" fill="currentColor" stroke="none" /></svg>;
    case 'camera':   return <svg {...props}><path d="M3 7h3l2-3h8l2 3h3v13H3z" /><circle cx="12" cy="13" r="4" /></svg>;
    case 'upload':   return <svg {...props}><path d="M12 16V4M6 10l6-6 6 6M4 20h16" /></svg>;
    case 'arrow':    return <svg {...props}><path d="M5 12h14M13 6l6 6-6 6" /></svg>;
    case 'arrow-l':  return <svg {...props}><path d="M19 12H5M11 6l-6 6 6 6" /></svg>;
    case 'check':    return <svg {...props}><path d="M5 12l5 5L20 7" /></svg>;
    case 'copy':     return <svg {...props}><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" /></svg>;
    case 'clock':    return <svg {...props}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case 'cal':      return <svg {...props}><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
    case 'envelope': return <svg {...props}><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 8l9 6 9-6" /></svg>;
    case 'leaf':     return <svg {...props}><path d="M5 19c0-9 6-15 15-15 0 9-6 15-15 15z" /><path d="M5 19l9-9" /></svg>;
    case 'plus':     return <svg {...props}><path d="M12 5v14M5 12h14" /></svg>;
    case 'chevron-r': return <svg {...props}><path d="M9 6l6 6-6 6" /></svg>;
    case 'chevron-d': return <svg {...props}><path d="M6 9l6 6 6-6" /></svg>;
    case 'wave':     return <svg {...props}><path d="M3 12c2 0 2-4 4-4s2 8 4 8 2-12 4-12 2 8 4 8 2-4 2-4" /></svg>;
    case 'doc':      return <svg {...props}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4" /></svg>;
    default: return null;
  }
}

function ClaraLogo({ size = 'lg' }) {
  return (
    <a href="index.html" className={`wordmark ${size === 'xl' ? 'wordmark-xl' : size === 'lg' ? 'wordmark-lg' : ''}`} style={{textDecoration:'none'}}>
      Clara
    </a>
  );
}

function TopNav({ active, lang = 'en' }) {
  const ui = UI_STRINGS[lang];
  // Pull active profile to display tiny avatar in nav
  let avatar = null;
  try {
    const stored = JSON.parse(localStorage.getItem('clara-tweaks-v1') || '{}');
    const id = stored.activeProfile || 'elena';
    const p = (window.CLARA_PROFILES || []).find(x => x.id === id);
    if (p) {
      const pal = (window.ACCENT_PALETTES || {})[p.accent] || {soft:'#DDE3D5', ink:'#4A5A40'};
      avatar = (
        <a href="account.html" title={p.name} style={{display:'inline-flex',alignItems:'center',gap:8,textDecoration:'none',marginLeft:18,padding:'6px 14px 6px 6px',borderRadius:999,background:'var(--bg-elev)',border:'0.5px solid var(--rule)',color:'var(--ink)'}}>
          <span style={{width:28,height:28,borderRadius:'50%',background:pal.soft,color:pal.ink,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'var(--font-display)',fontWeight:500,fontSize:15}}>{p.initials}</span>
          <span style={{fontSize:14}}>{p.name}</span>
        </a>
      );
    }
  } catch(e) {}
  return (
    <header className="topnav">
      <ClaraLogo size="" />
      <nav className="nav-links">
        <a href="upload.html" className={active === 'home' ? 'active' : ''}>{ui.nav.home}</a>
        <a href="profile.html" className={active === 'profile' ? 'active' : ''}>{ui.nav.profile}</a>
        <a href="reminders.html" className={active === 'reminders' ? 'active' : ''}>{ui.nav.reminders}</a>
        <a href="account.html" className={active === 'account' ? 'active' : ''}>{ui.nav.account}</a>
        {avatar}
      </nav>
    </header>
  );
}

// Letter card — three variants via tweak.card
function LetterCard({ letter, lang = 'en', variant = 'calm' }) {
  const ui = UI_STRINGS[lang];
  const days = daysUntil(letter.deadline);
  const summary = letter.summary[lang];
  const senderShort = letter.sender;

  if (variant === 'minimal') {
    return (
      <a href={`letter.html?id=${letter.id}`} className="letter-card minimal">
        <div className="lc-row">
          <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
          <div className="lc-stack">
            <div className="lc-sender">{senderShort}</div>
            <div className="lc-type">{letter.type}</div>
          </div>
          <div className="lc-meta">
            {letter.deadline && <span>{ui.inDays(days)}</span>}
          </div>
          <Icon name="chevron-r" size={18} />
        </div>
      </a>
    );
  }

  if (variant === 'detailed') {
    return (
      <a href={`letter.html?id=${letter.id}`} className="letter-card detailed">
        <div className="lc-head">
          <div>
            <div className="h-mono">{senderShort} · {formatDateShort(letter.received, lang)}</div>
            <h3 className="lc-title">{letter.type}</h3>
          </div>
          <span className="urg" data-level={letter.urgency}><span className="urg-dot" />{letter.urgency === 'high' ? 'Action needed' : letter.urgency === 'med' ? 'Soon' : 'Just FYI'}</span>
        </div>
        <p className="lc-summary">{summary}</p>
        {letter.deadline && (
          <div className="lc-deadline">
            <Icon name="clock" size={16} />
            <span>{ui.deadline}: {formatDateShort(letter.deadline, lang)} · {ui.inDays(days)}</span>
          </div>
        )}
      </a>
    );
  }

  // calm (default)
  return (
    <a href={`letter.html?id=${letter.id}`} className="letter-card calm">
      <div className="lc-row">
        <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
        <div className="lc-stack" style={{flex:1, minWidth:0}}>
          <div className="lc-sender h-mono">{senderShort}</div>
          <h3 className="lc-title">{letter.type}</h3>
        </div>
        {letter.deadline ? (
          <div className="lc-meta">
            <div className="lc-meta-main">{formatDateShort(letter.deadline, lang)}</div>
            <div className="lc-meta-sub">{ui.inDays(days)}</div>
          </div>
        ) : (
          <div className="lc-meta lc-meta-quiet">{formatDateShort(letter.received, lang)}</div>
        )}
        <Icon name="chevron-r" size={18} />
      </div>
    </a>
  );
}

// Audio player — three styles
function AudioPlayer({ summary, lang = 'en', style = 'ribbon' }) {
  const [playing, setPlaying] = React.useState(true); // auto-plays per brief
  const [progress, setProgress] = React.useState(0.18);
  const ui = UI_STRINGS[lang];

  React.useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => {
      setProgress(p => p >= 1 ? 0 : p + 0.003);
    }, 60);
    return () => clearInterval(id);
  }, [playing]);

  const total = "1:42";
  const cur = `0:${String(Math.floor(progress * 102)).padStart(2,'0')}`;

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
              {[...Array(28)].map((_, i) => (
                <div key={i} className="track" style={{height: `${20 + Math.sin(i*0.7 + progress*20) * 14 + Math.cos(i*1.1) * 8}px`, opacity: i / 28 < progress ? 1 : 0.25}} />
              ))}
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
            <div className="big-bar-fill" style={{width: `${progress*100}%`}} />
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
            return <span key={i} style={{height: Math.abs(h), opacity: active ? 1 : 0.3, background: active ? 'var(--accent)' : 'var(--ink-soft)'}} />;
          })}
        </div>
      </div>
    </div>
  );
}

// Deadline countdown card
function DeadlineCard({ letter, lang = 'en' }) {
  const ui = UI_STRINGS[lang];
  const days = daysUntil(letter.deadline);
  return (
    <div className="deadline-card" data-level={letter.urgency}>
      <div className="dl-date-block">
        <div className="dl-month h-mono">{new Date(letter.deadline).toLocaleDateString('en-US',{month:'short'})}</div>
        <div className="dl-day">{new Date(letter.deadline).getDate()}</div>
      </div>
      <div className="dl-body">
        <div className="dl-count">{ui.inDays(days)}</div>
        <div className="dl-note">{letter.deadlineNotes[lang]}</div>
      </div>
      <span className="urg" data-level={letter.urgency}><span className="urg-dot" /></span>
    </div>
  );
}

Object.assign(window, { Icon, ClaraLogo, TopNav, LetterCard, AudioPlayer, DeadlineCard });
