import { screen, within } from "@testing-library/react";
import { LanguageToggle } from "@/components/language-toggle";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";
import { capturedEvents, startAnalytics } from "@/test/analytics";

describe("LanguageToggle", () => {
  it("names the target language and marks its label with that language", () => {
    renderWithProviders(<LanguageToggle />);
    const button = screen.getByRole("button", { name: languageToggleName("en") });
    // lang on the label lets screen readers pronounce "ES" as Spanish
    expect(within(button).getByText("ES")).toHaveAttribute("lang", "es");
  });

  it("toggles between English and Spanish", async () => {
    const { user } = renderWithProviders(<LanguageToggle />);

    await user.click(screen.getByRole("button", { name: languageToggleName("en") }));
    const back = screen.getByRole("button", { name: languageToggleName("es") });
    expect(within(back).getByText("EN")).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("lang", "es");

    await user.click(back);
    expect(screen.getByRole("button", { name: languageToggleName("en") })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });
});

describe("LanguageToggle › analytics", () => {
  beforeEach(startAnalytics);

  it("sends language_switch with the language chosen, each way", async () => {
    const { user } = renderWithProviders(<LanguageToggle />);
    await user.click(screen.getByRole("button", { name: languageToggleName("en") }));
    await user.click(screen.getByRole("button", { name: languageToggleName("es") }));
    expect(capturedEvents()).toEqual([
      ["language_switch", { to: "es" }],
      ["language_switch", { to: "en" }],
    ]);
  });

  it("sends language_switch to English when the page starts in Spanish", async () => {
    const { user } = renderWithProviders(<LanguageToggle />, { lang: "es" });
    await user.click(screen.getByRole("button", { name: languageToggleName("es") }));
    expect(capturedEvents()).toEqual([["language_switch", { to: "en" }]]);
  });
});
