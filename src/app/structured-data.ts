import type {ResumeData} from '@/data/resume-data.types';
import {SITE_DESCRIPTION, SITE_TITLE, SITE_URL} from './site-config';

const KNOWS_ABOUT = [
  'Software Quality Assurance',
  'Test Automation',
  'Playwright',
  'Cypress',
  'API Testing',
  'Contract Testing (Pact)',
  'Performance Testing (k6)',
  'Accessibility Testing (WCAG 2.1)',
  'CI/CD',
  'Model Context Protocol (MCP)',
];

/**
 * schema.org ProfilePage + Person. Deliberately excludes email and phone numbers.
 * The master's degree at Universidad de Almería is ongoing, so it is listed in
 * `alumniOf` too: schema.org has no "current student" property that Google reads,
 * and `alumniOf` is the closest signal that ties the person to the institution.
 */
export function buildPersonJsonLd(data: ResumeData) {
  const currentJob = data.work.find(w => w.end === null);

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    '@id': `${SITE_URL}/#profilepage`,
    url: SITE_URL,
    name: SITE_TITLE,
    inLanguage: 'en',
    mainEntity: {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: data.name,
      jobTitle: data.about,
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      image: `${SITE_URL}${data.avatarUrl}`,
      address: {'@type': 'PostalAddress', addressCountry: 'ES'},
      sameAs: data.contact.social.map(s => s.url),
      worksFor: currentJob
        ? {
            '@type': 'Organization',
            name: currentJob.company,
            url: currentJob.link,
          }
        : undefined,
      alumniOf: data.education.map(e => ({
        '@type': 'CollegeOrUniversity',
        name: e.school,
      })),
      knowsLanguage: ['en', 'es'],
      knowsAbout: KNOWS_ABOUT,
    },
  };
}

/** Serialises JSON-LD for an inline script tag; escapes `<` so `</script>` cannot break out. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
