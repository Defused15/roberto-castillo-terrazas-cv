import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import manifest from "@/app/manifest";
import {
  OG_HIGHLIGHTS,
  OG_VALUE_LINE,
  siteMetadata,
  siteViewport,
} from "@/app/site-config";
import { RESUME_DATA_BY_LANG } from "@/data/resume-data";

describe("robots", () => {
  it("allows all, disallows /graphql and points to the sitemap", () => {
    const r = robots();
    expect(r.sitemap).toBe("https://www.rcastillo.dev/sitemap.xml");
    const rule = Array.isArray(r.rules) ? r.rules[0] : r.rules;
    expect(rule.allow).toBe("/");
    expect(rule.disallow).toContain("/graphql");
  });
});

describe("sitemap", () => {
  it("contains the home URL", () => {
    expect(sitemap().map((e) => e.url)).toEqual(["https://www.rcastillo.dev"]);
  });
});

describe("manifest", () => {
  it("has name and icons", () => {
    const m = manifest();
    expect(m.name).toBeTruthy();
    expect(m.icons?.map((i) => i.src)).toEqual([
      "/android-chrome-192x192.png",
      "/android-chrome-512x512.png",
    ]);
  });
});

describe("site metadata", () => {
  it("sets base, canonical and title template", () => {
    expect(siteMetadata.metadataBase?.href).toBe("https://www.rcastillo.dev/");
    expect(siteMetadata.alternates?.canonical).toBe("/");
    expect(siteMetadata.title).toMatchObject({
      template: "%s | Roberto Castillo",
    });
  });
  it("uses the visible headline as default title", () => {
    expect(siteMetadata.title).toMatchObject({
      default: "Roberto Castillo — QA Engineer | AI-Augmented SDET",
    });
  });
  it("has a concise description", () => {
    expect((siteMetadata.description ?? "").length).toBeLessThanOrEqual(165);
  });
  it("has profile open graph with locales", () => {
    expect(siteMetadata.openGraph).toMatchObject({
      type: "profile",
      locale: "en_US",
      alternateLocale: ["es_MX", "es_ES"],
    });
  });
  it("uses a large twitter card", () => {
    expect(siteMetadata.twitter).toMatchObject({ card: "summary_large_image" });
  });
  it("defines theme colors", () => {
    expect(siteViewport.themeColor).toHaveLength(2);
  });
});

describe("open graph card copy", () => {
  it("highlights Playwright, AI and API testing in 4-5 chips", () => {
    expect(OG_HIGHLIGHTS.length).toBeGreaterThanOrEqual(4);
    expect(OG_HIGHLIGHTS.length).toBeLessThanOrEqual(5);
    expect(OG_HIGHLIGHTS).toContain("Playwright");
    expect(OG_HIGHLIGHTS.some((h) => /\bAI\b/.test(h))).toBe(true);
    expect(OG_HIGHLIGHTS.some((h) => /\bAPI\b/.test(h))).toBe(true);
  });
  it("leads the value line with experience, projects and the current industry", () => {
    expect(OG_VALUE_LINE).toBe(
      "4+ years · 15+ projects · insurance, healthcare, e-commerce",
    );
  });
  it("states the same years of experience as the summaries and description", () => {
    expect(OG_VALUE_LINE.startsWith("4+ years")).toBe(true);
    expect(RESUME_DATA_BY_LANG.en.summary).toContain("4+ years");
    expect(RESUME_DATA_BY_LANG.es.summary).toContain("más de 4 años");
    expect(siteMetadata.description).toContain("4+ years");
  });
});
