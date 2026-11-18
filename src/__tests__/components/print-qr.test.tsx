import {PrintQr, PRINT_QR_URL} from '@/components/print-qr';
import {QR_QUIET_ZONE, encodeQR} from '@/lib/qr';
import {axe} from '@/test/axe';
import {renderWithProviders} from '@/test/render';

describe('PrintQr', () => {
  it.each([
    ['en', 'Live version: rcastillo.dev'],
    ['es', 'Versión en línea: rcastillo.dev'],
  ] as const)('captions the code in %s', (lang, caption) => {
    const {getByText} = renderWithProviders(<PrintQr />, {lang});
    expect(getByText(caption)).toBeInTheDocument();
  });

  it('shows only in print, as a 72px SVG of dark modules inside a quiet zone', async () => {
    const {container} = renderWithProviders(<PrintQr />);
    expect(container.firstElementChild).toHaveClass('hidden', 'print:block');
    const svg = container.querySelector('svg')!;
    const size = encodeQR(PRINT_QR_URL).length;
    expect(svg).toHaveAttribute(
      'viewBox',
      `0 0 ${size + 2 * QR_QUIET_ZONE} ${size + 2 * QR_QUIET_ZONE}`,
    );
    expect(svg).toHaveClass('h-[72px]', 'w-[72px]');
    const dark = encodeQR(PRINT_QR_URL).flat().filter(Boolean).length;
    expect(svg.querySelectorAll('rect')).toHaveLength(dark);
    const xs = [...svg.querySelectorAll('rect')].map(r =>
      Number(r.getAttribute('x')),
    );
    expect(Math.min(...xs)).toBe(QR_QUIET_ZONE);
    expect(Math.max(...xs)).toBe(QR_QUIET_ZONE + size - 1);
    expect(await axe(container)).toHaveNoViolations();
  });
});
