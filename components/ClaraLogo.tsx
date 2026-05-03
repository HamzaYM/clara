import Link from 'next/link';

interface ClaraLogoProps {
  size?: 'lg' | 'xl' | '';
}

// Logo links to /upload (the home for returning users). The original design
// pointed to index.html (the canvas overview), which doesn't exist in the app.
export function ClaraLogo({ size = 'lg' }: ClaraLogoProps) {
  const cls = `wordmark ${size === 'xl' ? 'wordmark-xl' : size === 'lg' ? 'wordmark-lg' : ''}`;
  return (
    <Link href="/upload" className={cls} style={{ textDecoration: 'none' }}>
      Clara
    </Link>
  );
}
