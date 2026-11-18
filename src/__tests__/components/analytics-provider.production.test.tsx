/**
 * @jest-environment-options {"url": "https://www.rcastillo.dev/"}
 */
import {render, waitFor} from '@testing-library/react';
import {AnalyticsProvider} from '@/components/analytics-provider';
import {POSTHOG_KEY} from '@/lib/analytics/config';
import {posthogMock} from '@/test/analytics';

describe('AnalyticsProvider on www.rcastillo.dev', () => {
  it('starts PostHog once, EU-hosted and cookieless, without autocapture or recordings', async () => {
    render(<AnalyticsProvider />);
    await waitFor(() => expect(posthogMock.init).toHaveBeenCalledTimes(1));
    expect(posthogMock.init).toHaveBeenCalledWith(
      POSTHOG_KEY,
      expect.objectContaining({
        api_host: 'https://eu.i.posthog.com',
        cookieless_mode: 'always',
        autocapture: false,
        disable_session_recording: true,
      }),
    );
  });
});
