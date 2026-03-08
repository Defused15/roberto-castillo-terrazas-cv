import React from "react";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/project-card";

describe("ProjectCard", () => {
  const defaultProps = {
    title: "QA Playground Test Automation",
    description: "A project to showcase QA test automation skills.",
    tags: ["Playwright", "GitHub Actions"],
  };

  describe("Rendering", () => {
    it("renders title, description and tags correctly", () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
      defaultProps.tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument();
      });
    });

    it("renders multiple tags correctly", () => {
      const manyTags = ["Playwright", "Jest", "K6"];
      render(<ProjectCard {...defaultProps} tags={manyTags} />);
      manyTags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
    });

    it("handles empty description gracefully", () => {
      render(<ProjectCard {...defaultProps} description="" />);
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });
  });

  describe("Link behavior", () => {
    const projectLink = "https://github.com/Defused15/QA-Playground-Tests";

    it("renders title as a link with green dot when link is provided", () => {
      const { container } = render(<ProjectCard {...defaultProps} link={projectLink} />);
      const link = screen.getByRole("link", { name: defaultProps.title });
      expect(link).toHaveAttribute("href", projectLink);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
      expect(container.querySelector(".bg-green-500")).toBeInTheDocument();
    });

    it("renders cleaned link text in small div", () => {
      render(<ProjectCard {...defaultProps} link={projectLink} />);
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "DIV" &&
            content.replace(/\s+/g, "") ===
              "github.com/Defused15/QA-Playground-Tests".replace(/\s+/g, "")
          );
        })
      ).toBeInTheDocument();
    });

    it("renders title as plain text and no green dot when no link is provided", () => {
      const { container } = render(<ProjectCard {...defaultProps} />);
      expect(screen.queryByRole("link", { name: defaultProps.title })).not.toBeInTheDocument();
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
      expect(container.querySelector(".bg-green-500")).not.toBeInTheDocument();
    });
  });
});