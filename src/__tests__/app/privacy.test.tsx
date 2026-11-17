import { act, screen, within } from "@testing-library/react";
import PrivacyPage, { metadata } from "@/app/privacy/page";
import { LanguageToggle } from "@/components/language-toggle";
import { AEPD_URL } from "@/components/privacy-content";
import { LANGS, RESUME_DATA, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { capturedEvents, startAnalytics } from "@/test/analytics";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";

/** Paragraph text as shown, with the placeholders replaced by their link text. */
const shown = (text: string) =>
  text
    .replaceAll("{email}", RESUME_DATA.contact.email)
    .replaceAll("{aepd}", "aepd.es");

describe.each(LANGS)("Privacy page [%s]", (lang) => {
  const p = RESUME_DATA_BY_LANG[lang].ui.privacy;

  beforeEach(() => {
    renderWithProviders(<PrivacyPage />, { lang });
  });

  it("is headed by the notice title and intro", () => {
    expect(
      screen.getByRole("heading", { level: 1, name: p.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(p.intro)).toBeInTheDocument();
  });

  it("renders every section as a named region with all its paragraphs", () => {
    expect(
      screen
        .getAllByRole("region")
        .map((r) => within(r).getByRole("heading", { level: 2 }).textContent),
    ).toEqual(p.sections.map((s) => s.title));
    p.sections.forEach((section) => {
      const region = screen.getByRole("region", { name: section.title });
      const paragraphs = within(region).getAllByText(
        (_, el) => el?.tagName === "P",
      );
      expect(paragraphs.map((el) => el.textContent)).toEqual(
        section.paragraphs.map(shown),
      );
    });
  });

  it("links the contact email from the data, never a placeholder", () => {
    const links = screen.getAllByRole("link", {
      name: RESUME_DATA.contact.email,
    });
    expect(links.length).toBeGreaterThan(0);
    links.forEach((a) =>
      expect(a).toHaveAttribute("href", `mailto:${RESUME_DATA.contact.email}`),
    );
    expect(document.body.textContent).not.toMatch(/\{(email|aepd)\}/);
  });

  it("links the Spanish Data Protection Agency in a new tab", () => {
    const link = screen.getByRole("link", { name: "aepd.es" });
    expect(link).toHaveAttribute("href", AEPD_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("shows the last update date", () => {
    expect(
      screen.getByText(`${p.lastUpdatedLabel}: ${p.lastUpdated}`),
    ).toBeInTheDocument();
  });

  it("links back to the CV", () => {
    expect(
      screen.getByRole("link", {
        name: RESUME_DATA_BY_LANG[lang].ui.notFound.backHome,
      }),
    ).toHaveAttribute("href", "/");
  });
});

describe("Privacy page", () => {
  it("states the fixed last update date in both languages", () => {
    expect(RESUME_DATA_BY_LANG.en.ui.privacy.lastUpdated).toBe(
      "November 17, 2026",
    );
    expect(RESUME_DATA_BY_LANG.es.ui.privacy.lastUpdated).toBe(
      "17 de noviembre de 2026",
    );
  });

  it("follows a language switch", async () => {
    const { user } = renderWithProviders(
      <>
        <LanguageToggle />
        <PrivacyPage />
      </>,
    );
    await user.click(
      screen.getByRole("button", { name: languageToggleName("en") }),
    );
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      RESUME_DATA_BY_LANG.es.ui.privacy.title,
    );
  });

  it("is titled Privacy, with its own canonical URL", () => {
    expect(metadata).toEqual({
      title: "Privacy",
      alternates: { canonical: "/privacy" },
    });
  });

  it("sends no custom event, in particular not not_found", async () => {
    await startAnalytics();
    renderWithProviders(<PrivacyPage />);
    // Gives any queued trackWhenReady call time to run (next/link updates meanwhile).
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(capturedEvents()).toEqual([]);
  });
});
