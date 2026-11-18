/** @jest-environment node */
import {
  CAREER_START,
  RESUME_DATA_BY_LANG,
  experienceClaim,
  withExperience,
} from '@/data/resume-data';
import {monthStart} from '@/lib/dates';

const EN = RESUME_DATA_BY_LANG.en;

describe('years of experience', () => {
  it('counts from the oldest job, wherever it is listed', () => {
    const starts = EN.work.map(w => w.start).sort();
    expect(CAREER_START).toBe(starts[0]);
    expect(EN.work.at(-1)?.start).toBe(CAREER_START);
  });

  it.each([
    ['2026-11', 'en', '4+ years'],
    ['2026-11', 'es', 'más de 4 años'],
    ['2027-03', 'en', '4+ years'],
    ['2027-04', 'en', '5+ years'],
    ['2027-04', 'es', 'más de 5 años'],
  ] as const)('built in %s, the %s claim is %s', (built, lang, claim) => {
    expect(experienceClaim(lang, monthStart(built))).toBe(claim);
  });

  it.each([
    ['en', 'QA Engineer with 4+ years of experience'],
    ['es', 'QA Engineer con más de 4 años de experiencia'],
  ] as const)('fills the %s summary with the claim', (lang, opening) => {
    const text = withExperience(
      RESUME_DATA_BY_LANG[lang].summary,
      lang,
      monthStart('2026-11'),
    );
    expect(text.startsWith(opening)).toBe(true);
    expect(text).not.toContain('{years}');
  });
});
