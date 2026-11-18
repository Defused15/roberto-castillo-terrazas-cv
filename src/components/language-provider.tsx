'use client';

import * as React from 'react';

import {pickInitialLang} from '@/lib/initial-lang';
import {
  RESUME_DATA_BY_LANG,
  type Lang,
  type ResumeData,
} from '@/data/resume-data';

const STORAGE_KEY = 'cv-lang';

interface LanguageContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
  data: ResumeData;
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: 'en',
  // Intentional no-op so components also work without a provider.
  setLang: () => {},
  data: RESUME_DATA_BY_LANG.en,
});

export function LanguageProvider({children}: {children: React.ReactNode}) {
  const [lang, setLangState] = React.useState<Lang>('en');

  // The two hooks with an empty dependency list are wrapped in Stryker
  // disable/restore: mutating [] into a constant array is an equivalent mutant.

  // Stryker disable ArrayDeclaration
  // Applied in an effect on purpose: server render and first client render stay English
  // (hydration safety), so do not use a lazy useState initializer to read storage.
  // A stored manual choice wins; otherwise a Spanish browser starts in Spanish. The
  // automatic choice is not stored and not tracked (only toggle clicks are).
  React.useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {
      // storage unavailable; fall back to the browser languages
    }
    setLangState(pickInitialLang(stored, navigator.languages));
  }, []);
  // Stryker restore ArrayDeclaration

  React.useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  // Stryker disable ArrayDeclaration
  const setLang = React.useCallback((next: Lang) => {
    setLangState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage unavailable; ignore
    }
  }, []);
  // Stryker restore ArrayDeclaration

  const value = React.useMemo(
    () => ({lang, setLang, data: RESUME_DATA_BY_LANG[lang]}),
    [lang, setLang],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return React.useContext(LanguageContext);
}
