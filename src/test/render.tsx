import type { ReactElement } from "react";
import { render, type RenderOptions } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/components/language-provider";
import type { Lang } from "@/data/resume-data";

const STORAGE_KEY = "cv-lang";

interface ProviderOptions extends Omit<RenderOptions, "wrapper"> {
  /** Language the app starts in, as if the visitor had chosen it on a previous visit. */
  lang?: Lang;
}

/**
 * Renders `ui` inside the app providers and returns a `user` bound to it.
 * The language is seeded through storage, the same path a returning visitor takes.
 */
export function renderWithProviders(ui: ReactElement, { lang, ...options }: ProviderOptions = {}) {
  if (lang) localStorage.setItem(STORAGE_KEY, lang);
  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: LanguageProvider, ...options }),
  };
}
