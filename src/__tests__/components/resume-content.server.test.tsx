/** @jest-environment node */
import {renderToString} from 'react-dom/server';
import Page from '@/app/page';
import {ResumeView} from '@/components/resume-content';
import {LANGS, RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {AS_OF} from '@/test/dates';

/**
 * The server HTML is what scrapers read. The phone numbers are only assembled
 * in the browser after a click (or just before printing), so they must not be
 * in it, neither as digits nor as tel: links.
 */
describe('server-rendered HTML', () => {
  it.each(LANGS)('[%s] contains no phone number and no tel: link', lang => {
    const html = renderToString(
      <ResumeView data={RESUME_DATA_BY_LANG[lang]} lang={lang} asOf={AS_OF} />,
    );
    expect(html).toContain(RESUME_DATA_BY_LANG[lang].ui.contact.showPhones);
    for (const secret of [
      '610 831',
      '+34610831754',
      '871 105',
      '+528711053221',
      'tel:',
    ]) {
      expect(html).not.toContain(secret);
    }
  });

  it('the home page, JSON-LD included, contains no phone number', async () => {
    const html = renderToString(await Page());
    expect(html).not.toMatch(/610 ?831|871 ?105|tel:/);
  });
});
