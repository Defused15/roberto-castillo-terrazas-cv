/** @jest-environment node */
import {buildPersonJsonLd, serializeJsonLd} from '@/app/structured-data';
import {SITE_URL} from '@/app/site-config';
import {LANGS, RESUME_DATA, type ResumeData} from '@/data/resume-data';
import {decodePhone} from '@/lib/decode-phone';

const EN = RESUME_DATA;
const currentJob = EN.work.find(w => w.end === null)!;

describe('buildPersonJsonLd', () => {
  const ld = buildPersonJsonLd(EN);

  it('describes a schema.org ProfilePage whose main entity is the person', () => {
    expect(ld).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'ProfilePage',
      '@id': `${SITE_URL}/#profilepage`,
      url: SITE_URL,
      inLanguage: 'en',
      mainEntity: {
        '@type': 'Person',
        '@id': `${SITE_URL}/#person`,
        name: EN.name,
        jobTitle: EN.about,
        url: SITE_URL,
        image: `${SITE_URL}${EN.avatarUrl}`,
        address: {
          '@type': 'PostalAddress',
          addressCountry: expect.stringMatching(/^[A-Z]{2}$/),
        },
        sameAs: EN.contact.social.map(s => s.url),
        alumniOf: EN.education.map(e => ({
          '@type': 'CollegeOrUniversity',
          name: e.school,
        })),
        knowsLanguage: [...LANGS],
        worksFor: {
          '@type': 'Organization',
          name: currentJob.company,
          url: currentJob.link,
        },
      },
    });
  });

  it('never exposes the email address or phone numbers', () => {
    const json = JSON.stringify(ld);
    expect(json).not.toMatch(/telephone|email|mailto:|tel:/i);
    [EN.contact.email, ...EN.contact.phones.map(decodePhone)].forEach(secret =>
      expect(json).not.toContain(secret),
    );
  });

  it('lists distinct, non-empty knowsAbout topics', () => {
    const topics = ld.mainEntity.knowsAbout;
    expect(topics.length).toBeGreaterThan(0);
    expect(topics.filter(t => t.trim() === '')).toEqual([]);
    expect(new Set(topics).size).toBe(topics.length);
  });

  it('takes the employer from the ongoing job, wherever it is listed', () => {
    const reordered: ResumeData = {...EN, work: [...EN.work].reverse()};
    expect(buildPersonJsonLd(reordered).mainEntity.worksFor).toMatchObject({
      name: currentJob.company,
    });
  });

  it('omits the employer when no job is ongoing', () => {
    const ended: ResumeData = {
      ...EN,
      work: EN.work.map(w => ({...w, end: w.end ?? '2026-11'})),
    };
    expect(buildPersonJsonLd(ended).mainEntity.worksFor).toBeUndefined();
  });
});

describe('serializeJsonLd', () => {
  it('escapes < so a </script> in the data cannot close the script tag', () => {
    const payload = {name: '</script><script>alert(1)</script>'};
    const out = serializeJsonLd(payload);
    expect(out).not.toContain('<');
    expect(JSON.parse(out)).toEqual(payload);
  });
});
