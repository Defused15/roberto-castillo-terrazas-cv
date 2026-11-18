import type {Lang} from '@/data/resume-data';

/** A month as "YYYY-MM", e.g. "2022-04". */
export type YearMonth = `${number}-${string}`;

function parts(ym: YearMonth): [number, number] {
  const [y, m] = ym.split('-').map(Number);
  return [y, m];
}

/** Months from `start` to `end` (or to `today` when `end` is null), counting both months. */
export function durationMonths(
  start: YearMonth,
  end: YearMonth | null,
  today: Date,
): number {
  const [sy, sm] = parts(start);
  const [ey, em] = end
    ? parts(end)
    : [today.getFullYear(), today.getMonth() + 1];
  return Math.max(0, (ey - sy) * 12 + (em - sm) + 1);
}

const UNITS = {
  en: {year: ['yr', 'yrs'], month: ['mo', 'mos']},
  es: {year: ['año', 'años'], month: ['mes', 'meses']},
} as const;

/** 9 → "9 mos" / "9 meses"; 27 → "2 yrs 3 mos" / "2 años 3 meses". */
export function formatDuration(months: number, lang: Lang): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const u = UNITS[lang];
  const out: string[] = [];
  if (years > 0) out.push(`${years} ${u.year[years === 1 ? 0 : 1]}`);
  if (rest > 0 || years === 0)
    out.push(`${rest} ${u.month[rest === 1 ? 0 : 1]}`);
  return out.join(' ');
}

/** Full years since `careerStart`, counted by month: April 2022 reaches 5 on 1 April 2027. */
export function yearsOfExperience(careerStart: YearMonth, today: Date): number {
  const [sy, sm] = parts(careerStart);
  const elapsed = (today.getFullYear() - sy) * 12 + (today.getMonth() + 1 - sm);
  return Math.max(0, Math.floor(elapsed / 12));
}

/** 4 → "4+ years" / "más de 4 años". */
export function formatYearsClaim(n: number, lang: Lang): string {
  if (lang === 'es') return `más de ${n} ${n === 1 ? 'año' : 'años'}`;
  return `${n}+ ${n === 1 ? 'year' : 'years'}`;
}
