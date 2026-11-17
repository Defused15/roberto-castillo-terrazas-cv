import { RESUME_DATA_BY_LANG, type Lang } from "@/data/resume-data";

/** Accessible name of the language toggle while the page is shown in `current`. */
export function languageToggleName(current: Lang): string {
  const next = current === "en" ? "es" : "en";
  return `${RESUME_DATA_BY_LANG[current].ui.languageToggle}: ${next.toUpperCase()}`;
}
