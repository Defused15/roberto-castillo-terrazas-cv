/** @jest-environment @stryker-mutator/jest-runner/jest-env/node */
import {existsSync} from 'fs';
import {join} from 'path';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import manifest from '@/app/manifest';
import {
  BUILD_MONTH,
  OG_HIGHLIGHTS,
  OG_VALUE_LINE,
  SITE_TITLE,
  SITE_URL,
  siteMetadata,
  siteViewport,
} from '@/app/site-config';
import {
  LANGS,
  RESUME_DATA,
  RESUME_DATA_BY_LANG,
  experienceClaim,
  withExperience,
} from '@/data/resume-data';
import {monthStart, toYearMonth} from '@/lib/dates';

const inPublic = (url: string) =>
  existsSync(join(process.cwd(), 'public', url));
const origin = new URL(SITE_URL).origin;

describe('robots.txt', () => {
  it('lets every crawler in and points it at the sitemap on the canonical host', () => {
    const {rules, sitemap: sitemapUrl, host} = robots();
    expect([rules].flat()).toContainEqual(
      expect.objectContaining({userAgent: '*', allow: '/'}),
    );
    expect(sitemapUrl).toBe(`${SITE_URL}/sitemap.xml`);
    expect(host).toBe(SITE_URL);
  });

  it('does not disallow any path (the old /graphql route no longer exists)', () => {
    const rules = [robots().rules].flat();
    expect(rules.filter(r => r.disallow !== undefined)).toEqual([]);
  });
});

describe('sitemap.xml', () => {
  it('lists the home page and only https URLs on the canonical host', () => {
    const urls = sitemap().map(e => new URL(e.url));
    expect(urls.map(u => u.href)).toEqual([
      `${SITE_URL}/`,
      `${SITE_URL}/privacy`,
    ]);
    expect(
      urls.filter(u => u.protocol !== 'https:' || u.origin !== origin),
    ).toEqual([]);
  });
});

describe('web manifest', () => {
  it('is named after the site and only references icons that exist in /public', () => {
    const {name, icons = []} = manifest();
    expect(name).toBe(SITE_TITLE);
    expect(icons.map(i => i.src).filter(src => !inPublic(src))).toEqual([]);
  });

  it('uses white app icons that launchers may mask, on a white background', () => {
    const {icons = [], background_color, theme_color} = manifest();
    const purposes = (src: string) =>
      icons
        .filter(i => i.src === src)
        .map(i => i.purpose)
        .sort();
    expect([...new Set(icons.map(i => i.src))].map(purposes)).toEqual([
      ['any', 'maskable'],
      ['any', 'maskable'],
    ]);
    expect([background_color, theme_color]).toEqual(['#ffffff', '#ffffff']);
  });
});

describe('site metadata', () => {
  it('resolves relative URLs against the canonical https host', () => {
    // Next 16 types metadataBase as string | URL; normalise before checking.
    const base = new URL(String(siteMetadata.metadataBase));
    expect(base.origin).toBe(origin);
    expect(base.protocol).toBe('https:');
    expect(siteMetadata.alternates?.canonical).toBe('/');
  });

  it('titles pages with the visible name and headline', () => {
    expect(SITE_TITLE).toBe(`${RESUME_DATA.name} — ${RESUME_DATA.about}`);
    expect(siteMetadata.title).toEqual({
      default: SITE_TITLE,
      template: `%s | ${RESUME_DATA.name}`,
    });
  });

  it('has a description that fits a search snippet', () => {
    expect(siteMetadata.description?.trim()).toBeTruthy();
    expect(siteMetadata.description!.length).toBeLessThanOrEqual(165);
  });

  it('is indexable', () => {
    expect(siteMetadata.robots).toMatchObject({index: true, follow: true});
  });

  it('shares as a profile card with an Open Graph locale for every site language', () => {
    expect(siteMetadata.openGraph).toMatchObject({
      type: 'profile',
      title: SITE_TITLE,
    });
    expect(siteMetadata.twitter).toMatchObject({
      card: 'summary_large_image',
      title: SITE_TITLE,
    });
    const og = siteMetadata.openGraph as {
      locale?: string;
      alternateLocale?: string[];
    };
    const locales = [og.locale, ...(og.alternateLocale ?? [])];
    expect(locales.filter(l => !/^[a-z]{2}_[A-Z]{2}$/.test(l ?? ''))).toEqual(
      [],
    );
    expect(og.locale?.slice(0, 2)).toBe(LANGS[0]);
    expect(
      LANGS.filter(lang => !locales.some(l => l?.startsWith(`${lang}_`))),
    ).toEqual([]);
  });

  it('only references icons that exist in /public', () => {
    const icons = [siteMetadata.icons].flat() as {url: string}[];
    expect(icons.length).toBeGreaterThan(0);
    expect(icons.map(i => i.url).filter(url => !inPublic(url))).toEqual([]);
  });

  it('offers the SVG icon first, keeping the .ico and PNGs as fallbacks', () => {
    const icons = [siteMetadata.icons].flat() as {url: string; type?: string}[];
    expect(icons[0]).toMatchObject({url: '/icon.svg', type: 'image/svg+xml'});
    expect(icons.map(i => i.url)).toEqual(
      expect.arrayContaining(['/favicon.ico', '/favicon-32x32.png']),
    );
  });

  it('sets a valid theme colour for both light and dark schemes', () => {
    const colors = [siteViewport.themeColor].flat() as {
      media?: string;
      color: string;
    }[];
    const schemes = colors.map(
      c => c.media?.match(/prefers-color-scheme: (\w+)/)?.[1],
    );
    expect(schemes.sort()).toEqual(['dark', 'light']);
    expect(colors.filter(c => !/^#[0-9a-f]{6}$/i.test(c.color))).toEqual([]);
  });
});

describe('open graph card copy', () => {
  it('highlights Playwright, AI and API testing in 4-5 chips', () => {
    expect(OG_HIGHLIGHTS.length).toBeGreaterThanOrEqual(4);
    expect(OG_HIGHLIGHTS.length).toBeLessThanOrEqual(5);
    expect(OG_HIGHLIGHTS).toContain('Playwright');
    expect(OG_HIGHLIGHTS.some(h => /\bAI\b/.test(h))).toBe(true);
    expect(OG_HIGHLIGHTS.some(h => /\bAPI\b/.test(h))).toBe(true);
  });
  const built = monthStart(BUILD_MONTH);
  const claim = experienceClaim('en', built);

  it('dates the site to the month it was built', () => {
    expect(BUILD_MONTH).toBe(toYearMonth(new Date()));
  });
  it('leads the value line with experience, then the business card tagline', () => {
    expect(OG_VALUE_LINE).toBe(
      `${claim} · AI-driven QA for faster, safer releases`,
    );
    expect(claim).toMatch(/^\d+\+ years$/);
  });
  it('states the same years of experience as the summaries and description', () => {
    expect(OG_VALUE_LINE.startsWith(claim)).toBe(true);
    expect(siteMetadata.description).toContain(` ${claim} `);
    expect(
      withExperience(RESUME_DATA_BY_LANG.en.summary, 'en', built),
    ).toContain(` ${claim} `);
    expect(
      withExperience(RESUME_DATA_BY_LANG.es.summary, 'es', built),
    ).toContain(` ${experienceClaim('es', built)} `);
    // Same number in both languages.
    expect(experienceClaim('es', built)).toContain(claim.match(/\d+/)![0]);
  });
});
