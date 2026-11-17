import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useTheme } from "next-themes";
import { ModeToggle } from "@/components/darkmode";
import { LanguageToggle } from "@/components/language-toggle";
import { renderWithProviders } from "@/test/render";

// next-themes is a third-party boundary: what is verified here is our wiring to it.
jest.mock("next-themes", () => ({ useTheme: jest.fn() }));

const setTheme = jest.fn();

beforeEach(() => {
  setTheme.mockReset();
  jest.mocked(useTheme).mockReturnValue({ theme: "light", setTheme, themes: [] });
});

async function openMenu() {
  const user = userEvent.setup();
  render(<ModeToggle />);
  await user.click(screen.getByRole("button", { name: "Toggle theme" }));
  return user;
}

describe("ModeToggle", () => {
  it("lists the three theme options in order", async () => {
    await openMenu();
    const options = await screen.findAllByRole("menuitem");
    expect(options.map((o) => o.textContent)).toEqual(["Light", "Dark", "System"]);
  });

  it("does not change the theme just by opening the menu", async () => {
    await openMenu();
    await screen.findAllByRole("menuitem");
    expect(setTheme).not.toHaveBeenCalled();
  });

  it.each([
    ["Light", "light"],
    ["Dark", "dark"],
    ["System", "system"],
  ])("selecting %s applies the %p theme", async (label, theme) => {
    const user = await openMenu();
    await user.click(await screen.findByRole("menuitem", { name: label }));
    expect(setTheme).toHaveBeenCalledTimes(1);
    expect(setTheme).toHaveBeenCalledWith(theme);
  });

  it("shows Spanish labels after switching language", async () => {
    const { user } = renderWithProviders(
      <>
        <ModeToggle />
        <LanguageToggle />
      </>,
    );
    await user.click(screen.getByRole("button", { name: "Switch language: ES" }));
    await user.click(screen.getByRole("button", { name: "Cambiar tema" }));

    const options = await screen.findAllByRole("menuitem");
    expect(options.map((o) => o.textContent)).toEqual(["Claro", "Oscuro", "Sistema"]);
  });
});
