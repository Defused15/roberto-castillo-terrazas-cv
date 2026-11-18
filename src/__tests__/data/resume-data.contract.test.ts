/** @jest-environment node */
import {existsSync} from 'fs';
import {join} from 'path';
import {buildPersonJsonLd} from '@/app/structured-data';
import {
  RESUME_DATA_BY_LANG,
  YEARS_PLACEHOLDER,
  isLang,
  type ResumeData,
} from '@/data/resume-data';
import {decodePhone} from '@/lib/decode-phone';
import {isKnownIssuer} from '@/components/icons/issuers';
import {phoneCountry} from '@/lib/format-phone';

/**
 * Content contract for the published CV data. These tests encode invariants
 * that catch real content bugs (broken or insecure links, inverted dates,
 * duplicate React keys, untranslated text) without pinning the content itself:
 * adding a job, a project or a certification must never require a test change.
 */

const EN = RESUME_DATA_BY_LANG.en;
const ES = RESUME_DATA_BY_LANG.es;

type Leaf = [path: string, value: unknown];

const isPlainObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === 'object' &&
  v !== null &&
  Object.getPrototypeOf(v) === Object.prototype;

/** Flattens data into [path, value] leaves, e.g. ["work[0].description[2]", "..."]. */
function leaves(value: unknown, path = ''): Leaf[] {
  if (Array.isArray(value))
    return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (isPlainObject(value)) {
    return Object.entries(value).flatMap(([k, v]) =>
      leaves(v, path ? `${path}.${k}` : k),
    );
  }
  return [[path, value]];
}

const duplicates = (xs: readonly string[]) =>
  xs.filter((x, i) => xs.indexOf(x) !== i);

function collectUrls(d: ResumeData): Leaf[] {
  return [
    ...d.locations.map((l): Leaf => [`locations.${l.name}`, l.link]),
    ...d.contact.social.map((s): Leaf => [`social.${s.name}`, s.url]),
    ...d.work.map((w): Leaf => [`work.${w.company}`, w.link]),
    ...d.certifications.map((c): Leaf => [
      `cert.${c.title}/${c.issuer}`,
      c.url,
    ]),
    ...d.projects.flatMap((p): Leaf[] => [
      ...(p.link ? [[`project.${p.title}.link`, p.link.href] as Leaf] : []),
      ...(p.githubLink
        ? [[`project.${p.title}.github`, p.githubLink] as Leaf]
        : []),
    ]),
  ];
}

function isHttpsUrl(value: unknown): boolean {
  try {
    return new URL(String(value)).protocol === 'https:';
  } catch {
    return false;
  }
}

describe.each([
  ['en', EN],
  ['es', ES],
] as const)('resume data contract [%s]', (lang, d) => {
  it('has exactly one years placeholder in the summary, filled in at build time', () => {
    expect(d.summary.split(YEARS_PLACEHOLDER)).toHaveLength(2);
  });

  it('has no empty or whitespace-only strings', () => {
    const empty = leaves(d).filter(
      ([, v]) => typeof v === 'string' && v.trim() === '',
    );
    expect(empty).toEqual([]);
  });

  it('links only to absolute https URLs', () => {
    expect(collectUrls(d).filter(([, url]) => !isHttpsUrl(url))).toEqual([]);
  });

  it('points the avatar at a self-hosted file in /public', () => {
    expect(d.avatarUrl).toMatch(/^\/[^/]/);
    expect(existsSync(join(process.cwd(), 'public', d.avatarUrl))).toBe(true);
  });

  it('derives the initials from the name', () => {
    const initials = d.name
      .split(/\s+/)
      .map(part => part[0])
      .join('');
    expect(d.initials).toBe(initials);
  });

  it('states for every certification whether its link verifies it, with at least one verified', () => {
    expect(d.certifications.some(c => c.verified)).toBe(true);
    expect(
      d.certifications.filter(c => typeof c.verified !== 'boolean'),
    ).toEqual([]);
  });

  it('has a logo for every certification issuer', () => {
    expect(
      d.certifications.map(c => c.issuer).filter(i => !isKnownIssuer(i)),
    ).toEqual([]);
  });

  it('has a usable email address for mailto: links', () => {
    expect(d.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i);
  });

  it('stores phone numbers encoded, decoding to E.164 so tel: links work worldwide', () => {
    expect(
      d.contact.phones.filter(p => !/^\+[1-9]\d{7,14}$/.test(decodePhone(p))),
    ).toEqual([]);
    // Encoded means no run of digits a scraper could pick up from the HTML or bundle.
    expect(d.contact.phones.filter(p => /\d{4}/.test(p))).toEqual([]);
  });

  it('gives the privacy notice a title and paragraphs per section, with only known placeholders', () => {
    const {sections} = d.ui.privacy;
    expect(sections.length).toBeGreaterThan(0);
    expect(
      sections.filter(s => s.paragraphs.length === 0).map(s => s.title),
    ).toEqual([]);
    const placeholders = sections.flatMap(
      s => s.paragraphs.join(' ').match(/\{[^}]*\}/g) ?? [],
    );
    expect([...new Set(placeholders)].sort()).toEqual(['{aepd}', '{email}']);
    expect(duplicates(sections.map(s => s.title))).toEqual([]);
  });

  it('only lists phones from countries the phone analytics event can report', () => {
    expect(
      d.contact.phones
        .map(decodePhone)
        .filter(p => phoneCountry(p) === undefined),
    ).toEqual([]);
  });

  it('lists the primary location first, matching the JSON-LD address country', () => {
    const {addressCountry} = buildPersonJsonLd(d).mainEntity.address;
    const countryName = new Intl.DisplayNames([lang], {type: 'region'}).of(
      addressCountry,
    );
    expect(d.locations[0]?.name).toBe(countryName);
  });

  it('gives every rendered list item a unique React key', () => {
    expect({
      locations: duplicates(d.locations.map(l => l.link)),
      phones: duplicates(d.contact.phones),
      social: duplicates(d.contact.social.map(s => s.name)),
      work: duplicates(d.work.map(w => w.company)),
      workBadges: d.work.flatMap(w => duplicates(w.badges)),
      education: duplicates(d.education.map(e => e.school)),
      certifications: duplicates(
        d.certifications.map(c => `${c.title}-${c.issuer}`),
      ),
      projects: duplicates(d.projects.map(p => p.title)),
      projectTags: d.projects.flatMap(p => duplicates(p.techStack)),
      // Keys are per group, but a skill listed twice is a content bug too.
      skills: duplicates(d.skills.flatMap(s => s.items)),
    }).toEqual({
      locations: [],
      phones: [],
      social: [],
      work: [],
      workBadges: [],
      education: [],
      certifications: [],
      projects: [],
      projectTags: [],
      skills: [],
    });
  });

  it('has bullets for every job and items for every skill group', () => {
    expect(
      d.work.filter(w => w.description.length === 0).map(w => w.company),
    ).toEqual([]);
    expect(
      d.skills.filter(s => s.items.length === 0).map(s => s.category),
    ).toEqual([]);
  });

  it("never links a project's website to its own repository", () => {
    const sameLink = d.projects.filter(
      p => p.link && p.link.href === p.githubLink,
    );
    const notGitHub = d.projects.filter(
      p => p.githubLink && new URL(p.githubLink).hostname !== 'github.com',
    );
    expect({sameLink, notGitHub}).toEqual({sameLink: [], notGitHub: []});
  });

  describe('dates', () => {
    const year = /^\d{4}$/;
    const yearMonth = /^\d{4}-(0[1-9]|1[0-2])$/;
    // Ongoing entries (end: null) sort first, then by end month, then by start month.
    const month = (ym: string) => Number(ym.replace('-', ''));
    const recency = (x: {start: string; end: string | null}) =>
      (x.end === null ? 999999 : month(x.end)) * 1e6 + month(x.start);

    it.each([
      ['work', d.work],
      ['education', d.education],
    ] as const)('%s: dates are YYYY-MM and start <= end', (_section, items) => {
      const invalid = items.filter(
        x =>
          !yearMonth.test(x.start) ||
          (x.end !== null && (!yearMonth.test(x.end) || x.start > x.end)),
      );
      expect(invalid).toEqual([]);
    });

    it.each([
      ['work', d.work.map(recency)],
      ['education', d.education.map(recency)],
      ['certifications', d.certifications.map(c => Number(c.year))],
    ] as const)('%s: newest first', (_section, keys) => {
      expect(keys).toEqual([...keys].sort((a, b) => b - a));
    });

    it('certification years are valid', () => {
      expect(d.certifications.filter(c => !year.test(c.year))).toEqual([]);
    });
  });
});

describe('EN/ES parity', () => {
  // Text a translator must change. Everything else (names, dates, URLs, logos,
  // tech names) must stay identical, so a new field defaults to "identical"
  // until it is deliberately declared translatable here.
  const TRANSLATED = [
    /^summary$/,
    /^locations\[\d+\]\.name$/,
    /^education\[\d+\]\.degree$/,
    /^work\[\d+\]\.(badges|description)\[\d+\]$/,
    /^skills\[\d+\]\.category$/,
    /^languages\[\d+\]\.(language|proficiency)$/,
    /^projects\[\d+\]\.description$/,
    /^ui\./,
  ];
  // Translatable, but legitimately identical in both languages: role titles stay
  // in English ("QA Engineer", the "QA Consultant | AI-Augmented SDET" headline).
  const MAY_MATCH = [/^about$/, /^work\[\d+\]\.title$/];

  const is = (patterns: RegExp[]) => (path: string) =>
    patterns.some(p => p.test(path));
  const en = new Map(leaves(EN));
  const es = new Map(leaves(ES));

  it('has the same shape in both languages', () => {
    const shape = (m: Map<string, unknown>) =>
      [...m]
        .map(([path, v]) => `${path}: ${v === null ? 'null' : typeof v}`)
        .sort();
    expect(shape(es)).toEqual(shape(en));
  });

  it('translates every text field', () => {
    const untranslated = [...es].filter(
      ([path, v]) => is(TRANSLATED)(path) && v === en.get(path),
    );
    expect(untranslated).toEqual([]);
  });

  it('keeps every non-text field identical', () => {
    const changed = [...es].filter(
      ([path, v]) =>
        !is(TRANSLATED)(path) && !is(MAY_MATCH)(path) && v !== en.get(path),
    );
    expect(changed).toEqual([]);
  });
});

describe('isLang', () => {
  it.each([
    ['en', true],
    ['es', true],
    ['EN', false],
    ['fr', false],
    ['', false],
    [null, false],
    [undefined, false],
    [1, false],
  ])('isLang(%p) is %p', (value, expected) => {
    expect(isLang(value)).toBe(expected);
  });
});
