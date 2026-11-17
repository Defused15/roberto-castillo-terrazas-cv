import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TextEncoder } from "util";
import { LanguageProvider, useLanguage } from "@/components/language-provider";

function Consumer() {
  const { lang, setLang, data } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <span data-testid="about">{data.ui.sections.about}</span>
      <button onClick={() => setLang("es")}>to-es</button>
    </div>
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.lang = "en";
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("LanguageProvider", () => {
  it("useLanguage works without a provider (English default)", () => {
    render(<Consumer />);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(screen.getByTestId("about")).toHaveTextContent("About");
  });

  it("defaults to en and switches to es, syncing html lang and storage", async () => {
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("about")).toHaveTextContent("About");

    await userEvent.click(screen.getByRole("button", { name: "to-es" }));

    expect(screen.getByTestId("about")).toHaveTextContent("Acerca de");
    expect(document.documentElement.lang).toBe("es");
    expect(localStorage.getItem("cv-lang")).toBe("es");
  });

  it("applies a stored es language after mount", () => {
    localStorage.setItem("cv-lang", "es");
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("about")).toHaveTextContent("Acerca de");
  });

  it("ignores an invalid stored language", () => {
    localStorage.setItem("cv-lang", "fr");
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("about")).toHaveTextContent("About");
  });

  it("survives storage throwing", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    render(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(screen.getByTestId("about")).toHaveTextContent("About");

    await userEvent.click(screen.getByRole("button", { name: "to-es" }));
    expect(screen.getByTestId("about")).toHaveTextContent("Acerca de");
  });

  it("server-renders English even when es is stored", () => {
    (global as unknown as { TextEncoder: unknown }).TextEncoder = TextEncoder;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { renderToString } = require("react-dom/server");
    localStorage.setItem("cv-lang", "es");
    const html = renderToString(
      <LanguageProvider>
        <Consumer />
      </LanguageProvider>
    );
    expect(html).toContain("About");
    expect(html).not.toContain("Acerca de");
  });
});
