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
    const projectLink = "https://defused15.github.io/QA-Playground-Tests/dashboard.html";
    const githubLink = "https://github.com/Defused15/QA-Playground-Tests";

    it("renders title as a link to the website when link is provided", () => {
      render(<ProjectCard {...defaultProps} link={projectLink} />);
      const link = screen.getByRole("link", { name: defaultProps.title });
      expect(link).toHaveAttribute("href", projectLink);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders GitHub repo link with label text when githubLink is provided", () => {
      render(<ProjectCard {...defaultProps} githubLink={githubLink} />);
      const ghLink = screen.getByRole("link", { name: /github repo/i });
      expect(ghLink).toHaveAttribute("href", githubLink);
      expect(ghLink).toHaveAttribute("target", "_blank");
      expect(ghLink).toHaveAttribute("rel", "noopener noreferrer");
    });

    it("renders 'GitHub repo' label text when githubLink is provided", () => {
      render(<ProjectCard {...defaultProps} githubLink={githubLink} />);
      expect(screen.getByText("GitHub repo")).toBeInTheDocument();
    });

    it("does not render GitHub repo link when githubLink is not provided", () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.queryByRole("link", { name: /github repo/i })).not.toBeInTheDocument();
      expect(screen.queryByText("GitHub repo")).not.toBeInTheDocument();
    });

    it("renders cleaned link text in small div", () => {
      render(<ProjectCard {...defaultProps} link={projectLink} />);
      expect(
        screen.getByText((content, element) => {
          return (
            element?.tagName === "DIV" &&
            content.replace(/\s+/g, "") ===
              "defused15.github.io/QA-Playground-Tests/dashboard.html".replace(/\s+/g, "")
          );
        })
      ).toBeInTheDocument();
    });

    it("renders title as plain text when no link is provided", () => {
      render(<ProjectCard {...defaultProps} />);
      expect(screen.queryByRole("link", { name: defaultProps.title })).not.toBeInTheDocument();
      expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    });

    it("renders both website link and GitHub repo link when both are provided", () => {
      render(<ProjectCard {...defaultProps} link={projectLink} githubLink={githubLink} />);
      const titleLink = screen.getByRole("link", { name: defaultProps.title });
      const ghLink = screen.getByRole("link", { name: /github repo/i });
      expect(titleLink).toHaveAttribute("href", projectLink);
      expect(ghLink).toHaveAttribute("href", githubLink);
    });

    it("website link and GitHub repo link point to different URLs", () => {
      render(<ProjectCard {...defaultProps} link={projectLink} githubLink={githubLink} />);
      const titleLink = screen.getByRole("link", { name: defaultProps.title });
      const ghLink = screen.getByRole("link", { name: /github repo/i });
      expect(titleLink.getAttribute("href")).not.toBe(ghLink.getAttribute("href"));
    });
  });
});