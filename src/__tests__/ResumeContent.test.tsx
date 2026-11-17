import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
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
    expect(screen.getAllByText(/Present/).length).toBeGreaterThan(0);
    expect(screen.getByText(RESUME_DATA.summary)).toBeInTheDocument();
  });

  it("switches to Spanish when the toggle is clicked", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getByRole("heading", { name: "Acerca de" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Experiencia laboral" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Proyectos" })).toBeInTheDocument();
    expect(screen.getAllByText(/Actual/).length).toBeGreaterThan(0);
    expect(screen.getByText(RESUME_DATA_BY_LANG.es.summary)).toBeInTheDocument();
    expect(screen.queryByText(RESUME_DATA.summary)).not.toBeInTheDocument();
    expect(screen.getAllByText("Repo en GitHub").length).toBeGreaterThan(0);
  });

  it("keeps company names, emails and project titles identical in both languages", async () => {
    renderPage();
    expect(screen.getAllByText("Inetum").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QA Test Hub").length).toBeGreaterThan(0);
    expect(screen.getAllByText(RESUME_DATA.contact.email).length).toBeGreaterThan(0);
    await userEvent.click(screen.getByRole("button", { name: "Switch language" }));
    expect(screen.getAllByText("Inetum").length).toBeGreaterThan(0);
    expect(screen.getAllByText("QA Test Hub").length).toBeGreaterThan(0);
    expect(screen.getAllByText(RESUME_DATA.contact.email).length).toBeGreaterThan(0);
  });
});
