import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { within } from "@testing-library/react";
import { ResumeContent } from "@/components/resume-content";
import { LanguageProvider } from "@/components/language-provider";
import { RESUME_DATA, RESUME_DATA_BY_LANG } from "@/data/resume-data";

jest.mock("next-themes", () => ({
  useTheme: jest.fn(() => ({ theme: "light", setTheme: jest.fn() })),
}));

function renderPage() {
  return render(
    <LanguageProvider>
      <ResumeContent />
    </LanguageProvider>
  );
}

describe("ResumeContent", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders English by default", () => {
    renderPage();
    expect(screen.getByRole("heading", { name: "About" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Work Experience" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Projects" })).toBeInTheDocument();
    expect(screen.getByText("2025 - Present")).toBeInTheDocument();
    expect(screen.getByText("2026 - Present")).toBeInTheDocument();
    expect(screen.getByText("Spain")).toBeInTheDocument();
    expect(screen.getByText("Mexico")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Call +34 610 831 754" })).toHaveAttribute("href", "tel:+34610831754");
    expect(screen.getByText(RESUME_DATA.summary)).toBeInTheDocument();
  });

  it("lists both phone numbers in human-readable form on screen and in print", () => {
    renderPage();
    for (const [label, href] of [
      ["+34 610 831 754", "tel:+34610831754"],
      ["+52 871 105 3221", "tel:+528711053221"],
    ]) {
      const matches = screen.getAllByText(label);
      // one in the visible line under the email (hidden in print), one in the print-only block
      expect(matches).toHaveLength(2);
      const onScreen = matches.find((el) => el.closest("p")?.classList.contains("print:hidden"));
      expect(onScreen).toBeDefined();
      expect(onScreen!.closest("a")).toHaveAttribute("href", href);
    }
  });

  it("switches to Spanish when the toggle is clicked", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Switch language: ES" }));
    expect(screen.getByRole("heading", { name: "Acerca de" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experiencia laboral" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proyectos" })).toBeInTheDocument();
    expect(screen.getByText("2025 - Actual")).toBeInTheDocument();
    expect(screen.getByText("2026 - Actual")).toBeInTheDocument();
    expect(screen.getByText("España")).toBeInTheDocument();
    expect(screen.getByText("México")).toBeInTheDocument();
    expect(screen.getByText(RESUME_DATA_BY_LANG.es.summary)).toBeInTheDocument();
    expect(screen.queryByText(RESUME_DATA.summary)).not.toBeInTheDocument();
    expect(screen.getAllByText("Repo en GitHub").length).toBeGreaterThan(0);
  });

  it("keeps company names, emails and project titles identical in both languages", async () => {
    renderPage();
    expect(screen.getAllByText("Inetum").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QA Test Hub").length).toBeGreaterThan(0);
    expect(screen.getAllByText(RESUME_DATA.contact.email).length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("button", { name: "Switch language: ES" }));
    expect(screen.getAllByText("Inetum").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QA Test Hub").length).toBeGreaterThan(0);
    expect(screen.getAllByText(RESUME_DATA.contact.email).length).toBeGreaterThan(0);
  });

  it("renders both Google Data Analytics certifications with their issuers", () => {
    renderPage();
    const entries = screen.getAllByText("Google Data Analytics");
    expect(entries).toHaveLength(2);
    const issuers = entries.map((el) => {
      const row = el.parentElement as HTMLElement;
      return within(row).getByText(/^(Cisco|Coursera)$/).textContent;
    });
    expect(issuers.sort()).toEqual(["Cisco", "Coursera"]);
  });

  it("gives every link and button an accessible name", () => {
    renderPage();
    [...screen.getAllByRole("link"), ...screen.getAllByRole("button")].forEach((el) =>
      expect(el).toHaveAccessibleName(),
    );
    expect(screen.getByRole("link", { name: "Send an email" })).toHaveAttribute("href", `mailto:${RESUME_DATA.contact.email}`);
    expect(screen.getByRole("link", { name: "GitHub profile" })).toHaveAttribute("href", "https://github.com/Defused15");
    expect(screen.getByRole("link", { name: "LinkedIn profile" })).toHaveAttribute("href", "https://www.linkedin.com/in/rocastil/");
    expect(screen.getByRole("region", { name: "Work Experience" })).toBeInTheDocument();
  });

  it("renders without duplicate key warnings", () => {
    const spy = jest.spyOn(console, "error").mockImplementation(() => {});
    renderPage();
    const keyWarnings = spy.mock.calls.filter((args) =>
      args.some((a) => typeof a === "string" && a.includes("same key"))
    );
    expect(keyWarnings).toHaveLength(0);
    spy.mockRestore();
  });
});
