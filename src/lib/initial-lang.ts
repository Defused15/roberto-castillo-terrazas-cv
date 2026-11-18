import {isLang, type Lang} from '@/data/resume-data';

/**
 * Language to start in: a valid stored choice wins; otherwise Spanish if any
 * of the browser's languages is Spanish ("es", "es-MX", ...); otherwise English.
 */
export function pickInitialLang(
  stored: string | null,
  navigatorLanguages: readonly string[],
): Lang {
  if (isLang(stored)) return stored;
  return navigatorLanguages.some(l => /^es(-|_|$)/i.test(l.trim()))
    ? 'es'
    : 'en';
}
