import {screen} from '@testing-library/react';
import {renderToString} from 'react-dom/server';
import {useTheme} from 'next-themes';
import {ModeToggle} from '@/components/darkmode';
import {LanguageToggle} from '@/components/language-toggle';
import {RESUME_DATA_BY_LANG} from '@/data/resume-data';
import {languageToggleName, themeToggleName} from '@/test/labels';
import {renderWithProviders} from '@/test/render';
import {axe} from '@/test/axe';
import {capturedEvents, startAnalytics} from '@/test/analytics';

// next-themes is a third-party boundary: what is verified here is our wiring to it.
jest.mock('next-themes', () => ({useTheme: jest.fn()}));

const EN = RESUME_DATA_BY_LANG.en.ui.theme;
const setTheme = jest.fn();

function useStoredTheme(theme: string | undefined) {
  jest.mocked(useTheme).mockReturnValue({theme, setTheme, themes: []});
}

beforeEach(() => {
  setTheme.mockReset();
  useStoredTheme('light');
});

const themeButton = () =>
  screen.getByRole('button', {name: new RegExp(`^${EN.toggle}`)});

describe('ModeToggle', () => {
  it.each([
    ['light', 'dark'],
    ['dark', 'system'],
    ['system', 'light'],
  ] as const)('from %s, a press applies %s', async (current, next) => {
    useStoredTheme(current);
    const {user} = renderWithProviders(<ModeToggle />);
    await user.click(
      screen.getByRole('button', {name: themeToggleName('en', current)}),
    );
    expect(setTheme).toHaveBeenCalledTimes(1);
    expect(setTheme).toHaveBeenCalledWith(next);
  });

  it.each([undefined, 'sepia'])(
    'treats a missing or unknown theme (%p) as system',
    async stored => {
      useStoredTheme(stored);
      const {user} = renderWithProviders(<ModeToggle />);
      await user.click(
        screen.getByRole('button', {name: themeToggleName('en', 'system')}),
      );
      expect(setTheme).toHaveBeenCalledWith('light');
    },
  );

  it.each([
    ['light', 'light'],
    ['dark', 'dark'],
    ['system', 'system'],
  ] as const)('shows the %s icon for the %s theme', (current, icon) => {
    useStoredTheme(current);
    renderWithProviders(<ModeToggle />);
    const icons = themeButton().querySelectorAll('svg');
    expect(icons).toHaveLength(1);
    expect(icons[0]).toHaveAttribute('data-theme-icon', icon);
    expect(icons[0]).toHaveAttribute('aria-hidden', 'true');
  });

  it('names the next theme in Spanish', () => {
    useStoredTheme('dark');
    renderWithProviders(<ModeToggle />, {lang: 'es'});
    expect(
      screen.getByRole('button', {name: themeToggleName('es', 'dark')}),
    ).toBeInTheDocument();
  });

  it('follows a language switch', async () => {
    const {user} = renderWithProviders(
      <>
        <ModeToggle />
        <LanguageToggle />
      </>,
    );
    await user.click(
      screen.getByRole('button', {name: languageToggleName('en')}),
    );
    expect(
      screen.getByRole('button', {name: themeToggleName('es', 'light')}),
    ).toBeInTheDocument();
  });

  it('is hidden on paper', () => {
    renderWithProviders(<ModeToggle />);
    expect(themeButton()).toHaveClass('print:hidden');
  });

  it('has no axe violations', async () => {
    const {container} = renderWithProviders(
      <main>
        <ModeToggle />
      </main>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});

// The stored theme only exists in the browser, so the server HTML must not depend on it.
describe('ModeToggle › server render', () => {
  it('renders a generic name and the CSS-driven sun/moon pair', () => {
    useStoredTheme('dark');
    const html = renderToString(<ModeToggle />);
    expect(html).toContain(`aria-label="${EN.toggle}"`);
    expect(html).not.toContain('data-theme-icon');
    expect(html).toContain('dark:hidden');
    expect(html).toContain('dark:block');
  });
});

describe('ModeToggle › analytics', () => {
  beforeEach(startAnalytics);

  it('sends nothing until pressed', () => {
    renderWithProviders(<ModeToggle />);
    expect(capturedEvents()).toEqual([]);
  });

  it.each([
    ['light', 'dark'],
    ['dark', 'system'],
    ['system', 'light'],
  ] as const)('from %s, sends theme_change with %p', async (current, next) => {
    useStoredTheme(current);
    const {user} = renderWithProviders(<ModeToggle />);
    await user.click(themeButton());
    expect(capturedEvents()).toEqual([['theme_change', {theme: next}]]);
  });

  it('sends the same theme values from the Spanish button', async () => {
    useStoredTheme('light');
    const {user} = renderWithProviders(<ModeToggle />, {lang: 'es'});
    await user.click(
      screen.getByRole('button', {name: themeToggleName('es', 'light')}),
    );
    expect(capturedEvents()).toEqual([['theme_change', {theme: 'dark'}]]);
  });
});
