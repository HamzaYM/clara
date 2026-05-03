'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { TopNav } from '@/components/TopNav';
import { Icon } from '@/components/Icon';
import { ACCENT_PALETTES, CLARA_PROFILES, useClaraTweaks, type Profile } from '@/lib/tweaks';

const T9N: Record<string, Record<string, string>> = {
  en: {
    title: "Account",
    sub: "Settings, who you're helping, and how Clara reaches out.",
    person: "About this person",
    name: "Name", lang: "Preferred language", relation: "Relationship", caregiver: "Set up by",
    changeAv: "Change picture",
    reading: "Reading aloud",
    readingHint: "How Clara sounds when she reads letters back to you.",
    autoplay: "Auto-play when a letter opens", autoplayHint: "Starts reading the moment you arrive on the page.",
    voice: "Clara's voice", voiceHint: "We've picked the warmest one. You can preview others.",
    speed: "Reading speed", speedHint: "Slower can be easier to follow.",
    preview: "Preview",
    caregivers: "Caregivers",
    caregiversHint: "People who get a heads up when something important comes in.",
    addCare: "Add a caregiver",
    notify: "When to notify them",
    weekly: "Weekly digest", weeklyHint: "A friendly Sunday email summarizing the week.",
    urgentNote: "Urgent letters", urgentHint: "Anything red — sent right away.",
    ddline: "Deadlines coming up", ddlineHint: "A nudge three days before anything's due.",
    switch: "Switch profile",
    switchHint: "You're managing several people. Here are the others.",
    privacy: "Privacy & data",
    privacyHint: "We never share your letters or use them to train models. Photos are deleted after 30 days unless you save them.",
    download: "Download all my letters",
    remove: "Delete this account",
    removeHint: "Permanently removes Elena's data. This can't be undone.",
    change: "Change",
    edit: "Edit",
    logged: "Signed in as caregiver@email.com",
    signout: "Sign out",
  },
  fr: {
    title: "Compte",
    sub: "Réglages, qui vous aidez, et comment Clara vous contacte.",
    person: "À propos de cette personne",
    name: "Nom", lang: "Langue préférée", relation: "Relation", caregiver: "Configuré par",
    changeAv: "Changer la photo",
    reading: "Lecture à voix haute",
    readingHint: "Comment Clara sonne quand elle lit vos lettres.",
    autoplay: "Lecture automatique", autoplayHint: "Commence à lire dès que vous arrivez.",
    voice: "Voix de Clara", voiceHint: "Nous avons choisi la plus chaleureuse.",
    speed: "Vitesse de lecture", speedHint: "Plus lent est plus facile à suivre.",
    preview: "Aperçu",
    caregivers: "Aidants",
    caregiversHint: "Les personnes prévenues quand quelque chose d'important arrive.",
    addCare: "Ajouter un aidant",
    notify: "Quand les prévenir",
    weekly: "Résumé hebdomadaire", weeklyHint: "Un e-mail du dimanche résumant la semaine.",
    urgentNote: "Lettres urgentes", urgentHint: "Tout ce qui est en rouge — envoyé immédiatement.",
    ddline: "Échéances à venir", ddlineHint: "Un rappel 3 jours avant.",
    switch: "Changer de profil",
    switchHint: "Vous gérez plusieurs personnes. Voici les autres.",
    privacy: "Confidentialité",
    privacyHint: "Vos lettres ne sont jamais partagées. Les photos sont supprimées au bout de 30 jours.",
    download: "Télécharger toutes mes lettres",
    remove: "Supprimer ce compte",
    removeHint: "Supprime définitivement les données d'Elena.",
    change: "Modifier",
    edit: "Modifier",
    logged: "Connecté en tant que caregiver@email.com",
    signout: "Déconnexion",
  },
  ur: {
    title: "اکاؤنٹ",
    sub: "ترتیبات، آپ کس کی مدد کر رہے ہیں، اور کلارا کیسے رابطہ کرے۔",
    person: "اس شخص کے بارے میں",
    name: "نام", lang: "پسندیدہ زبان", relation: "رشتہ", caregiver: "ترتیب دیا",
    changeAv: "تصویر بدلیں",
    reading: "پڑھ کر سنانا",
    readingHint: "کلارا کی آواز کیسی ہو۔",
    autoplay: "خود بخود چلائیں", autoplayHint: "خط کھلتے ہی پڑھنا شروع کرے۔",
    voice: "کلارا کی آواز", voiceHint: "ہم نے سب سے گرم آواز چنی ہے۔",
    speed: "رفتار", speedHint: "آہستہ سننے میں آسان ہے۔",
    preview: "نمونہ",
    caregivers: "نگران",
    caregiversHint: "اہم بات آنے پر جنہیں بتایا جائے۔",
    addCare: "نگران شامل کریں",
    notify: "کب اطلاع دیں",
    weekly: "ہفتہ وار خلاصہ", weeklyHint: "اتوار کو ایک ای میل۔",
    urgentNote: "ضروری خطوط", urgentHint: "فوراً بھیجا جائے۔",
    ddline: "آنے والی تاریخیں", ddlineHint: "تین دن پہلے یاد دہانی۔",
    switch: "پروفائل بدلیں",
    switchHint: "آپ کئی لوگوں کو سنبھالتے ہیں۔",
    privacy: "رازداری",
    privacyHint: "آپ کے خطوط کبھی شیئر نہیں ہوتے۔",
    download: "میرے سب خطوط ڈاؤن لوڈ کریں",
    remove: "اکاؤنٹ ختم کریں",
    removeHint: "ایلینا کا ڈیٹا ہمیشہ کے لیے مٹ جائے گا۔",
    change: "تبدیل",
    edit: "تبدیل",
    logged: "caregiver@email.com بطور لاگ ان",
    signout: "لاگ آؤٹ",
  },
};

const LANG_NAMES: Record<string, string> = {
  en: 'English', fr: 'Français', ur: 'اردو', es: 'Español', zh: '中文',
  pt: 'Português', ht: 'Kreyòl', vi: 'Tiếng Việt', ar: 'العربية',
};

interface ToggleProps { on: boolean; onChange: (v: boolean) => void }
function Toggle({ on, onChange }: ToggleProps) {
  return (
    <button
      className="toggle-sw"
      data-on={on ? '1' : '0'}
      onClick={() => onChange(!on)}
      aria-label="toggle"
    />
  );
}

export default function AccountPage() {
  const [t, setTweak] = useClaraTweaks();
  const router = useRouter();
  const lang = t.language;
  const t9n = T9N[lang] || T9N.en;

  const active = CLARA_PROFILES.find(p => p.id === t.activeProfile) || CLARA_PROFILES[0];
  const others = CLARA_PROFILES.filter(p => p.id !== active.id && p.id !== 'self');

  const langName = (l: string) => LANG_NAMES[l] || l;

  const [emailPrefs, setEmailPrefs] = useState({
    weeklyDigest: true,
    urgent: true,
    deadlines: true,
  });
  const [voicePrefs, setVoicePrefs] = useState({
    autoplay: true,
    voice: 'warm',
    speed: 'normal',
  });

  const switchTo = (p: Profile) => {
    setTweak({ activeProfile: p.id, language: p.language, accent: p.accent });
    setTimeout(() => router.push('/upload'), 150);
  };

  const activePal = ACCENT_PALETTES[active.accent] || ACCENT_PALETTES.sage;

  return (
    <>
      <TopNav active="account" lang={lang} />
      <main className="shell" data-screen-label="06 Account">
        <section className="profile-hero fade-up">
          <div className="h-mono" style={{ marginBottom: 12 }}>{t9n.title}</div>
          <h1 className="h-display">{t9n.title}.</h1>
          <p>{t9n.sub}</p>
        </section>

        <div className="acc-grid">
          <aside className="acc-side fade-up fade-up-2">
            <div className="acc-avatar" style={{ background: activePal.soft, color: activePal.ink }}>
              {active.initials}
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="role">{active.relation}</div>
              <p className="name">{active.name}</p>
              <span className="pill" style={{ marginTop: 8 }}>
                <Icon name="leaf" size={12} />{langName(active.language)}
              </span>
            </div>
            <div className="acc-stats">
              <div className="acc-stat">
                <div className="num">{active.letters}</div>
                <div className="label">{lang === 'fr' ? 'Lettres' : lang === 'ur' ? 'خطوط' : 'Letters'}</div>
              </div>
              <div className="acc-stat">
                <div className="num">2</div>
                <div className="label">{lang === 'fr' ? 'Échéances' : lang === 'ur' ? 'تاریخیں' : 'Deadlines'}</div>
              </div>
            </div>
            <button className="btn btn-ghost" style={{ fontSize: 14, padding: '10px 18px' }}>
              <Icon name="camera" size={14} /> {t9n.changeAv}
            </button>
          </aside>

          <div>
            <section className="acc-section fade-up fade-up-2">
              <div className="h-mono">{t9n.person}</div>
              <h2>{active.name}</h2>
              <p className="sec-hint">{t9n.sub}</p>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.name}</span><span className="v">{active.name} Rodriguez</span></div>
                <a href="#" className="acc-link">{t9n.edit}</a>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.lang}</span><span className="v">{langName(active.language)}</span></div>
                <a href="#" className="acc-link">{t9n.change}</a>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.relation}</span><span className="v">{active.relation}</span></div>
                <a href="#" className="acc-link">{t9n.edit}</a>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.caregiver}</span><span className="v">caregiver@email.com</span></div>
              </div>
            </section>

            <section className="acc-section fade-up fade-up-3">
              <div className="h-mono">{t9n.reading}</div>
              <h2>{lang === 'fr' ? 'Comment Clara sonne' : lang === 'ur' ? 'کلارا کی آواز' : "Clara's voice"}</h2>
              <p className="sec-hint">{t9n.readingHint}</p>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.autoplay}</span><span className="v">{t9n.autoplayHint}</span></div>
                <Toggle on={voicePrefs.autoplay} onChange={(v) => setVoicePrefs({ ...voicePrefs, autoplay: v })} />
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.voice}</span><span className="v">{t9n.voiceHint}</span></div>
                <button className="btn btn-ghost" style={{ fontSize: 14, padding: '10px 18px' }}>
                  <Icon name="play" size={12} /> {t9n.preview}
                </button>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.speed}</span><span className="v">{t9n.speedHint}</span></div>
                <select
                  className="acc-link"
                  defaultValue="normal"
                  style={{ appearance: 'none', background: 'var(--bg-elev)', border: '0.5px solid var(--rule-strong)', borderRadius: 8, padding: '8px 14px', font: 'inherit', fontSize: 15 }}
                >
                  <option value="slow">{lang === 'fr' ? 'Lent' : lang === 'ur' ? 'آہستہ' : 'Slow'}</option>
                  <option value="normal">{lang === 'fr' ? 'Normal' : lang === 'ur' ? 'عام' : 'Normal'}</option>
                  <option value="fast">{lang === 'fr' ? 'Rapide' : lang === 'ur' ? 'تیز' : 'Fast'}</option>
                </select>
              </div>
            </section>

            <section className="acc-section fade-up fade-up-4">
              <div className="h-mono">{t9n.caregivers}</div>
              <h2>{lang === 'fr' ? 'Qui est prévenu' : lang === 'ur' ? 'کسے بتایا جائے' : 'Who hears about important letters'}</h2>
              <p className="sec-hint">{t9n.caregiversHint}</p>
              <div className="acc-row">
                <div className="lbl" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <div className="op-chip-av">D</div>
                  <div>
                    <div className="k">Daughter — Sofia</div>
                    <div className="v">sofia@email.com · {lang === 'fr' ? 'depuis mars' : lang === 'ur' ? 'مارچ سے' : 'since March'}</div>
                  </div>
                </div>
                <a href="#" className="acc-link">{t9n.edit}</a>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.weekly}</span><span className="v">{t9n.weeklyHint}</span></div>
                <Toggle on={emailPrefs.weeklyDigest} onChange={(v) => setEmailPrefs({ ...emailPrefs, weeklyDigest: v })} />
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.urgentNote}</span><span className="v">{t9n.urgentHint}</span></div>
                <Toggle on={emailPrefs.urgent} onChange={(v) => setEmailPrefs({ ...emailPrefs, urgent: v })} />
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k">{t9n.ddline}</span><span className="v">{t9n.ddlineHint}</span></div>
                <Toggle on={emailPrefs.deadlines} onChange={(v) => setEmailPrefs({ ...emailPrefs, deadlines: v })} />
              </div>
              <div style={{ marginTop: 18 }}>
                <a href="#" className="acc-link"><Icon name="plus" size={12} /> {t9n.addCare}</a>
              </div>
            </section>

            <section className="acc-section fade-up">
              <div className="h-mono">{t9n.switch}</div>
              <h2>{lang === 'fr' ? 'Autres profils' : lang === 'ur' ? 'دیگر پروفائلز' : 'Other people you help'}</h2>
              <p className="sec-hint">{t9n.switchHint}</p>
              <div className="other-profiles">
                {others.map(p => {
                  const pal = ACCENT_PALETTES[p.accent] || ACCENT_PALETTES.sage;
                  return (
                    <button
                      key={p.id}
                      className="op-chip"
                      onClick={() => switchTo(p)}
                      style={{ appearance: 'none', cursor: 'pointer', font: 'inherit' }}
                    >
                      <div className="op-chip-av" style={{ background: pal.soft, color: pal.ink }}>{p.initials}</div>
                      <div>
                        <div className="op-chip-name">{p.name}</div>
                        <div className="op-chip-rel">{p.relation} · {langName(p.language)}</div>
                      </div>
                    </button>
                  );
                })}
                <Link href="/picker" className="op-chip" style={{ borderStyle: 'dashed', background: 'transparent' }}>
                  <div className="op-chip-av" style={{ background: 'transparent', border: '1px dashed var(--rule-strong)', color: 'var(--ink-faint)' }}>+</div>
                  <div className="op-chip-name muted">{lang === 'fr' ? 'Voir tous' : lang === 'ur' ? 'سب دیکھیں' : 'See all profiles'}</div>
                </Link>
              </div>
            </section>

            <section className="acc-section fade-up">
              <div className="h-mono">{t9n.privacy}</div>
              <h2>{lang === 'fr' ? 'Vos lettres restent les vôtres' : lang === 'ur' ? 'آپ کے خطوط آپ کے' : 'Your letters stay yours'}</h2>
              <p className="sec-hint">{t9n.privacyHint}</p>
              <div className="acc-row">
                <div className="lbl">
                  <span className="k">{t9n.download}</span>
                  <span className="v">{lang === 'fr' ? 'PDF chiffré, envoyé par e-mail.' : lang === 'ur' ? 'محفوظ پی ڈی ایف۔' : 'Encrypted PDF, sent to your email.'}</span>
                </div>
                <a href="#" className="acc-link"><Icon name="doc" size={12} /> {lang === 'fr' ? 'Télécharger' : lang === 'ur' ? 'ڈاؤن لوڈ' : 'Download'}</a>
              </div>
              <div className="acc-row">
                <div className="lbl"><span className="k danger">{t9n.remove}</span><span className="v">{t9n.removeHint}</span></div>
                <a href="#" className="acc-link danger" style={{ borderColor: 'rgba(181,99,74,.3)' }}>
                  {lang === 'fr' ? 'Supprimer' : lang === 'ur' ? 'حذف' : 'Delete'}
                </a>
              </div>
            </section>

            <p style={{ textAlign: 'center', color: 'var(--ink-faint)', fontSize: 14, marginTop: 48 }}>
              {t9n.logged} · <a href="#" className="acc-link">{t9n.signout}</a>
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
