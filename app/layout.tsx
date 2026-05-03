import type { Metadata } from "next";
import { Source_Serif_4, Inter_Tight, IBM_Plex_Mono, Caveat } from "next/font/google";
import "./globals.css";

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
});
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
});
const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});
const caveat = Caveat({
  variable: "--font-caveat",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "Clara",
  description: "A patient helper for the letters that matter.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-theme="light"
      data-density="standard"
      data-type="serif-grotesk"
      data-layout="stacked"
      data-player="ribbon"
      data-card="calm"
      data-urgency="dot"
      data-loading="rotating"
      data-background="cream"
      data-lang="en"
      className={`${sourceSerif.variable} ${interTight.variable} ${plexMono.variable} ${caveat.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
