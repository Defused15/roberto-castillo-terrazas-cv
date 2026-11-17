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

const AV = 184; // avatar diameter
const ZOOM = 1.12; // crop in so the face fills the circle
const FACE = { x: 235 / 460, y: 200 / 460 }; // face centre in the source photo

function Avatar({ src }: { src: string }) {
  const img = Math.round(AV * ZOOM);
  const left = Math.round(AV / 2 - FACE.x * img);
  const top = Math.round(AV / 2 - FACE.y * img);
  const photo = (
    <div
      style={{
        display: "flex",
        width: AV,
        height: AV,
        borderRadius: 999,
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
      <img
        src={src}
        width={img}
        height={img}
        style={{ position: "absolute", left, top }}
      />
      {/* hairline inner border */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: AV,
          height: AV,
          display: "flex",
          borderRadius: 999,
          border: "1px solid rgba(255,255,255,0.14)",
        }}
      />
    </div>
  );

  // No hard ring: a hairline edge plus a soft emerald halo give depth without weight.
  return (
    <div
      style={{
        display: "flex",
        borderRadius: 999,
        boxShadow: "0 0 70px 6px rgba(52,211,153,0.22)",
      }}
    >
      {photo}
    </div>
  );
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
        {/* soft glow centred on the avatar */}
        <div
          style={{
            position: "absolute",
            top: -10,
            left: 650,
            width: 760,
            height: 560,
            display: "flex",
            backgroundImage:
              "radial-gradient(closest-side, rgba(52,211,153,0.13), transparent)",
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
            justifyContent: "center",
            padding: "0 80px",
          }}
        >
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
                width: 10,
                height: 10,
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
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 26,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div
                style={{
                  display: "flex",
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
                  marginTop: 22,
                  fontSize: 42,
                  color: C.accent,
                }}
              >
                {RESUME_DATA.about}
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: 16,
                  fontSize: 26,
                  color: C.soft,
                }}
              >
                {OG_VALUE_LINE}
              </div>
            </div>
            <Avatar src={avatar} />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 52,
              paddingTop: 32,
              borderTop: "1px solid rgba(255,255,255,0.09)",
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
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.16)",
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
