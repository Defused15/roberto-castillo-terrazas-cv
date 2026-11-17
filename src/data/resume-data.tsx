import { RESUME_DATA_EN } from "./resume-data.en";
import type { Lang, ResumeData } from "./resume-data.types";

export type { Lang, ResumeData, Project } from "./resume-data.types";
export { LANGS, isLang } from "./resume-data.types";

export const RESUME_DATA = RESUME_DATA_EN;

export const RESUME_DATA_BY_LANG: Record<Lang, ResumeData> = {
  en: RESUME_DATA_EN,
  es: RESUME_DATA_EN,
};
