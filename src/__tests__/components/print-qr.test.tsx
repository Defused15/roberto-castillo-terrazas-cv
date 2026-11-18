import {render} from '@testing-library/react';
import {PrintQr, PRINT_QR_URL, qrPath} from '@/components/print-qr';
import {QR_QUIET_ZONE, encodeQR} from '@/lib/qr';

/** Turns the path back into the module grid it draws (each run is "Mx yhNv1h-Nz"). */
function modulesFromPath(d: string, size: number): boolean[][] {
  const grid = Array.from({length: size}, () => Array(size).fill(false));
  for (const [, x, y, n, back] of d.matchAll(/M(\d+) (\d+)h(\d+)v1h-(\d+)z/g)) {
    expect(back).toBe(n);
    for (let i = 0; i < Number(n); i++) {
      grid[Number(y) - QR_QUIET_ZONE][Number(x) - QR_QUIET_ZONE + i] = true;
    }
  }
  return grid;
}

describe('qrPath', () => {
  it('draws one rectangle per horizontal run, offset by the quiet zone', () => {
    const q = QR_QUIET_ZONE;
    expect(
      qrPath([
        [true, true, false, true],
        [false, false, false, false],
        [false, true, true, true],
      ]),
    ).toBe(
      `M${q} ${q}h2v1h-2zM${q + 3} ${q}h1v1h-1zM${q + 1} ${q + 2}h3v1h-3z`,
    );
  });

  it('draws nothing for an empty grid', () => {
    expect(qrPath([[false, false]])).toBe('');
  });
});

describe('PrintQr', () => {
  it('draws exactly the encoded URL as a 72px SVG inside a quiet zone, hidden from assistive tech', () => {
    const {container} = render(<PrintQr />);
    const svg = container.querySelector('svg')!;
    const modules = encodeQR(PRINT_QR_URL);
    const view = modules.length + 2 * QR_QUIET_ZONE;
    expect(svg).toHaveAttribute('viewBox', `0 0 ${view} ${view}`);
    expect(svg).toHaveClass('h-[72px]', 'w-[72px]', 'bg-white');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
    const paths = svg.querySelectorAll('path');
    expect(paths).toHaveLength(1);
    expect(paths[0]).toHaveAttribute('fill', '#000');
    expect(
      modulesFromPath(paths[0].getAttribute('d')!, modules.length),
    ).toEqual(modules);
  });
});
