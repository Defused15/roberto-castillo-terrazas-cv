import { render, screen } from "@testing-library/react";
import { SiteFooter } from "@/components/site-footer";
import { LANGS, RESUME_DATA_BY_LANG } from "@/data/resume-data";

describe.each(LANGS)("SiteFooter [%s]", (lang) => {
  const d = RESUME_DATA_BY_LANG[lang];

  it("is a page footer with the copyright and the privacy link", () => {
    render(<SiteFooter data={d} />);
    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveTextContent(`© 2026 ${d.name}`);
    expect(
      screen.getByRole("link", { name: d.ui.privacy.link }),
    ).toHaveAttribute("href", "/privacy");
  });

  it("is hidden on paper", () => {
    render(<SiteFooter data={d} />);
    expect(screen.getByRole("contentinfo")).toHaveClass("print:hidden");
  });
});
