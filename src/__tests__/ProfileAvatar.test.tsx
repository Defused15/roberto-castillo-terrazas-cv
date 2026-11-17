import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProfileAvatar } from "@/components/profile-avatar";
import { RESUME_DATA } from "@/data/resume-data";

describe("ProfileAvatar", () => {
  it("renders the self-hosted image with the name as alt", () => {
    render(<ProfileAvatar src={RESUME_DATA.avatarUrl} alt={RESUME_DATA.name} fallback="RC" />);
    const img = screen.getByAltText("Roberto Castillo");
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain("/avatar");
  });

  it("falls back to initials when the image fails", () => {
    render(<ProfileAvatar src="/avatar.jpg" alt="Roberto Castillo" fallback="RC" />);
    fireEvent.error(screen.getByAltText("Roberto Castillo"));
    expect(screen.getByText("RC")).toBeInTheDocument();
  });
});
