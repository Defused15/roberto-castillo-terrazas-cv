import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import manifest from "@/app/manifest";
import { siteMetadata, siteViewport } from "@/app/site-config";

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
    expect(sitemap().map((e) => e.url)).toEqual(["https://www.rcastillo.dev/"]);
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
    expect(siteMetadata.title).toMatchObject({ template: "%s | Roberto Castillo" });
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
