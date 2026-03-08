import React from "react";
import { render, screen } from "@testing-library/react";
import { Section } from "@/components/ui/section";

// ─────────────────────────────────────────────
// Section Component Tests
// ─────────────────────────────────────────────

describe("Section", () => {

  // ───────────── Rendering ─────────────
  describe("Rendering", () => {
    it("renders children correctly", () => {
      render(<Section>Hello Section</Section>);
      expect(screen.getByText("Hello Section")).toBeInTheDocument();
    });

    it("renders as a <section> HTML element", () => {
      const { container } = render(<Section>Content</Section>);
      expect(container.firstChild?.nodeName).toBe("SECTION");
    });

    it("renders multiple children", () => {
      render(
        <Section>
          <p>First</p>
          <p>Second</p>
        </Section>
      );
      expect(screen.getByText("First")).toBeInTheDocument();
      expect(screen.getByText("Second")).toBeInTheDocument();
    });

    it("renders correctly with no children", () => {
      const { container } = render(<Section />);
      const section = container.firstChild as HTMLElement;
      expect(section).toBeInTheDocument();
      expect(section?.childNodes.length).toBe(0);
    });
  });

  // ───────────── ClassName ─────────────
  describe("ClassName", () => {
    it("applies default classes", () => {
      const { container } = render(<Section>Content</Section>);
      const section = container.firstChild as HTMLElement;
      expect(section.className).toContain("flex");
      expect(section.className).toContain("flex-col");
    });

    it("merges custom className with defaults", () => {
      const { container } = render(
        <Section className="custom-class">Content</Section>
      );
      const section = container.firstChild as HTMLElement;
      expect(section.className).toContain("custom-class");
      expect(section.className).toContain("flex");
    });

    it("keeps default classes even if className is empty", () => {
      const { container } = render(<Section className="">Content</Section>);
      const section = container.firstChild as HTMLElement;
      expect(section.className).toContain("flex");
      expect(section.className).toContain("flex-col");
    });

    it("applies dark mode class", () => {
      const { container } = render(<Section>Content</Section>);
      const section = container.firstChild as HTMLElement;
      expect(section.className).toContain("dark:bg-gray-900");
    });
  });

  // ───────────── Props ─────────────
  describe("Props", () => {
    it("applies id when provided", () => {
      const { container } = render(<Section id="my-section">Content</Section>);
      const section = container.firstChild as HTMLElement;
      expect(section.id).toBe("my-section");
    });

    it("applies additional styles passed via style prop", () => {
      const { container } = render(
        <Section style={{ marginTop: "10px" }}>Hi</Section>
      );
      const section = container.firstChild as HTMLElement;
      expect(section.style.marginTop).toBe("10px");
    });

    it("has role 'region' for accessibility", () => {
      const { container } = render(<Section>Accessible</Section>);
      const section = container.firstChild as HTMLElement;
      expect(section.getAttribute("role")).toBe("region");
    });
  });
});