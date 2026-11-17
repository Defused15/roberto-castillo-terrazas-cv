import { readFileSync } from "fs";
import { join } from "path";
import { screen } from "@testing-library/react";
import NotFound, { metadata } from "@/app/not-found";
import { LanguageToggle } from "@/components/language-toggle";
import { RESUME_DATA_BY_LANG, LANGS } from "@/data/resume-data";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";

describe("NotFound page", () => {
  it.each(LANGS)("[%s] explains the error and links back to the CV", (lang) => {
    const { title, description, backHome } = RESUME_DATA_BY_LANG[lang].ui.notFound;
    renderWithProviders(<NotFound />, { lang });
    expect(screen.getByRole("heading", { level: 1, name: title })).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: backHome })).toHaveAttribute("href", "/");
  });

  it("follows a language switch", async () => {
    const { user } = renderWithProviders(
      <>
        <LanguageToggle />
        <NotFound />
      </>,
    );
    await user.click(screen.getByRole("button", { name: languageToggleName("en") }));
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      RESUME_DATA_BY_LANG.es.ui.notFound.title,
    );
  });

  it("is titled like its heading and kept out of search indexes", () => {
    expect(metadata).toMatchObject({
      title: RESUME_DATA_BY_LANG.en.ui.notFound.title,
      robots: { index: false, follow: false },
    });
  });

  // The entrance animation is pure CSS; jsdom cannot evaluate media queries, so
  // the guard is that globals.css disables it under prefers-reduced-motion.
  it("disables its entrance animation for reduced-motion users", () => {
    const css = readFileSync(join(process.cwd(), "src/app/globals.css"), "utf8");
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*{\s*\.nf-enter/);
  });
});
