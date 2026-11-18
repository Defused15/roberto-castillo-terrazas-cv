import {screen} from '@testing-library/react';
import {PrintButton} from '@/components/print-button';
import {RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {axe} from '@/test/axe';
import {renderWithProviders} from '@/test/render';
import {capturedEvents, startAnalytics} from '@/test/analytics';

describe('PrintButton', () => {
  beforeEach(startAnalytics);

  it.each(['en', 'es'] as const)('is named from the %s data', lang => {
    renderWithProviders(<PrintButton />, {lang});
    expect(
      screen.getByRole('button', {
        name: RESUME_DATA_BY_LANG[lang].ui.contact.print,
      }),
    ).toBeInTheDocument();
  });

  it('has the expected names', () => {
    expect(RESUME_DATA_BY_LANG.en.ui.contact.print).toBe(
      'Print or save as PDF',
    );
    expect(RESUME_DATA_BY_LANG.es.ui.contact.print).toBe(
      'Imprimir o guardar como PDF',
    );
  });

  it('opens the print dialog and tracks the click', async () => {
    const print = jest.fn();
    window.print = print;
    const {user} = renderWithProviders(<PrintButton />);
    await user.click(screen.getByRole('button'));
    expect(print).toHaveBeenCalledTimes(1);
    expect(capturedEvents()).toEqual([['print_cv_button', undefined]]);
  });

  it('is hidden when printing and has no axe violations', async () => {
    const {container} = renderWithProviders(<PrintButton />);
    expect(screen.getByRole('button')).toHaveClass('print:hidden');
    expect(await axe(container)).toHaveNoViolations();
  });
});
