import { POSTHOG_KEY, POSTHOG_OPTIONS, PRODUCTION_HOSTS, isProductionHost } from "@/lib/analytics/config";

describe("isProductionHost", () => {
  it.each(["www.rcastillo.dev", "rcastillo.dev"])("accepts the production host %s", (host) => {
    expect(isProductionHost(host)).toBe(true);
  });

  it.each([
    ["localhost", "localhost"],
    ["a loopback address", "127.0.0.1"],
    ["a Vercel preview", "roberto-castillo-terrazas-cv-git-dev-defused15.vercel.app"],
    ["a subdomain", "preview.rcastillo.dev"],
    ["a look-alike domain", "rcastillo.dev.evil.com"],
    ["an empty hostname", ""],
  ])("rejects %s", (_case, host) => {
    expect(isProductionHost(host)).toBe(false);
  });

  it("lists exactly the two production hostnames", () => {
    expect(PRODUCTION_HOSTS).toEqual(["www.rcastillo.dev", "rcastillo.dev"]);
  });
});

describe("PostHog config", () => {
  it("uses the public project key unless the environment overrides it", () => {
    expect(POSTHOG_KEY).toBe("phc_x2gSRigvddtDS2LJeuuJQgewp4aAzTPEbmFfTNisX8bm");
  });

  it("reads the key from NEXT_PUBLIC_POSTHOG_KEY when set", () => {
    process.env.NEXT_PUBLIC_POSTHOG_KEY = "phc_from_env";
    try {
      jest.isolateModules(() => {
        expect(require("@/lib/analytics/config").POSTHOG_KEY).toBe("phc_from_env");
      });
    } finally {
      delete process.env.NEXT_PUBLIC_POSTHOG_KEY;
    }
  });

  it("is EU-hosted, cookieless and captures nothing beyond pageviews and explicit events", () => {
    expect(POSTHOG_OPTIONS).toEqual({
      api_host: "https://eu.i.posthog.com",
      ui_host: "https://eu.posthog.com",
      cookieless_mode: "always",
      person_profiles: "never",
      autocapture: false,
      capture_pageview: "history_change",
      capture_pageleave: true,
      capture_heatmaps: false,
      capture_dead_clicks: false,
      disable_session_recording: true,
      disable_surveys: true,
      disable_web_experiments: true,
      respect_dnt: true,
    });
  });
});
