import { screen } from "@testing-library/react";
import NotFound from "@/app/not-found";
import PrivacyPage from "@/app/privacy/page";
import { ResumeContent } from "@/components/resume-content";
import { LANGS, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { axe } from "@/test/axe";
import { renderWithProviders } from "@/test/render";

/**
 * axe-core WCAG checks on the rendered DOM (names, roles, landmarks, ARIA,
 * lang). Colour contrast is out of scope in jsdom; see src/test/axe.ts.
 */
describe("accessibility", () => {
  it.each(LANGS)("[%s] the CV page has no axe violations", async (lang) => {
    const { container } = renderWithProviders(<ResumeContent />, { lang });
    expect(await axe(container)).toHaveNoViolations();
  });

  it("the open theme menu has no axe violations", async () => {
    const { user } = renderWithProviders(<ResumeContent />);
    await user.click(screen.getByRole("button", { name: RESUME_DATA_BY_LANG.en.ui.theme.toggle }));
    const menu = await screen.findByRole("menu");
    // The menu is a popup portalled to <body>, so it is checked on its own;
    // "region" (all content inside landmarks) does not apply to popups.
    expect(await axe(menu, { rules: { region: { enabled: false } } })).toHaveNoViolations();
  });

  it.each(LANGS)("[%s] the privacy page has no axe violations", async (lang) => {
    const { container } = renderWithProviders(<PrivacyPage />, { lang });
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each(LANGS)("[%s] the 404 page has no axe violations", async (lang) => {
    const { container } = renderWithProviders(<NotFound />, { lang });
    expect(await axe(container)).toHaveNoViolations();
  });
});
