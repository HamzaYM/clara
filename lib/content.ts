// Clara — shared content. Letters, translations, names — all in one place.
// Mock data for Phase 3. Will be replaced by DB-backed reads in Phase 4.

export type Lang = string; // accepts 'en' | 'fr' | 'ur' | 'es' | 'zh' | etc.
export type Urgency = 'low' | 'med' | 'high';
export type Category = 'Government' | 'Health' | 'Financial' | 'Other';

export interface Letter {
  id: string;
  sender: string;
  type: string;
  category: Category;
  received: string;
  deadline: string | null;
  urgency: Urgency;
  summary: Record<string, string>;
  actions: Record<string, string[]>;
  deadlineNotes: Record<string, string> | null;
  draft: string | null;
  reassure: Record<string, string>;
}

export const CLARA_GREETINGS: Record<string, { hi: string; you: string }> = {
  en: { hi: "Good morning", you: "Elena" },
  fr: { hi: "Bonjour", you: "Elena" },
  ur: { hi: "السلام علیکم،", you: "ایلینا" },
};

export const CLARA_LETTERS: Letter[] = [
  {
    id: 'masshealth-renewal',
    sender: 'MassHealth',
    type: 'Medicaid Renewal Notice',
    category: 'Government',
    received: '2026-04-28',
    deadline: '2026-05-15',
    urgency: 'high',
    summary: {
      en: "MassHealth needs to confirm you still qualify for your health insurance. They've sent you a packet of forms. If you don't return them by May 15, your coverage will stop on June 1.",
      fr: "MassHealth doit confirmer que vous remplissez toujours les conditions pour votre assurance maladie. Ils vous ont envoyé un dossier de formulaires. Si vous ne les retournez pas avant le 15 mai, votre couverture prendra fin le 1er juin.",
      ur: "میس ہیلتھ کو تصدیق کرنی ہے کہ آپ اب بھی صحت کی انشورنس کے اہل ہیں۔ انہوں نے آپ کو فارم بھیجے ہیں۔ اگر آپ نے 15 مئی تک واپس نہ کیے، تو آپ کی کوریج 1 جون کو ختم ہو جائے گی۔",
    },
    actions: {
      en: [
        "Find the green packet they sent — it has the renewal forms inside.",
        "Fill in your current address, your income, and who lives with you.",
        "Mail it back in the envelope they included, or upload it at masshealth.gov.",
        "Once they receive it, they'll send a confirmation within two weeks.",
      ],
      fr: [
        "Trouvez le dossier vert qu'ils vous ont envoyé — les formulaires de renouvellement sont à l'intérieur.",
        "Remplissez votre adresse actuelle, vos revenus, et les personnes qui vivent avec vous.",
        "Renvoyez-le dans l'enveloppe incluse, ou téléversez-le sur masshealth.gov.",
        "Une fois reçu, ils enverront une confirmation sous deux semaines.",
      ],
      ur: [
        "وہ سبز پیکٹ تلاش کریں جو انہوں نے بھیجا ہے — اس میں تجدید کے فارم ہیں۔",
        "اپنا موجودہ پتہ، آمدنی، اور اپنے ساتھ رہنے والے لوگ لکھیں۔",
        "ساتھ بھیجے گئے لفافے میں واپس بھیجیں، یا masshealth.gov پر اپ لوڈ کریں۔",
        "موصول ہونے پر، وہ دو ہفتوں میں تصدیق بھیجیں گے۔",
      ],
    },
    deadlineNotes: {
      en: "Forms must be received by MassHealth by May 15. If they're late, coverage ends June 1.",
      fr: "Les formulaires doivent être reçus par MassHealth avant le 15 mai. En cas de retard, la couverture prend fin le 1er juin.",
      ur: "فارم 15 مئی تک میس ہیلتھ کو موصول ہونے چاہئیں۔ تاخیر کی صورت میں 1 جون کو کوریج ختم ہو جائے گی۔",
    },
    draft: "Dear MassHealth,\n\nI am writing to confirm receipt of my Medicaid renewal notice dated April 28, 2026 (Member ID 4429-1190).\n\nEnclosed please find my completed renewal forms with my current address, household income, and household members. I am returning these well in advance of the May 15 deadline.\n\nIf you require any additional documentation, please contact me at the phone number on file.\n\nThank you for your assistance.\n\nSincerely,\nElena Rodriguez",
    reassure: {
      en: "This is the same form you filled out last year. Take your time — we'll walk through it together if you'd like.",
      fr: "C'est le même formulaire que l'année dernière. Prenez votre temps — nous pouvons le parcourir ensemble si vous voulez.",
      ur: "یہ وہی فارم ہے جو آپ نے پچھلے سال بھرا تھا۔ آرام سے کریں — اگر چاہیں تو ہم ساتھ مل کر دیکھ لیں گے۔",
    },
  },
  {
    id: 'medical-bill',
    sender: 'Mass General Brigham',
    type: 'Medical Bill',
    category: 'Health',
    received: '2026-04-22',
    deadline: '2026-05-22',
    urgency: 'med',
    summary: {
      en: "This is a bill for the visit to your primary doctor on March 18. Most of it was paid by your insurance. You owe $84.20. They'd like you to pay by May 22.",
      fr: "C'est une facture pour votre visite chez votre médecin le 18 mars. Votre assurance a payé la plupart. Vous devez 84,20 $. Ils souhaitent un paiement avant le 22 mai.",
      ur: "یہ 18 مارچ کو آپ کے ڈاکٹر کے پاس جانے کا بل ہے۔ زیادہ تر آپ کی انشورنس نے ادا کیا۔ آپ پر 84.20 ڈالر باقی ہیں۔ وہ 22 مئی تک ادائیگی چاہتے ہیں۔",
    },
    actions: {
      en: [
        "Check the date — March 18 — to make sure it matches the visit you remember.",
        "Pay the $84.20 by mail, by phone, or at patientgateway.org.",
        "Save the receipt with your other medical papers.",
      ],
      fr: [
        "Vérifiez la date — 18 mars — pour qu'elle corresponde à votre visite.",
        "Payez 84,20 $ par courrier, par téléphone, ou sur patientgateway.org.",
        "Conservez le reçu avec vos autres papiers médicaux.",
      ],
      ur: [
        "تاریخ — 18 مارچ — چیک کریں کہ یہ آپ کے دورے سے میل کھاتی ہے۔",
        "84.20 ڈالر ڈاک، فون، یا patientgateway.org سے ادا کریں۔",
        "رسید اپنے دیگر طبی کاغذات کے ساتھ رکھیں۔",
      ],
    },
    deadlineNotes: {
      en: "Payment due May 22. After that, a late fee may be added.",
      fr: "Paiement dû le 22 mai. Au-delà, des frais de retard peuvent s'appliquer.",
      ur: "22 مئی تک ادائیگی۔ اس کے بعد تاخیر کی فیس لگ سکتی ہے۔",
    },
    draft: "To Patient Billing, Mass General Brigham,\n\nEnclosed please find payment for $84.20 toward account 88210-44, dated March 18, 2026.\n\nKindly confirm receipt by mail.\n\nSincerely,\nElena Rodriguez",
    reassure: {
      en: "Most of this was already paid. The remaining amount is small — there's no rush, and we have time.",
      fr: "La majeure partie a déjà été payée. Le montant restant est petit — pas de précipitation.",
      ur: "زیادہ تر پہلے ہی ادا ہو چکا ہے۔ باقی رقم چھوٹی ہے — جلدی کی ضرورت نہیں۔",
    },
  },
  {
    id: 'uscis-greencard',
    sender: 'USCIS',
    type: 'Green Card Renewal',
    category: 'Government',
    received: '2026-04-15',
    deadline: '2026-07-12',
    urgency: 'med',
    summary: {
      en: "Your green card expires this summer. USCIS is reminding you to renew it. The form is called I-90, and the fee is $465.",
      fr: "Votre carte verte expire cet été. L'USCIS vous rappelle de la renouveler. Le formulaire s'appelle I-90, et les frais sont de 465 $.",
      ur: "آپ کا گرین کارڈ اس گرمی میں ختم ہو رہا ہے۔ USCIS آپ کو تجدید کی یاد دہانی کر رہا ہے۔ فارم I-90 ہے، اور فیس 465 ڈالر ہے۔",
    },
    actions: {
      en: [
        "Find your current green card and check the expiration date on the back.",
        "Fill out form I-90 — we can help you do this online or on paper.",
        "Pay the $465 filing fee by check or online.",
      ],
      fr: [
        "Trouvez votre carte verte et vérifiez la date d'expiration au dos.",
        "Remplissez le formulaire I-90 — nous pouvons vous aider en ligne ou sur papier.",
        "Payez les frais de 465 $ par chèque ou en ligne.",
      ],
      ur: [
        "اپنا گرین کارڈ تلاش کریں اور پیچھے میعاد چیک کریں۔",
        "فارم I-90 بھریں — ہم آن لائن یا کاغذ پر مدد کر سکتے ہیں۔",
        "465 ڈالر کی فیس چیک یا آن لائن ادا کریں۔",
      ],
    },
    deadlineNotes: {
      en: "Renew before July 12 to avoid a lapse in your green card.",
      fr: "Renouvelez avant le 12 juillet pour éviter une interruption.",
      ur: "12 جولائی سے پہلے تجدید کریں تاکہ کوئی وقفہ نہ ہو۔",
    },
    draft: "Dear USCIS,\n\nPlease accept my completed Form I-90 application for renewal of my permanent resident card (Receipt #MSC-2226-098-1145), submitted with the $465 filing fee.\n\nSincerely,\nElena Rodriguez",
    reassure: {
      en: "You have plenty of time. Renewing is routine — millions of people do this every year.",
      fr: "Vous avez largement le temps. C'est une procédure de routine.",
      ur: "آپ کے پاس کافی وقت ہے۔ تجدید معمول کی بات ہے۔",
    },
  },
  {
    id: 'comcast',
    sender: 'Comcast',
    type: 'Service Notice',
    category: 'Other',
    received: '2026-04-10',
    deadline: null,
    urgency: 'low',
    summary: {
      en: "Comcast is letting you know that your monthly internet bill is going up by $4 starting June 1. You don't need to do anything.",
      fr: "Comcast vous informe que votre facture mensuelle augmente de 4 $ à partir du 1er juin. Aucune action requise.",
      ur: "Comcast بتا رہا ہے کہ 1 جون سے آپ کا ماہانہ بل 4 ڈالر بڑھ جائے گا۔ آپ کو کچھ کرنے کی ضرورت نہیں۔",
    },
    actions: {
      en: ["Nothing required — just so you know."],
      fr: ["Rien à faire — c'est juste pour information."],
      ur: ["کچھ کرنے کی ضرورت نہیں — صرف اطلاع کے لیے۔"],
    },
    deadlineNotes: null,
    draft: null,
    reassure: {
      en: "This is just an informational notice. No action is needed.",
      fr: "Notice d'information. Aucune action requise.",
      ur: "صرف اطلاعی نوٹس ہے۔ کوئی کارروائی نہیں۔",
    },
  },
  {
    id: 'social-security',
    sender: 'Social Security Administration',
    type: 'Annual Statement',
    category: 'Government',
    received: '2026-03-30',
    deadline: null,
    urgency: 'low',
    summary: {
      en: "The Social Security office sends this every year so you can check your earnings record. Look it over and call them only if anything looks wrong.",
      fr: "Le bureau de la Sécurité sociale envoie cela chaque année pour que vous vérifiiez votre dossier. Appelez-les seulement si quelque chose paraît incorrect.",
      ur: "سوشل سیکیورٹی ہر سال بھیجتا ہے تاکہ آپ اپنا ریکارڈ چیک کر سکیں۔ غلط لگے تو ہی فون کریں۔",
    },
    actions: {
      en: ["Look at the list of years and earnings. If anything's off, call 1-800-772-1213."],
      fr: ["Regardez les années et revenus. Si quelque chose ne va pas, appelez le 1-800-772-1213."],
      ur: ["سال اور آمدنی دیکھیں۔ کچھ غلط ہو تو 1-800-772-1213 پر فون کریں۔"],
    },
    deadlineNotes: null,
    draft: null,
    reassure: {
      en: "This is routine — they send it to everyone every year.",
      fr: "C'est une routine annuelle.",
      ur: "یہ معمول کی سالانہ چیز ہے۔",
    },
  },
  {
    id: 'bank-statement',
    sender: 'Eastern Bank',
    type: 'Monthly Statement',
    category: 'Financial',
    received: '2026-04-03',
    deadline: null,
    urgency: 'low',
    summary: {
      en: "Your monthly bank statement for March. Your balance is $3,412.18. Nothing unusual was flagged.",
      fr: "Votre relevé mensuel pour mars. Solde de 3 412,18 $. Rien d'inhabituel.",
      ur: "مارچ کا ماہانہ بینک اسٹیٹمنٹ۔ بقایا 3,412.18 ڈالر۔ کچھ غیر معمولی نہیں۔",
    },
    actions: {
      en: ["Just keep it for your records."],
      fr: ["Conservez-le pour vos archives."],
      ur: ["صرف اپنے ریکارڈ کے لیے رکھیں۔"],
    },
    deadlineNotes: null,
    draft: null,
    reassure: { en: "All looks normal.", fr: "Tout semble normal.", ur: "سب کچھ ٹھیک نظر آ رہا ہے۔" },
  },
];

// Date helpers — "today" is pinned to 2026-05-03 to keep demo countdowns stable.
export function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const today = new Date('2026-05-03');
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr: string | null, lang: string = 'en'): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const opts: Intl.DateTimeFormatOptions = { month: 'long', day: 'numeric', year: 'numeric' };
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ur' ? 'ur-PK' : 'en-US';
  return d.toLocaleDateString(locale, opts);
}

export function formatDateShort(dateStr: string | null, lang: string = 'en'): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  const locale = lang === 'fr' ? 'fr-FR' : lang === 'ur' ? 'ur-PK' : 'en-US';
  return d.toLocaleDateString(locale, opts);
}

export interface UIStrings {
  needToDo: string;
  deadline: string;
  deadlines: string;
  draft: string;
  draftHint: string;
  copy: string;
  copied: string;
  listen: string;
  pause: string;
  inDays: (n: number) => string;
  overdue: (n: number) => string;
  reassure: string;
  upload: string;
  uploadHint: string;
  recent: string;
  noRecent: string;
  profile: { Government: string; Health: string; Financial: string; Other: string };
  nav: { home: string; profile: string; reminders: string; account: string };
  noUrgent: string;
  upcoming: string;
  received: string;
  from: string;
}

export const UI_STRINGS: Record<string, UIStrings> = {
  en: {
    needToDo: "What you need to do",
    deadline: "Deadline",
    deadlines: "Deadlines",
    draft: "We've drafted a reply for you",
    draftHint: "We wrote this in formal English so you can send it as-is.",
    copy: "Copy reply",
    copied: "Copied",
    listen: "Listen",
    pause: "Pause",
    inDays: (n) => n === 0 ? "today" : n === 1 ? "tomorrow" : `in ${n} days`,
    overdue: (n) => `${Math.abs(n)} days overdue`,
    reassure: "A note from Clara",
    upload: "Take a photo of your letter",
    uploadHint: "Or drag a photo here. We'll read it carefully.",
    recent: "Recent letters",
    noRecent: "Your letters will appear here.",
    profile: { Government: "Government", Health: "Health", Financial: "Financial", Other: "Other" },
    nav: { home: "Home", profile: "My letters", reminders: "Reminders", account: "Account" },
    noUrgent: "Nothing urgent right now. We'll let you know.",
    upcoming: "Upcoming",
    received: "Received",
    from: "From",
  },
  fr: {
    needToDo: "Ce que vous devez faire",
    deadline: "Échéance",
    deadlines: "Échéances",
    draft: "Nous avons rédigé une réponse",
    draftHint: "Rédigée en anglais formel pour pouvoir l'envoyer telle quelle.",
    copy: "Copier",
    copied: "Copié",
    listen: "Écouter",
    pause: "Pause",
    inDays: (n) => n === 0 ? "aujourd'hui" : n === 1 ? "demain" : `dans ${n} jours`,
    overdue: (n) => `en retard de ${Math.abs(n)} jours`,
    reassure: "Un mot de Clara",
    upload: "Prenez une photo de votre lettre",
    uploadHint: "Ou glissez une photo ici. Nous la lirons attentivement.",
    recent: "Lettres récentes",
    noRecent: "Vos lettres apparaîtront ici.",
    profile: { Government: "Administration", Health: "Santé", Financial: "Finances", Other: "Autres" },
    nav: { home: "Accueil", profile: "Mes lettres", reminders: "Rappels", account: "Compte" },
    noUrgent: "Rien d'urgent. Nous vous préviendrons.",
    upcoming: "À venir",
    received: "Reçue",
    from: "De",
  },
  ur: {
    needToDo: "آپ کو کیا کرنا ہے",
    deadline: "آخری تاریخ",
    deadlines: "آخری تاریخیں",
    draft: "ہم نے آپ کے لیے جواب لکھا ہے",
    draftHint: "ہم نے یہ رسمی انگریزی میں لکھا ہے تاکہ آپ ویسے ہی بھیج سکیں۔",
    copy: "کاپی کریں",
    copied: "کاپی ہو گیا",
    listen: "سنیں",
    pause: "روکیں",
    inDays: (n) => n === 0 ? "آج" : n === 1 ? "کل" : `${n} دن میں`,
    overdue: (n) => `${Math.abs(n)} دن دیر سے`,
    reassure: "کلارا کی طرف سے",
    upload: "اپنے خط کی تصویر لیں",
    uploadHint: "یا تصویر یہاں چھوڑ دیں۔ ہم احتیاط سے پڑھیں گے۔",
    recent: "حالیہ خطوط",
    noRecent: "آپ کے خطوط یہاں نظر آئیں گے۔",
    profile: { Government: "حکومت", Health: "صحت", Financial: "مالی", Other: "دیگر" },
    nav: { home: "گھر", profile: "میرے خطوط", reminders: "یاد دہانیاں", account: "اکاؤنٹ" },
    noUrgent: "ابھی کچھ فوری نہیں۔ ہم بتا دیں گے۔",
    upcoming: "آنے والے",
    received: "موصول",
    from: "از",
  },
};
