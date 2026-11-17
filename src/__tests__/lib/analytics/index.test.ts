import { POSTHOG_KEY } from "@/lib/analytics/config";

type Analytics = typeof import("@/lib/analytics");
type PostHogMock = { init: jest.Mock; capture: jest.Mock };

/**
 * A fresh copy of the analytics module (it keeps state) and the posthog-js mock
 * it sees. The registry is reset rather than isolated because posthog-js is
 * imported lazily, after an isolateModules callback would have returned.
 */
function load(): { analytics: Analytics; posthog: PostHogMock } {
  jest.resetModules();
  return {
    analytics: require("@/lib/analytics"),
    posthog: require("posthog-js").default,
  };
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("initAnalytics", () => {
  it("starts PostHog with the project key and the privacy options on the production site", async () => {
    const { analytics, posthog } = load();
    await expect(analytics.initAnalytics("www.rcastillo.dev")).resolves.toBe(true);
    expect(posthog.init).toHaveBeenCalledTimes(1);
    expect(posthog.init).toHaveBeenCalledWith(
      POSTHOG_KEY,
      expect.objectContaining({
        api_host: "https://eu.i.posthog.com",
        cookieless_mode: "always",
        autocapture: false,
        disable_session_recording: true,
        person_profiles: "never",
      }),
    );
  });

  it.each(["localhost", "my-branch-defused15.vercel.app"])("does not start on %s", async (host) => {
    const { analytics, posthog } = load();
    await expect(analytics.initAnalytics(host)).resolves.toBe(false);
    expect(posthog.init).not.toHaveBeenCalled();
  });

  it("starts PostHog only once however often it is called", async () => {
    const { analytics, posthog } = load();
    await Promise.all([analytics.initAnalytics("rcastillo.dev"), analytics.initAnalytics("rcastillo.dev")]);
    await analytics.initAnalytics("www.rcastillo.dev");
    expect(posthog.init).toHaveBeenCalledTimes(1);
  });
});

describe("track", () => {
  it("is a no-op before analytics starts", () => {
    const { analytics, posthog } = load();
    analytics.track("contact_email");
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("stays a no-op off the production site", async () => {
    const { analytics, posthog } = load();
    await analytics.initAnalytics("localhost");
    analytics.track("language_switch", { to: "es" });
    expect(posthog.capture).not.toHaveBeenCalled();
  });

  it("sends the event and its properties once analytics runs", async () => {
    const { analytics, posthog } = load();
    await analytics.initAnalytics("www.rcastillo.dev");
    analytics.track("language_switch", { to: "es" });
    analytics.track("print_cv");
    expect(posthog.capture.mock.calls).toEqual([
      ["language_switch", { to: "es" }],
      ["print_cv", undefined],
    ]);
  });
});

describe("trackWhenReady", () => {
  it("holds the event until analytics starts, then sends it once", async () => {
    const { analytics, posthog } = load();
    analytics.trackWhenReady("not_found", { path: "/missing" });
    await flush();
    expect(posthog.capture).not.toHaveBeenCalled();

    await analytics.initAnalytics("www.rcastillo.dev");
    await flush();
    expect(posthog.capture.mock.calls).toEqual([["not_found", { path: "/missing" }]]);
  });

  it("never sends anything off the production site", async () => {
    const { analytics, posthog } = load();
    analytics.trackWhenReady("not_found", { path: "/missing" });
    await analytics.initAnalytics("localhost");
    await flush();
    expect(posthog.capture).not.toHaveBeenCalled();
  });
});
