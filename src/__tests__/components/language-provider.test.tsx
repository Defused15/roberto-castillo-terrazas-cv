import { StrictMode } from "react";
import { render, screen } from "@testing-library/react";
import { TextEncoder } from "util";
import { LanguageProvider, useLanguage } from "@/components/language-provider";
import { RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { renderWithProviders } from "@/test/render";

const ABOUT_EN = RESUME_DATA_BY_LANG.en.ui.sections.about;
const ABOUT_ES = RESUME_DATA_BY_LANG.es.ui.sections.about;

function Consumer() {
  const { lang, setLang, data } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{lang}</span>
      <h2>{data.ui.sections.about}</h2>
      <button onClick={() => setLang("es")}>to-es</button>
    </div>
  );
}

const heading = () => screen.getByRole("heading", { level: 2 });

describe("LanguageProvider", () => {
  it("works without a provider, defaulting to English", () => {
    render(<Consumer />);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(heading()).toHaveTextContent(ABOUT_EN);
  });

  it("defaults to English and switches to Spanish, syncing html lang and storage", async () => {
    const { user } = renderWithProviders(<Consumer />);
    expect(heading()).toHaveTextContent(ABOUT_EN);
    expect(document.documentElement).toHaveAttribute("lang", "en");

    await user.click(screen.getByRole("button", { name: "to-es" }));

    expect(heading()).toHaveTextContent(ABOUT_ES);
    expect(document.documentElement).toHaveAttribute("lang", "es");
    expect(localStorage.getItem("cv-lang")).toBe("es");
  });

  it.each([
    ["es", ABOUT_ES],
    ["en", ABOUT_EN],
    ["fr", ABOUT_EN],
    ["ES", ABOUT_EN],
    ["", ABOUT_EN],
  ])("restores stored cv-lang=%p as %p", (stored, expected) => {
    localStorage.setItem("cv-lang", stored);
    render(<Consumer />, { wrapper: LanguageProvider });
    expect(heading()).toHaveTextContent(expected);
  });

  it("keeps a stored language under StrictMode double effects", () => {
    localStorage.setItem("cv-lang", "es");
    render(
      <StrictMode>
        <LanguageProvider>
          <Consumer />
        </LanguageProvider>
      </StrictMode>,
    );
    expect(heading()).toHaveTextContent(ABOUT_ES);
    expect(localStorage.getItem("cv-lang")).toBe("es");
  });

  it("keeps working when storage throws (private mode, blocked cookies)", async () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const { user } = renderWithProviders(<Consumer />);
    expect(heading()).toHaveTextContent(ABOUT_EN);

    await user.click(screen.getByRole("button", { name: "to-es" }));
    expect(heading()).toHaveTextContent(ABOUT_ES);
  });

  it("server-renders English even when Spanish is stored, so hydration matches", async () => {
    const g = global as unknown as { TextEncoder?: unknown };
    const original = g.TextEncoder;
    g.TextEncoder = TextEncoder;
    localStorage.setItem("cv-lang", "es");
    try {
      const { renderToString } = await import("react-dom/server");
      const html = renderToString(
        <LanguageProvider>
          <Consumer />
        </LanguageProvider>,
      );
      expect(html).toContain(ABOUT_EN);
      expect(html).not.toContain(ABOUT_ES);
    } finally {
      g.TextEncoder = original;
    }
  });
});
