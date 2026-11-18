import {pickInitialLang} from '@/lib/initial-lang';

describe('pickInitialLang', () => {
  it.each([
    ['en', ['es-ES'], 'en'],
    ['es', ['en-US'], 'es'],
    [null, ['es'], 'es'],
    [null, ['es-MX', 'en'], 'es'],
    [null, ['en-US', 'es-ES'], 'es'],
    [null, ['ES-ar'], 'es'],
    [null, ['en-US'], 'en'],
    [null, ['fr', 'de'], 'en'],
    [null, [], 'en'],
    ['fr', ['es'], 'es'],
    ['', ['en'], 'en'],
    ['xx', [], 'en'],
    [null, ['esperanto'], 'en'],
  ])('stored %p with %p gives %s', (stored, languages, expected) => {
    expect(pickInitialLang(stored, languages)).toBe(expected);
  });
});
