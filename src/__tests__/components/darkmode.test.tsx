import { screen } from "@testing-library/react";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/darkmode";
import { LanguageToggle } from "@/components/language-toggle";
import { RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { languageToggleName } from "@/test/labels";
import { renderWithProviders } from "@/test/render";

// next-themes is a third-party boundary: what is verified here is our wiring to it.
jest.mock("next-themes", () => ({ useTheme: jest.fn() }));

const EN = RESUME_DATA_BY_LANG.en.ui.theme;
const ES = RESUME_DATA_BY_LANG.es.ui.theme;
const setTheme = jest.fn();

beforeEach(() => {
  setTheme.mockReset();
  jest.mocked(useTheme).mockReturnValue({ theme: "light", setTheme, themes: [] });
});

async function openMenu() {
  const { user } = renderWithProviders(<ModeToggle />);
  await user.click(screen.getByRole("button", { name: EN.toggle }));
  return user;
}

const optionLabels = async () => (await screen.findAllByRole("menuitem")).map((o) => o.textContent);

describe("ModeToggle", () => {
  it("lists the light, dark and system options in order", async () => {
    await openMenu();
    expect(await optionLabels()).toEqual([EN.light, EN.dark, EN.system]);
  });

  it("does not change the theme just by opening the menu", async () => {
    await openMenu();
    await screen.findAllByRole("menuitem");
    expect(setTheme).not.toHaveBeenCalled();
  });

  it.each([
    [EN.light, "light"],
    [EN.dark, "dark"],
    [EN.system, "system"],
  ])("selecting %s applies the %p theme", async (label, theme) => {
    const user = await openMenu();
    await user.click(await screen.findByRole("menuitem", { name: label }));
    expect(setTheme).toHaveBeenCalledTimes(1);
    expect(setTheme).toHaveBeenCalledWith(theme);
  });

  it("follows a language switch", async () => {
    const { user } = renderWithProviders(
      <>
        <ModeToggle />
        <LanguageToggle />
      </>,
    );
    await user.click(screen.getByRole("button", { name: languageToggleName("en") }));
    await user.click(screen.getByRole("button", { name: ES.toggle }));
    expect(await optionLabels()).toEqual([ES.light, ES.dark, ES.system]);
  });
});
