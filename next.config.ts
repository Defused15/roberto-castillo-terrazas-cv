import type {NextConfig} from 'next';

const isDev = process.env.NODE_ENV === 'development';

/** PostHog EU cloud: events and flags go to the API host, lazy-loaded bundles come from the assets host. */
const POSTHOG_API = 'https://eu.i.posthog.com';
const POSTHOG_ASSETS = 'https://eu-assets.i.posthog.com';
/**
 * Vercel Web Analytics loads /_vercel/insights/script.js and posts to /_vercel/insights/*
 * (same origin, covered by 'self'). Outside production it loads the debug script from here.
 */
const VERCEL_SCRIPTS = 'https://va.vercel-scripts.com';

/**
 * 'unsafe-inline' scripts are needed for Next's inline bootstrap/flight data, the JSON-LD
 * block, next-themes' no-flash script and the toolbar cleanup in the root layout: the site
 * is fully static, so per-request nonces are not available. 'unsafe-eval' is dev only
 * (React uses eval for debugging callstacks); production never allows it.
 */
const contentSecurityPolicy = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline'${isDev ? ` 'unsafe-eval'` : ''} ${POSTHOG_ASSETS} ${VERCEL_SCRIPTS}`,
  `connect-src 'self' ${POSTHOG_API} ${POSTHOG_ASSETS}`,
  `img-src 'self' data: blob:`,
  `style-src 'self' 'unsafe-inline'`,
  `font-src 'self' data:`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'none'`,
  `upgrade-insecure-requests`,
].join('; ');

// HSTS is not set here: Vercel already sends Strict-Transport-Security for the domain.
const securityHeaders = [
  {key: 'Content-Security-Policy', value: contentSecurityPolicy},
  {key: 'X-Content-Type-Options', value: 'nosniff'},
  {key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin'},
  // browsing-topics replaces the retired FLoC interest-cohort feature.
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {key: 'X-Frame-Options', value: 'DENY'},
];

const nextConfig: NextConfig = {
  // Do not advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  agentRules: false,
  // Global CSS (~20 kB raw) goes inline in each static HTML page instead of a
  // render-blocking stylesheet request: mobile Lighthouse FCP 0.9 s -> 0.75 s.
  // Allowed by the CSP's style-src 'unsafe-inline'.
  experimental: {inlineCss: true},
  async headers() {
    return [{source: '/:path*', headers: securityHeaders}];
  },
};

export default nextConfig;
