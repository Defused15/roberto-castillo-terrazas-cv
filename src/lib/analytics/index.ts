import type { PostHog } from "posthog-js";
import { POSTHOG_KEY, POSTHOG_OPTIONS, isProductionHost } from "./config";
import type { AnalyticsEvent, EventArgs } from "./events";

export type { AnalyticsEvent, AnalyticsEvents } from "./events";

let client: PostHog | null = null;
let initializing: Promise<boolean> | null = null;
let markReady: () => void;
const ready = new Promise<void>((resolve) => {
  markReady = resolve;
});

/**
 * Loads and starts PostHog, but only on the production hostnames. posthog-js
 * is imported lazily so it stays out of the first-load bundle. Safe to call
 * more than once. Resolves to whether analytics is running.
 */
export function initAnalytics(hostname: string): Promise<boolean> {
  if (!isProductionHost(hostname)) return Promise.resolve(false);
  initializing ??= import("posthog-js").then(({ default: posthog }) => {
    posthog.init(POSTHOG_KEY, POSTHOG_OPTIONS);
    client = posthog;
    markReady();
    return true;
  });
  return initializing;
}

/** Sends a custom event. A no-op while analytics is not running (localhost, previews, blocked). */
export function track<E extends AnalyticsEvent>(event: E, ...[props]: EventArgs<E>): void {
  client?.capture(event, props);
}

/** Like `track`, but waits for analytics to start; for events fired on mount. */
export function trackWhenReady<E extends AnalyticsEvent>(event: E, ...args: EventArgs<E>): void {
  void ready.then(() => track(event, ...args));
}
