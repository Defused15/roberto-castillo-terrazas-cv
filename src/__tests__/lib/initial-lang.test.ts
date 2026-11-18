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
    // Only the primary subtag counts: Basque in Spain is not Spanish.
    [null, ['eu-ES'], 'en'],
    [null, [' es-MX '], 'es'],
  ])('stored %p with %p gives %s', (stored, languages, expected) => {
    expect(pickInitialLang(stored, languages)).toBe(expected);
  });
});
