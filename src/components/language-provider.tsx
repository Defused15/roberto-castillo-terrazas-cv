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
  setLang: () => {},
  data: RESUME_DATA_BY_LANG.en,
})

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = React.useState<Lang>("en")

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (isLang(stored)) setLang(stored)
    } catch {
      // storage unavailable; keep default
    }
  }, [])

  React.useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable; ignore
    }
  }, [lang])

  const value = React.useMemo(
    () => ({ lang, setLang, data: RESUME_DATA_BY_LANG[lang] }),
    [lang]
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage() {
  return React.useContext(LanguageContext)
}
