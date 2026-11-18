import posthog from 'posthog-js';
import {initAnalytics} from '@/lib/analytics';
import {PRODUCTION_HOSTS} from '@/lib/analytics/config';

/** The posthog-js mock from __mocks__/posthog-js.ts. */
export const posthogMock = jest.mocked(posthog);

/**
 * Starts analytics as on the production site and forgets earlier captures.
 * Call it in beforeEach of tests that check which events a component sends.
 */
export async function startAnalytics() {
  await initAnalytics(PRODUCTION_HOSTS[0]);
  posthogMock.capture.mockClear();
}

/** Events sent so far, as [name, props] pairs. */
export const capturedEvents = () =>
  posthogMock.capture.mock.calls.map(([event, props]) => [event, props]);

/**
 * Stops link clicks from navigating (jsdom cannot, and would log an error),
 * after React's handlers have run. Returns the cleanup.
 */
export function preventNavigation() {
  const stop = (e: Event) => e.preventDefault();
  document.addEventListener('click', stop);
  return () => document.removeEventListener('click', stop);
}
