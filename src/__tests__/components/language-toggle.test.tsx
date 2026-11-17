import { screen, within } from "@testing-library/react";
import { LanguageToggle } from "@/components/language-toggle";
import { renderWithProviders } from "@/test/render";

describe("LanguageToggle", () => {
  it("names the target language and marks its label with that language", () => {
    renderWithProviders(<LanguageToggle />);
    const button = screen.getByRole("button", { name: "Switch language: ES" });
    // lang on the label lets screen readers pronounce "ES" as Spanish
    expect(within(button).getByText("ES")).toHaveAttribute("lang", "es");
  });

  it("toggles between English and Spanish", async () => {
    const { user } = renderWithProviders(<LanguageToggle />);

    await user.click(screen.getByRole("button", { name: "Switch language: ES" }));
    const back = screen.getByRole("button", { name: "Cambiar idioma: EN" });
    expect(within(back).getByText("EN")).toHaveAttribute("lang", "en");
    expect(document.documentElement).toHaveAttribute("lang", "es");

    await user.click(back);
    expect(screen.getByRole("button", { name: "Switch language: ES" })).toBeInTheDocument();
    expect(document.documentElement).toHaveAttribute("lang", "en");
  });
});
