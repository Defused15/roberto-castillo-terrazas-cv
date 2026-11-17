import { screen, within } from "@testing-library/react";
import { LanguageToggle } from "@/components/language-toggle";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";

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
