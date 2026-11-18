import {encodeQR, QR_QUIET_ZONE} from '@/lib/qr';

/**
 * Golden matrix for "https://www.rcastillo.dev" (version 2-M). It was decoded back to the
 * URL with an independent decoder (jsQR) and its size matches the `qrcode` package's output;
 * those tools are not dependencies, so the matrix is pinned here as a regression check.
 */
const GOLDEN = [
  '1111111011000010001111111',
  '1000001011110110001000001',
  '1011101011000111001011101',
  '1011101001110100001011101',
  '1011101010100110101011101',
  '1000001001000010001000001',
  '1111111010101010101111111',
  '0000000001100111000000000',
  '1001111111011011010010111',
  '1001100000100111010111110',
  '0110011010101001101101001',
  '0111010101010000100101111',
  '0110111010011001101000001',
  '1111000111100011110010010',
  '1101011010111011011011111',
  '1001110010110001110101101',
  '1010111011101111111110110',
  '0000000011011100100010110',
  '1111111011011000101010001',
  '1000001011010111100010011',
  '1011101011000011111110000',
  '1011101010110010001000011',
  '1011101001110001010011111',
  '1000001000110001000110111',
  '1111111011011000110001001',
];

const toRows = (m: boolean[][]) =>
  m.map(r => r.map(c => (c ? '1' : '0')).join(''));

describe('encodeQR', () => {
  it('matches the verified matrix for the site URL', () => {
    expect(toRows(encodeQR('https://www.rcastillo.dev'))).toEqual(GOLDEN);
  });

  it.each([
    ['a', 21],
    ['x'.repeat(14), 21],
    ['x'.repeat(15), 25],
    ['x'.repeat(26), 25],
    ['x'.repeat(27), 29],
    ['x'.repeat(42), 29],
    ['x'.repeat(43), 33],
    ['x'.repeat(62), 33],
    ['ñandú €', 21],
  ])('picks the smallest version: %j fits %i modules', (text, size) => {
    const m = encodeQR(text);
    expect(m).toHaveLength(size);
    expect(m.every(r => r.length === size)).toBe(true);
  });

  it.each([['a'], ['https://www.rcastillo.dev'], ['x'.repeat(62)]])(
    'has the fixed patterns for %j',
    text => {
      const m = encodeQR(text);
      const n = m.length;
      const finder = [
        '1111111',
        '1000001',
        '1011101',
        '1011101',
        '1011101',
        '1000001',
        '1111111',
      ];
      for (const [ox, oy] of [
        [0, 0],
        [n - 7, 0],
        [0, n - 7],
      ]) {
        expect(
          m.slice(oy, oy + 7).map(r =>
            r
              .slice(ox, ox + 7)
              .map(c => (c ? '1' : '0'))
              .join(''),
          ),
        ).toEqual(finder);
      }
      // Timing patterns alternate between the finders.
      for (let i = 8; i < n - 8; i++) {
        expect(m[6][i]).toBe(i % 2 === 0);
        expect(m[i][6]).toBe(i % 2 === 0);
      }
      // Separators around the finders are light; the dark module is dark.
      for (let i = 0; i < 8; i++) {
        expect(m[7][i]).toBe(false);
        expect(m[i][7]).toBe(false);
      }
      expect(m[n - 8][8]).toBe(true);
    },
  );

  it('is deterministic and rejects text that does not fit', () => {
    expect(encodeQR('hello')).toEqual(encodeQR('hello'));
    expect(() => encodeQR('x'.repeat(63))).toThrow(RangeError);
  });

  it('uses the standard four-module quiet zone', () => {
    expect(QR_QUIET_ZONE).toBe(4);
  });
});
