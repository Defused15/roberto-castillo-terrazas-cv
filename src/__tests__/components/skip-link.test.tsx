import { screen } from "@testing-library/react";
import { SkipLink } from "@/components/skip-link";
import { ResumeContent } from "@/components/resume-content";
import { LANGS, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { renderWithProviders } from "@/test/render";

describe("skip link", () => {
  it.each(LANGS)("[%s] is the first tab stop and targets the main landmark", async (lang) => {
    const { user } = renderWithProviders(
      <>
        <SkipLink targetId="main-content" />
        <ResumeContent />
      </>,
      { lang },
    );
    const link = screen.getByRole("link", { name: RESUME_DATA_BY_LANG[lang].ui.skipToContent });
    expect(link).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    await user.tab();
    expect(link).toHaveFocus();
  });
});
