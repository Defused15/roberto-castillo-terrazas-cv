import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ProjectCard } from "@/components/project-card";
import { capturedEvents, preventNavigation, startAnalytics } from "@/test/analytics";

const props = {
  title: "QA Playground Test Automation",
  description: "A project to showcase QA test automation skills.",
  tags: ["Playwright", "GitHub Actions"],
};
const site = "https://defused15.github.io/QA-Playground-Tests/dashboard.html";
const repo = "https://github.com/Defused15/QA-Playground-Tests";

describe("ProjectCard", () => {
  it("renders the title, description and every tag", () => {
    render(<ProjectCard {...props} />);
    expect(screen.getByText(props.title)).toBeInTheDocument();
    expect(screen.getByText(props.description)).toBeInTheDocument();
    props.tags.forEach((tag) => expect(screen.getByText(tag)).toBeInTheDocument());
  });

  it("links the title to the website in a new tab without leaking the opener", () => {
    render(<ProjectCard {...props} link={site} />);
    const link = screen.getByRole("link", { name: props.title });
    expect(link).toHaveAttribute("href", site);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the title as plain text when there is no website", () => {
    render(<ProjectCard {...props} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText(props.title)).toBeInTheDocument();
  });

  it.each([
    ["the default label", undefined, "GitHub repo"],
    ["a localized label", "Repo en GitHub", "Repo en GitHub"],
  ])("links the repository with %s", (_case, githubLabel, name) => {
    render(<ProjectCard {...props} githubLink={repo} githubLabel={githubLabel} />);
    const link = screen.getByRole("link", { name });
    expect(link).toHaveAttribute("href", repo);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("omits the repository link when there is none", () => {
    render(<ProjectCard {...props} link={site} />);
    expect(screen.queryByRole("link", { name: /github/i })).not.toBeInTheDocument();
  });

  // Print contract: links are not clickable on paper, so the card prints the
  // address as text in a block that is only shown in print (`hidden print:block`).
  // jsdom has no print media, so these classes are the observable contract.
  describe("printed address", () => {
    const printed = (text: string) => {
      const el = screen.getByText(text);
      expect(el).toHaveClass("hidden", "print:block");
      return el;
    };

    it("prints the explicit label when one is given", () => {
      render(<ProjectCard {...props} link={site} linkLabel="qa.rcastillo.dev" />);
      printed("qa.rcastillo.dev");
    });

    it.each([
      ["https://www.example.com/a", "example.com/a"],
      ["http://example.com", "example.com"],
      ["HTTPS://WWW.x.dev", "x.dev"],
      ["https://notwww.example.com", "notwww.example.com"],
      ["https://example.com/www.page", "example.com/www.page"],
      ["ftp://example.com/https://x", "ftp://example.com/https://x"],
    ])("prints %s as %s when there is no label", (link, expected) => {
      render(<ProjectCard {...props} link={link} />);
      printed(expected);
    });

    it("prints nothing when there is no website", () => {
      render(<ProjectCard {...props} />);
      expect(screen.getByText(props.description).parentElement).toHaveTextContent(
        new RegExp(`^${props.title}${props.description}$`),
      );
    });
  });
});

describe("ProjectCard › analytics", () => {
  let allowNavigation: () => void;
  beforeEach(async () => {
    await startAnalytics();
    allowNavigation = preventNavigation();
  });
  afterEach(() => allowNavigation());

  it("sends project_link with the title when the website is opened", async () => {
    const user = userEvent.setup();
    render(<ProjectCard {...props} link={site} githubLink={repo} />);
    await user.click(screen.getByRole("link", { name: props.title }));
    expect(capturedEvents()).toEqual([["project_link", { project: props.title }]]);
  });

  it("sends project_repo with the title when the repository is opened", async () => {
    const user = userEvent.setup();
    render(<ProjectCard {...props} link={site} githubLink={repo} githubLabel="Repo" />);
    await user.click(screen.getByRole("link", { name: "Repo" }));
    expect(capturedEvents()).toEqual([["project_repo", { project: props.title }]]);
  });
});
