interface IconProps {
  name: string;
  size?: number;
  stroke?: number;
}

export function Icon({ name, size = 20, stroke = 1.6 }: IconProps) {
  const props = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: stroke,
    strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  };
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
