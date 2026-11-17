import type { PostHogConfig } from "posthog-js";

/** Public PostHog project key (EU cloud, project 355591). Public by design. */
export const POSTHOG_KEY =
  process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_x2gSRigvddtDS2LJeuuJQgewp4aAzTPEbmFfTNisX8bm";

/** Hostnames that count as real visits. Localhost and Vercel previews never load analytics. */
export const PRODUCTION_HOSTS: readonly string[] = ["www.rcastillo.dev", "rcastillo.dev"];

/** Whether `hostname` is the production site, the only place analytics runs. */
export function isProductionHost(hostname: string): boolean {
  return PRODUCTION_HOSTS.includes(hostname);
}

/**
 * Privacy-first PostHog setup: no cookies or storage, no autocapture, no
 * session recording, no surveys, no person profiles. Only pageviews,
 * pageleaves and the explicit events in ./events.ts are sent.
 */
export const POSTHOG_OPTIONS = {
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
} as const satisfies Partial<PostHogConfig>;
