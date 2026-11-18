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

/**
 * Matrices across versions 1-4, packed as hex (row by row, 1 = dark). Every one
 * was decoded back to its text with jsQR, and 12 of the 20 are bit-identical to
 * the `qrcode` package (the rest differ only in the mask its penalty picks).
 * Neither tool is a dependency, so the matrices are pinned here.
 */
const VERIFIED: readonly [string, string][] = [
  [
    'https://www.rcastillo.dev',
    'fec23fc17b106eb1cbb74e85dbaa6aec121107faaafe00ce009fdb4bcc13af99aa6d2eaa12f6e99a0f8f1e4b5aedbf3963adaeeffb006e45bfb62a305af13bac3f85d5910ee9c53f046237fed8c48',
  ],
  [
    'a',
    'feebfc15506e8ebb75a5dba12ec10d07faafe01b00b75a5d07f226ac1b3967cbe692006923fa65105836ba2f8dd79faebac1044a5fec480',
  ],
  [
    'A1',
    'fe5bfc14106e9cbb74b5dbadaec11907faafe00800aa689688aa7ed5da103b863d7280411bf9a2704447baeaadd0aaaeaddb047bafed778',
  ],
  [
    'hello world',
    'fe5bfc11106ebcbb75d5dbaaaec14907faafe01400be53e36aff6bdb9d48b9c17ce0805467f848d050afba930dd67e2eb24904d9cfeda90',
  ],
  [
    'x'.repeat(14),
    'fe3bfc17106e8ebb74e5dba8aec13907faafe00600aa4092667750deef3aa22bae44005777f8eef04623bae455d277aeaeeb04222fee458',
  ],
  [
    'y'.repeat(15),
    'fea1bfc133506ea4ebb74a45dba672ec160907faaafe00b700a33e92de0739f9f852b40289aef8c212e14f9fca3d2a3b749ae246f90063c5ffa42ab040b1bba7df85d14ad2eabc2f043768fec6b08',
  ],
  [
    'z'.repeat(26),
    'fe7d3fc132d06e946bb74355dba11aec151907faaafe00a10096c750441d535c9284f0a0c61135d741e2b1a628f322a9c8f3f791fe007c47ff8bea7058117ba26fd5d55c72e8ab2b042d60fef5858',
  ],
  [
    'w'.repeat(27),
    'fe099bfc1202506eb0a6bb75f195dba871aec17be507faaaafe01ea300be634be0a90cde61de12584be53793e88c9666078de5cf5f258f00a37933334966e14cde6ad012590945379aad8afe007bbc67f97f6b9053af19bae30ffdd6cdca2eab0cfd04dd32afe84b3e0',
  ],
  [
    'v'.repeat(42),
    'fe229bfc11ba106eb62ebb755f95dbab29aec173a107faaaafe0151700be67cbe44d14de78fbd00968917fb0647c9620f14de6ef5d00858517fb422fc966c614de61b9d00970c17fb862fcfe00614c67f8dd6a9057171bbaf9cffdd7244aeeb554ed049570afeddd7e0',
  ],
  [
    'u'.repeat(43),
    'fedc443fc12844506eb7554bb74e0005dba6d552ec17d99907faaaaafe00b77700a3300012f8a3fffad694444aa928999aa860555a0f65e003adfce554aaaaf445aac7b91120cafbddfafbeb5dcaa9a1955aa53b3ff2094ab55faf1f3b34aa02db75abeb5801f9005fffc6ffb4c42ab04a59b1aba4355f8dd3500ae6eaf5522f049847a8fecf10a88',
  ],
  [
    't'.repeat(62),
    'fe69113fc143bb906e9a888bb7467775dbae9112ec13bbb907faaaaafe001bbb00aa344409307777506cca223ae912bbb82a2b244758e9077507188223af9aebbb8247524475ee92775040da223af790fbb828b1e4475bee47750619e223aea02bbb838e8244fd007777447f85226af044bb912baaa44fddd2577846eb0a276b043bb922fe9045bd8',
  ],
  [
    'mailto:rct18130984@gmail.com',
    'fe54f3fc11ba506e9f30bb74be65dba06e2ec16f1907faaaafe009490096b135048f9859c7a8343cfba60147730cb44850acaaecc68a7824de602f87d9438b8a90ead912b652cbdc19a9a8ff0046c47ff9dc2b50589716ba032fd5d4dc346e88032b04d21d2fedc1cd0',
  ],
  [
    'Versión en línea ✓',
    'fee0bfc14d506e9d8bb754a5dba4baec12e507faaafe01af00b763a596f04ab7d9a297b00aebad06b809ab4d3bbdf57818301392fa005744bfbf6a705531fba3dfb5d7696eeaf7fd048010feaa238',
  ],
  [
    'https://github.com/Defused15',
    'fec1c3fc1584d06ea062bb74f195dba93d2ec13cd507faaaafe007b2009fe454bea5a5ad8f8b72682af99e91b959b08c9f59feb8927aae2e26350b0abc45c7b685b3cc5c33d8a424cfbb7eff00450463fb296b105f6b11baf67fc5d42320ae97d36f04fdc6dfe975a80',
  ],
  [
    '0123456789',
    'fe53fc16506e9abb7465dbafaec12907faafe00c00aa4896e3864abd3a63bbad215c805367f92a30408bbaadc5d0b6aeb5b3043aafed3d8',
  ],
  [
    'The quick brown fox jumps over the lazy dog!',
    'fe1d553fc11390d06e9b0d8bb74bfdc5dba0638aec17dd9507faaaaafe0013ca0096c485d062126673e3b58e34a18097e7b96b2aab022c3941468aef540c6145d97a425dcc28caac74e29bfd932fe62440418738159d538f2aa7233ec2c14ad1023b2b93c0c5f9004a3fc6ff9ebaabd05badd12ba5628fddd6edb37ae927f26b0478ff90fed3b48d0',
  ],
  [
    'https://www.rcastillo.dev/contact.vcf',
    'fed663fc13f5106ea9b8bb74a0e5dba626aec1571507faaaafe00ab700a3550929a70df8fee7e7db11d71783a0eab096fbad0caa06783ba895e0870d0a09860cd9fb91cd9253a64a0fe3f8fd004fe477fbe42a30428712ba359fcdd34e2f6eb1e2270439338fed50888',
  ],
  [
    'ñ',
    'fe43fc12106eb2bb7545dbafaec14507faafe01300be6be26449cead3a7a437b294a007f23f92c7057c9baa925d4492ebd3904434fef4f0',
  ],
  [
    'https://www.linkedin.com/in/rocastil/',
    'fe27f3fc10fd506e8494bb74c865dba53e2ec16cdd07faaaafe008bf0096e3b5060624326dd7979ca26b4b647325e5d8670e82bfb9a1e9880e0af7d4cd1147f63a65e0934649179838bd0afa00794c5ff9432a505f451cba38cf9dd66397ae890c3b048dbd2feb34f90',
  ],
  [
    'QA Engineer | AI-Augmented SDET',
    'fe0f23fc154a506eaeaabb757695dba271aec1334507faaaafe01f850082835675e651af539e02b16be7318060e1f5e0d71d758a5e30c418d45ff3db69364705ce35e3bda378e74ba9a900fb0076444ff9ddab1045931bba2d5fc5d245a3ae8a676d043043dfeb701a0',
  ],
];

const toHex = (m: boolean[][]) => {
  const bits = m.flat();
  let hex = '';
  for (let i = 0; i < bits.length; i += 4) {
    let v = 0;
    for (let j = 0; j < 4; j++) v = v * 2 + (bits[i + j] ? 1 : 0);
    hex += v.toString(16);
  }
  return hex;
};

const toRows = (m: boolean[][]) =>
  m.map(r => r.map(c => (c ? '1' : '0')).join(''));

describe('encodeQR', () => {
  it('matches the verified matrix for the site URL', () => {
    expect(toRows(encodeQR('https://www.rcastillo.dev'))).toEqual(GOLDEN);
  });

  it.each(VERIFIED)('matches the verified matrix for %j', (text, hex) => {
    expect(toHex(encodeQR(text))).toBe(hex);
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
