import {RESUME_DATA_BY_LANG, type Lang} from '@/data/resume-data';

/** Accessible name of the language toggle while the page is shown in `current`. */
export function languageToggleName(current: Lang): string {
  const next = current === 'en' ? 'es' : 'en';
  return `${RESUME_DATA_BY_LANG[current].ui.languageToggle}: ${next.toUpperCase()}`;
}

/**
 * Accessible name of the theme button when the stored theme is `current`
 * (no stored theme counts as "system"): it names the theme the next press applies.
 */
export function themeToggleName(
  lang: Lang,
  current: 'light' | 'dark' | 'system' = 'system',
): string {
  const t = RESUME_DATA_BY_LANG[lang].ui.theme;
  const next = {light: 'dark', dark: 'system', system: 'light'} as const;
  return `${t.toggle}: ${t[next[current]]}`;
}
