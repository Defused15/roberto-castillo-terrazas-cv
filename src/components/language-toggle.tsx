"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"

export function LanguageToggle() {
  const { lang, setLang, data } = useLanguage()
  const next = lang === "en" ? "es" : "en"

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 print:hidden"
      aria-label={data.ui.languageToggle}
      onClick={() => setLang(next)}
    >
      {next.toUpperCase()}
    </Button>
  )
}
