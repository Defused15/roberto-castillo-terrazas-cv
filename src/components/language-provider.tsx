"use client"

import * as React from "react"

import {
  isLang,
  RESUME_DATA_BY_LANG,
  type Lang,
  type ResumeData,
} from "@/data/resume-data"

const STORAGE_KEY = "cv-lang"

interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  data: ResumeData
}

const LanguageContext = React.createContext<LanguageContextValue>({
  lang: "en",
  // Intentional no-op so components also work without a provider.
  setLang: () => {},
  data: RESUME_DATA_BY_LANG.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("en")

  // Applied in an effect on purpose: server render and first client render stay English
  // (hydration safety), so do not use a lazy useState initializer to read storage.
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isLang(stored)) setLangState(stored)
    } catch {
      // storage unavailable; keep default
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = React.useCallback((next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // storage unavailable; ignore
    }
  }, [])

  const value = React.useMemo(
    () => ({ lang, setLang, data: RESUME_DATA_BY_LANG[lang] }),
    [lang, setLang]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
