import {readFileSync} from 'fs';
import {join} from 'path';

// The root layout only runs inside Next.js, so its analytics wiring is checked in source.
const layout = readFileSync(join(process.cwd(), 'src/app/layout.tsx'), 'utf8');

describe('root layout analytics', () => {
  it('no longer loads Google Analytics', () => {
    expect(layout).not.toMatch(
      /googletagmanager|gtag|dataLayer|G-[A-Z0-9]{6,}/,
    );
  });

  it('renders Vercel Analytics and the PostHog provider', () => {
    expect(layout).toMatch(/<Analytics \/>/);
    expect(layout).toMatch(/<AnalyticsProvider \/>/);
  });

  it('only renders Vercel Analytics on Vercel builds', () => {
    expect(layout).toMatch(/const onVercel = process\.env\.VERCEL === "1"/);
    expect(layout).toMatch(/\{onVercel \? \(\s*<>\s*<Analytics \/>/);
  });
});
