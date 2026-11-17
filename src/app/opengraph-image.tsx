import { ImageResponse } from "next/og";
import { RESUME_DATA } from "@/data/resume-data";

export const alt = `${RESUME_DATA.name} — ${RESUME_DATA.about}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const COLORS = {
  bg: "#111827",
  fg: "#f9fafb",
  muted: "#9ca3af",
  soft: "#d1d5db",
  accent: "#22c55e",
};

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: COLORS.bg,
          color: COLORS.fg,
          borderTop: `12px solid ${COLORS.accent}`,
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: 16,
              background: COLORS.fg,
              color: COLORS.bg,
              fontSize: 32,
            }}
          >
            {RESUME_DATA.initials}
          </div>
          <div
            style={{
              display: "flex",
              marginLeft: 20,
              fontSize: 30,
              color: COLORS.muted,
            }}
          >
            rcastillo.dev
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 92,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            {RESUME_DATA.name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 20,
              fontSize: 46,
              color: COLORS.soft,
            }}
          >
            {RESUME_DATA.about}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 28,
            color: COLORS.muted,
          }}
        >
          <div style={{ display: "flex" }}>
            {RESUME_DATA.locations.map((l) => l.name).join(" · ")}
          </div>
          <div style={{ display: "flex" }}>
            Playwright · Cypress · API · CI/CD
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
