import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "en";
});

function setup() {
  return render(
    <LanguageProvider>
      <LanguageToggle />
    </LanguageProvider>
  );
}

describe("LanguageToggle", () => {
  it("shows the target language with an accessible name", () => {
    setup();
    const button = screen.getByRole("button", { name: "Switch language" });
    expect(button).toHaveTextContent("ES");
  });

  it("toggles between languages", async () => {
    setup();
    await userEvent.click(screen.getByRole("button"));
    const button = screen.getByRole("button", { name: "Cambiar idioma" });
    expect(button).toHaveTextContent("EN");
    expect(document.documentElement.lang).toBe("es");

    await userEvent.click(button);
    expect(screen.getByRole("button", { name: "Switch language" })).toHaveTextContent("ES");
  });

  it("is hidden when printing", () => {
    setup();
    expect(screen.getByRole("button").className).toContain("print:hidden");
  });
});
