import type {Metadata, Viewport} from 'next';
import {RESUME_DATA, experienceClaim} from '@/data/resume-data';
import {monthStart, toYearMonth} from '@/lib/dates';

export const SITE_URL = 'https://www.rcastillo.dev';
export const SITE_TITLE = `${RESUME_DATA.name} — ${RESUME_DATA.about}`;
/**
 * Month of the build. The site is static, so every date-derived text (years of
 * experience, job durations) is computed once from it at build time, and the
 * page gets it as a prop so the browser renders the same text when it hydrates.
 * The weekly scheduled CI run redeploys, which moves it forward.
 */
export const BUILD_MONTH = toYearMonth(new Date());

/** "4+ years" as of the build, shared by the description, the share card and the summary. */
const YEARS_CLAIM = experienceClaim('en', monthStart(BUILD_MONTH));

export const SITE_DESCRIPTION = `QA Consultant & SDET in Spain and Mexico with ${YEARS_CLAIM} across 20+ projects. Playwright and TypeScript, API and k6 testing, CI/CD and AI-assisted QA.`;

/** Short domain shown on the social share card. */
export const SITE_DOMAIN = 'rcastillo.dev';

/** One factual value line for the social share card (current industry first). */
export const OG_VALUE_LINE = `${YEARS_CLAIM} · 20+ projects · insurance, healthcare, e-commerce`;

/** Curated skill chips for the social share card (4 fit on one row). */
export const OG_HIGHLIGHTS = [
  'Playwright',
  'AI-augmented QA',
  'API testing',
  'CI/CD',
] as const;

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: `%s | ${RESUME_DATA.name}`,
  },
  description: SITE_DESCRIPTION,
  applicationName: RESUME_DATA.name,
  authors: [{name: RESUME_DATA.name, url: SITE_URL}],
  creator: RESUME_DATA.name,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'profile',
    firstName: 'Roberto',
    lastName: 'Castillo',
    url: '/',
    siteName: RESUME_DATA.name,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: 'en_US',
    alternateLocale: ['es_MX', 'es_ES'],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: [
    // Vector first: browsers that support SVG favicons pick it (it follows the
    // colour scheme); the .ico and PNGs remain as fallbacks.
    {rel: 'icon', url: '/icon.svg', type: 'image/svg+xml'},
    {rel: 'icon', url: '/favicon.ico'},
    {
      rel: 'apple-touch-icon',
      url: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      url: '/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/android-chrome-192x192.png',
      sizes: '192x192',
      type: 'image/png',
    },
    {
      rel: 'icon',
      url: '/android-chrome-512x512.png',
      sizes: '512x512',
      type: 'image/png',
    },
  ],
};

export const siteViewport: Viewport = {
  themeColor: [
    {media: '(prefers-color-scheme: light)', color: '#ffffff'},
    {media: '(prefers-color-scheme: dark)', color: '#111827'},
  ],
};
