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

  it.each(LANGS)("[%s] the CV page with the phone numbers revealed has no axe violations", async (lang) => {
    const { container, user } = renderWithProviders(<ResumeContent />, { lang });
    await user.click(screen.getByRole("button", { name: RESUME_DATA_BY_LANG[lang].ui.contact.showPhones }));
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each(LANGS)("[%s] the CV page right after copying the email has no axe violations", async (lang) => {
    const d = RESUME_DATA_BY_LANG[lang];
    const { container, user } = renderWithProviders(<ResumeContent />, { lang });
    await user.click(screen.getByRole("button", { name: `${d.ui.contact.copyEmail} ${d.contact.email}` }));
    await screen.findByText(d.ui.contact.copied, { selector: ".sr-only" });
    expect(await axe(container)).toHaveNoViolations();
  });

  it.each(LANGS)("[%s] the CV page with every job's bullets expanded has no axe violations", async (lang) => {
    const d = RESUME_DATA_BY_LANG[lang];
    const { container, user } = renderWithProviders(<ResumeContent />, { lang });
    for (const button of screen.getAllByRole("button", { name: new RegExp(d.ui.bullets.showMore.replace("{n}", "\\d+")) })) {
      await user.click(button);
    }
    expect(screen.getAllByRole("button", { name: d.ui.bullets.showLess }).length).toBeGreaterThan(0);
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
