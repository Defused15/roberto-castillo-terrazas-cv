import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event"; // reemplaza fireEvent
import { CommandMenu } from "@/components/command-menu";

// Mock window.open y window.print
beforeEach(() => {
  window.open = jest.fn();
  window.print = jest.fn();
});

const defaultLinks = [
  { url: "https://github.com/Defused15", title: "GitHub" },
  { url: "https://www.linkedin.com/in/rocastil/", title: "LinkedIn" },
];

// ─────────────────────────────────────────────
// CommandMenu Component Tests
// ─────────────────────────────────────────────

describe("CommandMenu", () => {
  describe("Rendering", () => {
    it("renders the mobile trigger button", () => {
      render(<CommandMenu links={defaultLinks} />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("renders the keyboard shortcut hint text", () => {
      render(<CommandMenu links={defaultLinks} />);
      expect(screen.getByText(/open the command menu/i)).toBeInTheDocument();
    });

    it("mobile button has print:hidden class", () => {
      render(<CommandMenu links={defaultLinks} />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("print:hidden");
    });
  });

  describe("Dialog interaction", () => {
    it("opens command dialog when button is clicked", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.click(screen.getByRole("button"));
      expect(
        await screen.findByPlaceholderText("Type a command or search...")
      ).toBeInTheDocument();
    });

    it("shows Print action when dialog is open", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.click(screen.getByRole("button"));
      expect(await screen.findByText("Print")).toBeInTheDocument();
    });

    it("renders all provided links in the dialog", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.click(screen.getByRole("button"));
      expect(await screen.findByText("GitHub")).toBeInTheDocument();
      expect(await screen.findByText("LinkedIn")).toBeInTheDocument();
    });

    it("renders empty state when no links are provided", async () => {
      render(<CommandMenu links={[]} />);
      await userEvent.click(screen.getByRole("button"));
      expect(
        await screen.findByPlaceholderText("Type a command or search...")
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard shortcut", () => {
    it("opens dialog on Ctrl+J", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.keyboard("{Control>}j{/Control}");
      expect(
        await screen.findByPlaceholderText("Type a command or search...")
      ).toBeInTheDocument();
    });

    it("opens dialog on Cmd+J (Meta+J)", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.keyboard("{Meta>}j{/Meta}");
      expect(
        await screen.findByPlaceholderText("Type a command or search...")
      ).toBeInTheDocument();
    });

    it("does not open dialog on J key alone", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.keyboard("j");
      expect(
        screen.queryByPlaceholderText("Type a command or search...")
      ).not.toBeInTheDocument();
    });
  });

  describe("Actions", () => {
    it("calls window.print when Print is selected", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.click(screen.getByRole("button"));
      const printItem = await screen.findByText("Print");
      await userEvent.click(printItem);
      expect(window.print).toHaveBeenCalledTimes(1);
    });

    it("calls window.open with correct URL when a link is selected", async () => {
      render(<CommandMenu links={defaultLinks} />);
      await userEvent.click(screen.getByRole("button"));
      const githubItem = await screen.findByText("GitHub");
      await userEvent.click(githubItem);
      expect(window.open).toHaveBeenCalledWith(
        "https://github.com/Defused15",
        "_blank"
      );
    });
  });
});