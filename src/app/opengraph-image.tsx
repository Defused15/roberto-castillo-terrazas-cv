import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { RESUME_DATA } from "@/data/resume-data";
import { OG_HIGHLIGHTS, OG_VALUE_LINE, SITE_DOMAIN } from "@/app/site-config";

const LOCATIONS = RESUME_DATA.locations.map((l) => l.name).join(" · ");

const SKILLS = OG_HIGHLIGHTS.join(", ");
const PLACES = RESUME_DATA.locations.map((l) => l.name).join(" and ");

export const alt = `Social card for ${RESUME_DATA.name}, ${
  RESUME_DATA.about
}: ${OG_VALUE_LINE.replaceAll(
  " · ",
  ", ",
)}. Skills: ${SKILLS}. Based in ${PLACES}. ${SITE_DOMAIN}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Palette: gray-900 family from the site's dark mode plus a single emerald accent.
const C = {
  bg: "#0b1120",
  fg: "#f9fafb",
  soft: "#d1d5db",
  muted: "#9ca3af",
  accent: "#34d399",
};

// Self-hosted avatar, inlined at build time so rendering needs no network.
function loadAvatar(): string {
  const file = readFileSync(join(process.cwd(), "public", "avatar.jpg"));
  return `data:image/jpeg;base64,${file.toString("base64")}`;
}

export default function OpengraphImage() {
  const avatar = loadAvatar();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          background: C.bg,
          color: C.fg,
        }}
      >
        {/* fine grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(180deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            backgroundImage:
              "linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* glow behind avatar */}
        <div
          style={{
            position: "absolute",
            top: -120,
            right: -160,
            width: 760,
            height: 760,
            display: "flex",
            backgroundImage:
              "radial-gradient(circle, rgba(52,211,153,0.20) 0%, rgba(52,211,153,0.06) 40%, transparent 68%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "56px 72px 60px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  fontSize: 26,
                  color: C.muted,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    width: 12,
                    height: 12,
                    borderRadius: 999,
                    background: C.accent,
                    marginRight: 14,
                  }}
                />
                {SITE_DOMAIN}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 30,
                  fontSize: 96,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                }}
              >
                {RESUME_DATA.name}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 24,
                  fontSize: 42,
                  color: C.accent,
                }}
              >
                {RESUME_DATA.about}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 18,
                  fontSize: 26,
                  color: C.soft,
                }}
              >
                {OG_VALUE_LINE}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                width: 272,
                height: 272,
                flexShrink: 0,
                borderRadius: 999,
                padding: 5,
                backgroundImage: `linear-gradient(140deg, ${C.accent}, rgba(52,211,153,0.12))`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
              <img
                src={avatar}
                width={262}
                height={262}
                style={{ borderRadius: 999, border: `6px solid ${C.bg}` }}
              />
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: 30,
              borderTop: "1px solid rgba(255,255,255,0.10)",
            }}
          >
            <div style={{ display: "flex" }}>
              {OG_HIGHLIGHTS.map((h) => (
                <div
                  key={h}
                  style={{
                    display: "flex",
                    fontSize: 28,
                    color: C.fg,
                    padding: "10px 24px",
                    marginRight: 14,
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.06)",
                    border: "1.5px solid rgba(255,255,255,0.18)",
                  }}
                >
                  {h}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", fontSize: 26, color: C.muted }}>
              {LOCATIONS}
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
