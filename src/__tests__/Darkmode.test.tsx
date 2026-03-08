import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ModeToggle } from "@/components/darkmode";
import { useTheme } from "next-themes";

// Mock next-themes
jest.mock("next-themes", () => ({
  useTheme: jest.fn(),
}));

const mockUseTheme = useTheme as jest.Mock;

// ─────────────────────────────────────────────
// ModeToggle Component Tests
// ─────────────────────────────────────────────

describe("ModeToggle", () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({
      theme: "light",
      setTheme: jest.fn(),
    });
  });

  describe("Rendering", () => {
    it("renders the toggle button", () => {
      render(<ModeToggle />);
      const button = screen.getByRole("button");
      expect(button).toBeInTheDocument();
    });

    it("has sr-only text for accessibility", () => {
      render(<ModeToggle />);
      expect(screen.getByText("Toggle theme")).toBeInTheDocument();
    });

    it("button has correct size class", () => {
      render(<ModeToggle />);
      const button = screen.getByRole("button");
      expect(button.className).toContain("size-8");
    });
  });

  describe("Dropdown interaction", () => {
    it("opens dropdown when button is clicked", async () => {
      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));

      expect(await screen.findByText(/light/i)).toBeInTheDocument();
      expect(await screen.findByText(/dark/i)).toBeInTheDocument();
      expect(await screen.findByText(/system/i)).toBeInTheDocument();
    });

    it("renders exactly three theme options", async () => {
      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));

      const options = await screen.findAllByRole("menuitem");

      expect(options).toHaveLength(3);
    });

    it("calls setTheme with 'light' when Light is selected", async () => {
      const setTheme = jest.fn();
      mockUseTheme.mockReturnValue({ theme: "light", setTheme });

      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));
      await userEvent.click(await screen.findByText(/light/i));

      expect(setTheme).toHaveBeenCalledTimes(1);
      expect(setTheme).toHaveBeenCalledWith("light");
    });

    it("calls setTheme with 'dark' when Dark is selected", async () => {
      const setTheme = jest.fn();
      mockUseTheme.mockReturnValue({ theme: "light", setTheme });

      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));
      await userEvent.click(await screen.findByText(/dark/i));

      expect(setTheme).toHaveBeenCalledTimes(1);
      expect(setTheme).toHaveBeenCalledWith("dark");
    });

    it("calls setTheme with 'system' when System is selected", async () => {
      const setTheme = jest.fn();
      mockUseTheme.mockReturnValue({ theme: "light", setTheme });

      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));
      await userEvent.click(await screen.findByText(/system/i));

      expect(setTheme).toHaveBeenCalledTimes(1);
      expect(setTheme).toHaveBeenCalledWith("system");
    });

    it("does not change theme when opening the dropdown", async () => {
      const setTheme = jest.fn();
      mockUseTheme.mockReturnValue({ theme: "light", setTheme });

      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));

      expect(setTheme).not.toHaveBeenCalled();
    });

    it("each theme option appears only once", async () => {
      render(<ModeToggle />);

      await userEvent.click(screen.getByRole("button"));

      expect(await screen.findAllByText(/light/i)).toHaveLength(1);
      expect(await screen.findAllByText(/dark/i)).toHaveLength(1);
      expect(await screen.findAllByText(/system/i)).toHaveLength(1);
    });
  });
});