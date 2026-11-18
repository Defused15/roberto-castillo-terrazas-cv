'use client';

import * as React from 'react';
import {MonitorIcon, MoonIcon, SunIcon} from 'lucide-react';
import {useTheme} from 'next-themes';
import {useLanguage} from '@/components/language-provider';
import {track} from '@/lib/analytics';
import {Button} from '@/components/ui/button';

type ThemeChoice = 'light' | 'dark' | 'system';

/** Order the button cycles through: light → dark → system → light. */
const THEME_CYCLE: readonly ThemeChoice[] = ['light', 'dark', 'system'];

const ICONS = {light: SunIcon, dark: MoonIcon, system: MonitorIcon} as const;

/** The stored theme, with anything missing or unknown counted as "system" (the default). */
function currentTheme(theme: string | undefined): ThemeChoice {
  return THEME_CYCLE.find(choice => choice === theme) ?? 'system';
}

/** The theme that follows `current` in the cycle. */
function nextTheme(current: ThemeChoice): ThemeChoice {
  return THEME_CYCLE[(THEME_CYCLE.indexOf(current) + 1) % THEME_CYCLE.length];
}

const noopSubscribe = () => () => {};

/** False during the server render and hydration, true afterwards. */
function useHydrated() {
  return React.useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * One button that cycles the theme. It shows the icon of the active theme and
 * its accessible name says which theme the next press applies. The stored
 * theme is only known in the browser, so until hydration it shows a
 * CSS-driven sun/moon and a generic name.
 */
export function ModeToggle() {
  const {theme, setTheme} = useTheme();
  const {data} = useLanguage();
  const t = data.ui.theme;
  const hydrated = useHydrated();

  const current = currentTheme(theme);
  const next = nextTheme(current);
  const Icon = ICONS[current];

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 print:hidden"
      aria-label={hydrated ? `${t.toggle}: ${t[next]}` : t.toggle}
      onClick={() => {
        track('theme_change', {theme: next});
        setTheme(next);
      }}
    >
      {hydrated ? (
        <Icon className="size-4" aria-hidden="true" data-theme-icon={current} />
      ) : (
        <>
          <SunIcon className="size-4 dark:hidden" aria-hidden="true" />
          <MoonIcon className="hidden size-4 dark:block" aria-hidden="true" />
        </>
      )}
    </Button>
  );
}
