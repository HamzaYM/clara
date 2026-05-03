// Tweaks store ISO codes ('en', 'es', 'fr', 'ur'...). The /api/process-letter
// extractors and /api/tts language inputs accept English names ('Spanish',
// 'Mandarin'...). This adapter is the single boundary between the two.

const CODE_TO_NAME: Record<string, string> = {
  en: 'English',
  es: 'Spanish',
  zh: 'Mandarin',
  pt: 'Portuguese',
  ht: 'Haitian Creole',
  vi: 'Vietnamese',
  ar: 'Arabic',
  fr: 'French',
  ur: 'Urdu',
};

const CODE_TO_BCP47: Record<string, string> = {
  en: 'en-US',
  es: 'es-ES',
  zh: 'zh-CN',
  pt: 'pt-BR',
  ht: 'ht-HT',
  vi: 'vi-VN',
  ar: 'ar-SA',
  fr: 'fr-FR',
  ur: 'ur-PK',
};

export function langCodeToName(code: string): string {
  return CODE_TO_NAME[code] ?? 'English';
}

// For window.speechSynthesis fallback when /api/tts is unavailable.
export function langCodeToBCP47(code: string): string {
  return CODE_TO_BCP47[code] ?? 'en-US';
}
