import {RESUME_DATA_EN} from './resume-data.en';
import {RESUME_DATA_ES} from './resume-data.es';
import type {Lang, ResumeData} from './resume-data.types';
import {formatYearsClaim, yearsOfExperience, type YearMonth} from '@/lib/dates';

export type {Lang, ResumeData, SocialNetwork} from './resume-data.types';
export {LANGS, isLang} from './resume-data.types';

export const RESUME_DATA = RESUME_DATA_EN;

export const RESUME_DATA_BY_LANG: Record<Lang, ResumeData> = {
  en: RESUME_DATA_EN,
  es: RESUME_DATA_ES,
};

/** Start of the professional career: the oldest job's start month. */
export const CAREER_START: YearMonth = RESUME_DATA_EN.work
  .map(w => w.start)
  .reduce((a, b) => (b < a ? b : a));

/** Placeholder in `summary` for the years claim. */
export const YEARS_PLACEHOLDER = '{years}';

/** "4+ years" / "más de 4 años", counted from CAREER_START up to `today`. */
export function experienceClaim(lang: Lang, today: Date): string {
  return formatYearsClaim(yearsOfExperience(CAREER_START, today), lang);
}

/** `text` with the years placeholder replaced by the claim for `today`. */
export function withExperience(text: string, lang: Lang, today: Date): string {
  return text.replace(YEARS_PLACEHOLDER, experienceClaim(lang, today));
}
