import {encodeQR, QR_QUIET_ZONE} from '@/lib/qr';

export const PRINT_QR_URL = 'https://www.rcastillo.dev';

/**
 * SVG path for the dark modules: one rectangle per horizontal run, offset by
 * the quiet zone. "M4 4h7v1h-7z" is a run of 7 modules at the top-left.
 */
export function qrPath(modules: readonly (readonly boolean[])[]): string {
  let d = '';
  modules.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      if (!row[x]) {
        x++;
        continue;
      }
      const from = x;
      while (row[x]) x++;
      const n = x - from;
      d += `M${from + QR_QUIET_ZONE} ${y + QR_QUIET_ZONE}h${n}v1h-${n}z`;
    }
  });
  return d;
}

/**
 * QR code to the live CV for the printed page. No hooks and no "use client":
 * the page renders it on the server and passes it to the CV, so the QR encoder
 * never reaches the browser bundle. The CV wraps it in a print-only figure.
 */
export function PrintQr() {
  const modules = encodeQR(PRINT_QR_URL);
  const view = modules.length + 2 * QR_QUIET_ZONE;
  return (
    <svg
      viewBox={`0 0 ${view} ${view}`}
      className="h-[72px] w-[72px] bg-white"
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      <path d={qrPath(modules)} fill="#000" />
    </svg>
  );
}
