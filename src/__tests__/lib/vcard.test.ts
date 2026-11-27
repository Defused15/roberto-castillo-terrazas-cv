/** @jest-environment @stryker-mutator/jest-runner/jest-env/node */
import {RESUME_DATA, RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {encodePhone} from '@/lib/decode-phone';
import {buildVCard, escapeVCard} from '@/lib/vcard';
import {dynamic, GET} from '@/app/contact.vcf/route';

const unfold = (s: string) => s.replace(/\r\n /g, '');
const lines = (s: string) => unfold(s).split('\r\n');

describe('escapeVCard', () => {
  it('escapes backslash, comma, semicolon and every kind of newline', () => {
    expect(escapeVCard('a,b;c\\d\ne\r\nf\rg')).toBe(
      'a\\,b\;c\\\\d\\ne\\nf\\ng',
    );
  });

  it('leaves plain text alone', () => {
    expect(escapeVCard('QA Engineer | SDET')).toBe('QA Engineer | SDET');
  });
});

describe('buildVCard', () => {
  const card = buildVCard(RESUME_DATA);

  it('is a vCard 3.0 with CRLF line endings and a trailing CRLF', () => {
    expect(card.startsWith('BEGIN:VCARD\r\nVERSION:3.0\r\n')).toBe(true);
    expect(card.endsWith('END:VCARD\r\n')).toBe(true);
    expect(card.replace(/\r\n/g, '')).not.toMatch(/[\r\n]/);
  });

  it('has every field', () => {
    const l = lines(card);
    expect(l).toContain('FN:Roberto Castillo');
    expect(l).toContain('N:Castillo;Roberto;;;');
    expect(l).toContain(`TITLE:${RESUME_DATA.about.replace(/,/g, '\\,')}`);
    expect(l).toContain(`EMAIL;TYPE=INTERNET:${RESUME_DATA.contact.email}`);
    expect(l).toContain('URL:https://www.rcastillo.dev');
    expect(l).toContain('URL:https://github.com/Defused15');
    expect(l).toContain('URL:https://www.linkedin.com/in/rocastil/');
    expect(
      l.some(x => x.startsWith('NOTE:') && x.includes('rcastillo.dev')),
    ).toBe(true);
  });

  it('decodes the stored phones into CELL numbers', () => {
    const l = lines(card);
    expect(l).toContain('TEL;TYPE=CELL:+34610831754');
    expect(l).toContain('TEL;TYPE=CELL:+528711053221');
    expect(l.filter(x => x.startsWith('TEL'))).toHaveLength(
      RESUME_DATA.contact.phones.length,
    );
  });

  it('escapes values and folds long lines', () => {
    const data = {
      ...RESUME_DATA,
      name: 'Ada Lovelace Byron',
      about: 'x'.repeat(200) + ', a;b',
      contact: {...RESUME_DATA.contact, phones: [encodePhone('+1')]},
    };
    const out = buildVCard(data);
    expect(out.split('\r\n').every(x => x.length <= 75)).toBe(true);
    expect(lines(out)).toContain('N:Lovelace Byron;Ada;;;');
    expect(lines(out).find(x => x.startsWith('TITLE:'))).toBe(
      `TITLE:${'x'.repeat(200)}\\, a\;b`,
    );
  });

  it.each([
    [75, ['TITLE:' + 'x'.repeat(69)]],
    [76, ['TITLE:' + 'x'.repeat(69), ' x']],
    [149, ['TITLE:' + 'x'.repeat(69), ' ' + 'x'.repeat(74)]],
    [150, ['TITLE:' + 'x'.repeat(69), ' ' + 'x'.repeat(74), ' x']],
  ])('folds a %i-character line into 75-character pieces', (length, folded) => {
    const out = buildVCard({...RESUME_DATA, about: 'x'.repeat(length - 6)});
    const start = out.split('\r\n').findIndex(x => x.startsWith('TITLE:'));
    expect(out.split('\r\n').slice(start, start + folded.length + 1)).toEqual([
      ...folded,
      expect.stringMatching(/^EMAIL/),
    ]);
  });

  it('works for the Spanish data too', () => {
    expect(buildVCard(RESUME_DATA_BY_LANG.es)).toContain('FN:');
  });
});

describe('GET /contact.vcf', () => {
  it('is static and serves the card as a download', async () => {
    expect(dynamic).toBe('force-static');
    const res = GET();
    expect(res.headers.get('Content-Type')).toBe('text/vcard; charset=utf-8');
    expect(res.headers.get('Content-Disposition')).toBe(
      'attachment; filename="roberto-castillo.vcf"',
    );
    expect(await res.text()).toBe(buildVCard(RESUME_DATA));
  });
});
