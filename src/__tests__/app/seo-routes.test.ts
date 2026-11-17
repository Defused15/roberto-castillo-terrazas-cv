/** @jest-environment node */
import { existsSync } from "fs";
import { join } from "path";
import robots from "@/app/robots";
import sitemap from "@/app/sitemap";
import manifest from "@/app/manifest";
import { SITE_TITLE, SITE_URL, siteMetadata, siteViewport } from "@/app/site-config";
import { LANGS, RESUME_DATA } from "@/data/resume-data";

const inPublic = (url: string) => existsSync(join(process.cwd(), "public", url));
const origin = new URL(SITE_URL).origin;

describe("robots.txt", () => {
  it("lets every crawler in and points it at the sitemap on the canonical host", () => {
    const { rules, sitemap: sitemapUrl, host } = robots();
    expect([rules].flat()).toContainEqual(expect.objectContaining({ userAgent: "*", allow: "/" }));
    expect(sitemapUrl).toBe(`${SITE_URL}/sitemap.xml`);
    expect(host).toBe(SITE_URL);
  });
});

describe("sitemap.xml", () => {
  it("lists the home page and only https URLs on the canonical host", () => {
    const urls = sitemap().map((e) => new URL(e.url));
    expect(urls.map((u) => u.href)).toContain(`${SITE_URL}/`);
    expect(urls.filter((u) => u.protocol !== "https:" || u.origin !== origin)).toEqual([]);
  });
});

describe("web manifest", () => {
  it("is named after the site and only references icons that exist in /public", () => {
    const { name, icons = [] } = manifest();
    expect(name).toBe(SITE_TITLE);
    expect(icons.map((i) => i.src).filter((src) => !inPublic(src))).toEqual([]);
  });
});

describe("site metadata", () => {
  it("resolves relative URLs against the canonical https host", () => {
    expect(siteMetadata.metadataBase?.origin).toBe(origin);
    expect(siteMetadata.metadataBase?.protocol).toBe("https:");
    expect(siteMetadata.alternates?.canonical).toBe("/");
  });

  it("titles pages with the visible name and headline", () => {
    expect(SITE_TITLE).toBe(`${RESUME_DATA.name} — ${RESUME_DATA.about}`);
    expect(siteMetadata.title).toEqual({
      default: SITE_TITLE,
      template: `%s | ${RESUME_DATA.name}`,
    });
  });

  it("has a description that fits a search snippet", () => {
    expect(siteMetadata.description?.trim()).toBeTruthy();
    expect(siteMetadata.description!.length).toBeLessThanOrEqual(165);
  });

  it("is indexable", () => {
    expect(siteMetadata.robots).toMatchObject({ index: true, follow: true });
  });

  it("shares as a profile card with an Open Graph locale for every site language", () => {
    expect(siteMetadata.openGraph).toMatchObject({ type: "profile", title: SITE_TITLE });
    expect(siteMetadata.twitter).toMatchObject({ card: "summary_large_image", title: SITE_TITLE });
    const og = siteMetadata.openGraph as { locale?: string; alternateLocale?: string[] };
    const locales = [og.locale, ...(og.alternateLocale ?? [])];
    expect(locales.filter((l) => !/^[a-z]{2}_[A-Z]{2}$/.test(l ?? ""))).toEqual([]);
    expect(og.locale?.slice(0, 2)).toBe(LANGS[0]);
    expect(LANGS.filter((lang) => !locales.some((l) => l?.startsWith(`${lang}_`)))).toEqual([]);
  });

  it("only references icons that exist in /public", () => {
    const icons = [siteMetadata.icons].flat() as { url: string }[];
    expect(icons.length).toBeGreaterThan(0);
    expect(icons.map((i) => i.url).filter((url) => !inPublic(url))).toEqual([]);
  });

  it("sets a valid theme colour for both light and dark schemes", () => {
    const colors = [siteViewport.themeColor].flat() as { media?: string; color: string }[];
    const schemes = colors.map((c) => c.media?.match(/prefers-color-scheme: (\w+)/)?.[1]);
    expect(schemes.sort()).toEqual(["dark", "light"]);
    expect(colors.filter((c) => !/^#[0-9a-f]{6}$/i.test(c.color))).toEqual([]);
  });
});
