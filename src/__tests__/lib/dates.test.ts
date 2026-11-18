import {
  durationMonths,
  formatDuration,
  formatMonth,
  formatPeriod,
  formatYearsClaim,
  monthStart,
  toYearMonth,
  yearsOfExperience,
} from '@/lib/dates';

const day = (y: number, m: number, d: number) => new Date(y, m - 1, d);
const TODAY = day(2026, 11, 18);

describe('durationMonths', () => {
  it.each([
    ['Milwaukee Tool', '2022-04', '2022-12', 9],
    ['Divelement', '2023-01', '2025-03', 27],
    ['Inetum', '2025-03', '2026-03', 13],
    ['UAL (present)', '2026-10', null, 2],
    ['La Laguna', '2018-08', '2022-12', 53],
    ['same month', '2024-05', '2024-05', 1],
    ['across a year boundary', '2024-12', '2025-01', 2],
    ['end before start', '2025-01', '2024-01', 0],
  ] as const)('%s: %s to %s is %i months', (_name, start, end, expected) => {
    expect(durationMonths(start, end, TODAY)).toBe(expected);
  });

  it('measures an open range up to the month of today', () => {
    expect(durationMonths('2026-10', null, day(2026, 10, 1))).toBe(1);
    expect(durationMonths('2026-10', null, day(2027, 1, 31))).toBe(4);
  });
});

describe('formatDuration', () => {
  it.each([
    [0, 'en', '0 mos'],
    [1, 'en', '1 mo'],
    [9, 'en', '9 mos'],
    [12, 'en', '1 yr'],
    [13, 'en', '1 yr 1 mo'],
    [24, 'en', '2 yrs'],
    [27, 'en', '2 yrs 3 mos'],
    [1, 'es', '1 mes'],
    [9, 'es', '9 meses'],
    [12, 'es', '1 año'],
    [13, 'es', '1 año 1 mes'],
    [24, 'es', '2 años'],
    [27, 'es', '2 años 3 meses'],
  ] as const)('%i months in %s is %s', (months, lang, expected) => {
    expect(formatDuration(months, lang)).toBe(expected);
  });
});

describe('yearsOfExperience', () => {
  it.each([
    [day(2026, 11, 18), 4],
    [day(2027, 3, 31), 4],
    [day(2027, 4, 1), 5],
    [day(2022, 4, 1), 0],
    [day(2021, 1, 1), 0],
  ])('from 2022-04 on %s is %i', (today, expected) => {
    expect(yearsOfExperience('2022-04', today)).toBe(expected);
  });
});

describe('formatYearsClaim', () => {
  it.each([
    [4, 'en', '4+ years'],
    [1, 'en', '1+ year'],
    [4, 'es', 'más de 4 años'],
    [1, 'es', 'más de 1 año'],
  ] as const)('%i in %s is %s', (n, lang, expected) => {
    expect(formatYearsClaim(n, lang)).toBe(expected);
  });
});

describe('toYearMonth / monthStart', () => {
  it.each([
    [day(2026, 11, 18), '2026-11'],
    [day(2027, 1, 1), '2027-01'],
    [day(2025, 12, 31), '2025-12'],
  ])('%s is in %s', (date, ym) => {
    expect(toYearMonth(date)).toBe(ym);
  });

  it('starts a month on its first day at local midnight', () => {
    expect(monthStart('2025-03')).toEqual(day(2025, 3, 1));
    expect(toYearMonth(monthStart('2026-10'))).toBe('2026-10');
  });
});

describe('formatMonth', () => {
  it.each([
    ['2023-01', 'en', 'Jan 2023'],
    ['2025-03', 'en', 'Mar 2025'],
    ['2022-12', 'en', 'Dec 2022'],
    ['2023-01', 'es', 'ene. 2023'],
    ['2018-08', 'es', 'ago. 2018'],
    ['2026-09', 'es', 'sept. 2026'],
    ['2022-12', 'es', 'dic. 2022'],
  ] as const)('%s in %s is %s', (ym, lang, expected) => {
    expect(formatMonth(ym, lang)).toBe(expected);
  });

  it('names every month differently', () => {
    const names = (lang: 'en' | 'es') =>
      Array.from({length: 12}, (_, i) =>
        formatMonth(`2024-${String(i + 1).padStart(2, '0')}`, lang),
      );
    expect(new Set(names('en')).size).toBe(12);
    expect(new Set(names('es')).size).toBe(12);
    expect(names('en').join(',')).toBe(
      'Jan 2024,Feb 2024,Mar 2024,Apr 2024,May 2024,Jun 2024,Jul 2024,Aug 2024,Sep 2024,Oct 2024,Nov 2024,Dec 2024',
    );
    expect(names('es').join(',')).toBe(
      'ene. 2024,feb. 2024,mar. 2024,abr. 2024,may. 2024,jun. 2024,jul. 2024,ago. 2024,sept. 2024,oct. 2024,nov. 2024,dic. 2024',
    );
  });
});

describe('formatPeriod', () => {
  it.each([
    ['2023-01', '2025-03', 'en', 'Present', 'Jan 2023 – Mar 2025'],
    ['2025-03', null, 'en', 'Present', 'Mar 2025 – Present'],
    ['2025-03', null, 'es', 'Actual', 'mar. 2025 – Actual'],
    ['2022-04', '2022-12', 'es', 'Actual', 'abr. 2022 – dic. 2022'],
  ] as const)('%s to %s in %s', (start, end, lang, present, expected) => {
    expect(formatPeriod(start, end, lang, present)).toBe(expected);
  });
});
