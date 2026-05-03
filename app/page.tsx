'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ClaraLogo } from '@/components/ClaraLogo';
import { Icon } from '@/components/Icon';
import { useClaraTweaks } from '@/lib/tweaks';

export default function SetupPage() {
  const [, setTweak] = useClaraTweaks();
  const router = useRouter();
  const [name, setName] = useState('');
  const [language, setLanguage] = useState('en');
  const [email, setEmail] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTweak('language', language);
    router.push('/upload');
  };

  return (
    <div className="setup-page" data-screen-label="01 Setup">
      <div className="setup-left fade-up">
        <div className="setup-hero">
          <ClaraLogo size="lg" />
          <h1 className="h-display">A patient helper for the letters that matter.</h1>
          <p>Snap a photo of a confusing letter — government, medical, financial — and Clara explains it in your language, gently, with a calm voice and a draft reply ready to send.</p>
        </div>
        <div className="setup-illus">
          <div className="paper-stack">
            <div className="p1"></div>
            <div className="p2"></div>
            <div className="p3"></div>
          </div>
          <div style={{ paddingBottom: 24, color: 'var(--ink-faint)', fontSize: 15, fontStyle: 'italic', fontFamily: 'var(--font-display)', maxWidth: 240, lineHeight: 1.5 }}>
            &ldquo;It&rsquo;s the visual equivalent of a kind nurse sitting at the kitchen table.&rdquo;
          </div>
        </div>
      </div>

      <div className="setup-right fade-up fade-up-2">
        <form className="setup-form" onSubmit={onSubmit}>
          <div className="seal"><span className="seal-dot"></span><span>Let&rsquo;s get acquainted</span></div>
          <h2>Who are we helping?</h2>

          <div className="field">
            <label htmlFor="name">Your name</label>
            <input id="name" type="text" placeholder="Elena Rodriguez" value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="language">Preferred language</label>
            <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="zh">中文 (Mandarin)</option>
              <option value="pt">Português</option>
              <option value="ht">Kreyòl ayisyen</option>
              <option value="vi">Tiếng Việt</option>
              <option value="ar">العربية</option>
              <option value="fr">Français</option>
              <option value="ur">اردو</option>
            </select>
            <span className="field-hint">We&rsquo;ll explain every letter and read it aloud in this language.</span>
          </div>

          <div className="field">
            <label htmlFor="email">Caregiver email <span style={{ color: 'var(--ink-faint)', fontWeight: 400 }}>— optional</span></label>
            <input id="email" type="email" placeholder="daughter@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            <span className="field-hint">We&rsquo;ll send them a heads up when something important comes in. Nothing else.</span>
          </div>

          <button type="submit" className="btn btn-primary btn-lg" style={{ marginTop: 8, width: 'fit-content' }}>
            Get started <Icon name="arrow" size={18} />
          </button>
          <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-faint)' }}>No password needed. We&rsquo;ll keep things simple.</p>
        </form>
      </div>
    </div>
  );
}
