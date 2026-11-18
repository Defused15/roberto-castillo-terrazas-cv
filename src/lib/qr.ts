/**
 * Minimal QR Code encoder: byte mode, error correction level M, versions 1 to 4
 * (up to 62 bytes). Written for one short URL; it throws on longer input.
 * Layout, masking and Reed-Solomon follow ISO/IEC 18004.
 */

/** Quiet zone, in modules, that a QR code needs around it to scan. */
export const QR_QUIET_ZONE = 4;

/** Per version at level M: [blocks, data codewords per block, EC codewords per block]. */
const BLOCKS_M = [
  [1, 16, 10],
  [1, 28, 16],
  [1, 44, 26],
  [2, 32, 18],
] as const;

/** Center of the single alignment pattern of versions 2 to 4. */
const ALIGNMENT_CENTER = [0, 18, 22, 26] as const;

const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
for (let i = 0, x = 1; i < 255; i++) {
  EXP[i] = x;
  LOG[x] = i;
  x <<= 1;
  if (x & 0x100) x ^= 0x11d;
}
for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];

const gfMul = (a: number, b: number) =>
  a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]];

/** Reed-Solomon remainder of `data` for `degree` EC codewords. */
function reedSolomon(data: readonly number[], degree: number): number[] {
  let gen = [1];
  for (let i = 0; i < degree; i++) {
    const next = new Array<number>(gen.length + 1).fill(0);
    gen.forEach((c, j) => {
      next[j] ^= c;
      next[j + 1] ^= gfMul(c, EXP[i]);
    });
    gen = next;
  }
  const rem = new Array<number>(degree).fill(0);
  for (const byte of data) {
    const factor = byte ^ rem.shift()!;
    rem.push(0);
    for (let i = 0; i < degree; i++) rem[i] ^= gfMul(gen[i + 1], factor);
  }
  return rem;
}

function utf8(text: string): number[] {
  return encodeURIComponent(text)
    .split(/(%[0-9A-F]{2})/)
    .flatMap(part =>
      /^%/.test(part)
        ? [parseInt(part.slice(1), 16)]
        : Array.from(part, c => c.charCodeAt(0)),
    );
}

/** Data codewords (mode, length, bytes, terminator, padding) then EC, interleaved. */
function buildCodewords(bytes: readonly number[], version: number): number[] {
  const [blocks, dataPer, ecPer] = BLOCKS_M[version - 1];
  const capacity = blocks * dataPer;
  const bits: number[] = [];
  const push = (value: number, count: number) => {
    for (let i = count - 1; i >= 0; i--) bits.push((value >>> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, 8);
  bytes.forEach(b => push(b, 8));
  push(0, Math.min(4, capacity * 8 - bits.length));
  push(0, (8 - (bits.length % 8)) % 8);
  const data: number[] = [];
  for (let i = 0; i < bits.length; i += 8)
    data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  for (let pad = 0xec; data.length < capacity; pad ^= 0xec ^ 0x11)
    data.push(pad);

  const dataBlocks = Array.from({length: blocks}, (_, i) =>
    data.slice(i * dataPer, (i + 1) * dataPer),
  );
  const ecBlocks = dataBlocks.map(b => reedSolomon(b, ecPer));
  const out: number[] = [];
  for (let i = 0; i < dataPer; i++) dataBlocks.forEach(b => out.push(b[i]));
  for (let i = 0; i < ecPer; i++) ecBlocks.forEach(b => out.push(b[i]));
  return out;
}

type Grid = boolean[][];

const MASKS: readonly ((x: number, y: number) => boolean)[] = [
  (x, y) => (x + y) % 2 === 0,
  (_x, y) => y % 2 === 0,
  x => x % 3 === 0,
  (x, y) => (x + y) % 3 === 0,
  (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0,
  (x, y) => ((x * y) % 2) + ((x * y) % 3) === 0,
  (x, y) => (((x * y) % 2) + ((x * y) % 3)) % 2 === 0,
  (x, y) => (((x + y) % 2) + ((x * y) % 3)) % 2 === 0,
];

/** 15 format bits for level M and `mask`, BCH-protected and XOR-masked. */
function formatBits(mask: number): number {
  let rem = mask; // level M is 0b00, so the 5 data bits are just the mask
  for (let i = 0; i < 10; i++) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
  return ((mask << 10) | rem) ^ 0x5412;
}

function penalty(m: Grid): number {
  const n = m.length;
  let score = 0;
  let dark = 0;
  for (let a = 0; a < n; a++) {
    for (const get of [(i: number) => m[a][i], (i: number) => m[i][a]]) {
      let run = 1;
      for (let i = 1; i < n; i++) {
        if (get(i) === get(i - 1)) run++;
        else {
          if (run >= 5) score += run - 2;
          run = 1;
        }
      }
      if (run >= 5) score += run - 2;
      const line = Array.from({length: n}, (_, i) => (get(i) ? '1' : '0')).join(
        '',
      );
      score +=
        40 *
        (line.split('10111010000').length -
          1 +
          line.split('00001011101').length -
          1);
    }
    for (let b = 0; b < n; b++) if (m[a][b]) dark++;
  }
  for (let y = 0; y < n - 1; y++)
    for (let x = 0; x < n - 1; x++)
      if (
        m[y][x] === m[y][x + 1] &&
        m[y][x] === m[y + 1][x] &&
        m[y][x] === m[y + 1][x + 1]
      )
        score += 3;
  return score + Math.floor(Math.abs((dark * 100) / (n * n) - 50) / 5) * 10;
}

/**
 * Encodes `text` (UTF-8) as a QR code. Returns the square module grid, `true`
 * for dark, without the quiet zone. Throws if it does not fit in version 4.
 */
export function encodeQR(text: string): boolean[][] {
  const bytes = utf8(text);
  const version = BLOCKS_M.findIndex(([b, d]) => bytes.length <= b * d - 2) + 1;
  if (version === 0)
    throw new RangeError('Text is too long for a version 4-M QR code');
  const size = 17 + 4 * version;
  const codewords = buildCodewords(bytes, version);

  const modules: Grid = Array.from({length: size}, () =>
    new Array<boolean>(size).fill(false),
  );
  const fixed: Grid = Array.from({length: size}, () =>
    new Array<boolean>(size).fill(false),
  );
  const set = (x: number, y: number, dark: boolean) => {
    modules[y][x] = dark;
    fixed[y][x] = true;
  };

  // Timing patterns.
  for (let i = 0; i < size; i++) {
    set(i, 6, i % 2 === 0);
    set(6, i, i % 2 === 0);
  }
  // Finder patterns with their separators.
  for (const [cx, cy] of [
    [3, 3],
    [size - 4, 3],
    [3, size - 4],
  ]) {
    for (let dy = -4; dy <= 4; dy++)
      for (let dx = -4; dx <= 4; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (x < 0 || y < 0 || x >= size || y >= size) continue;
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        set(x, y, dist !== 2 && dist !== 4);
      }
  }
  // Alignment pattern.
  if (version >= 2) {
    const c = ALIGNMENT_CENTER[version - 1];
    for (let dy = -2; dy <= 2; dy++)
      for (let dx = -2; dx <= 2; dx++)
        set(c + dx, c + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }
  // Format bits (and the dark module) depend on the mask; reserve their cells now, fill them at the end.
  const drawFormat = (grid: Grid, mask: number) => {
    const bits = formatBits(mask);
    const put = (x: number, y: number, dark: boolean) => {
      grid[y][x] = dark;
      fixed[y][x] = true;
    };
    const bit = (i: number) => ((bits >>> i) & 1) !== 0;
    for (let i = 0; i <= 5; i++) put(8, i, bit(i));
    put(8, 7, bit(6));
    put(8, 8, bit(7));
    put(7, 8, bit(8));
    for (let i = 9; i < 15; i++) put(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) put(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) put(8, size - 15 + i, bit(i));
    put(8, size - 8, true);
  };
  drawFormat(modules, 0);

  // Data, zigzag from the bottom right, skipping the timing column.
  const total = codewords.length * 8;
  let bitIndex = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    const upward = ((right + 1) & 2) === 0;
    for (let vert = 0; vert < size; vert++) {
      for (let j = 0; j < 2; j++) {
        const x = right - j;
        const y = upward ? size - 1 - vert : vert;
        if (fixed[y][x] || bitIndex >= total) continue;
        modules[y][x] =
          ((codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1) !== 0;
        bitIndex++;
      }
    }
  }

  // Pick the mask with the lowest penalty.
  let best: Grid = [];
  let bestScore = Infinity;
  let bestMask = 0;
  MASKS.forEach((fn, mask) => {
    const trial = modules.map(row => row.slice());
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++)
        if (!fixed[y][x] && fn(x, y)) trial[y][x] = !trial[y][x];
    const score = penalty(trial);
    if (score < bestScore) {
      best = trial;
      bestScore = score;
      bestMask = mask;
    }
  });
  drawFormat(best, bestMask);
  return best;
}
