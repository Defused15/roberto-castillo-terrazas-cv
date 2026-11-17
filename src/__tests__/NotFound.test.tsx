import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LanguageProvider } from "@/components/language-provider";
import { LanguageToggle } from "@/components/language-toggle";
import { NotFoundContent } from "@/components/not-found-content";
import NotFound, { metadata } from "@/app/not-found";

beforeEach(() => localStorage.clear());

describe("NotFound", () => {
  it("renders EN text and a link home", () => {
    render(
      <LanguageProvider>
        <NotFoundContent />
      </LanguageProvider>,
    );
    expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
    expect(screen.getByText("The page you're looking for doesn't exist.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to the CV" })).toHaveAttribute("href", "/");
  });

  it("renders ES text after switching language", async () => {
    render(
      <LanguageProvider>
        <LanguageToggle />
        <NotFound />
      </LanguageProvider>,
    );
    await userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("heading", { name: "Página no encontrada" })).toBeInTheDocument();
    expect(screen.getByText("La página que buscas no existe.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Volver al CV" })).toHaveAttribute("href", "/");
  });

  it("ships reduced-motion CSS for the entrance", () => {
    const css = require("fs").readFileSync(
      require("path").join(process.cwd(), "src/app/globals.css"),
      "utf8",
    );
    expect(css).toMatch(/prefers-reduced-motion: reduce\)\s*{\s*\.nf-enter/);
  });

  it("exports a page title", () => {
    expect(metadata.title).toBe("Page not found");
  });
});
