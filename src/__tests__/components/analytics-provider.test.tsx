import {render} from '@testing-library/react';
import {AnalyticsProvider} from '@/components/analytics-provider';
import {capturedEvents, posthogMock, startAnalytics} from '@/test/analytics';

// jsdom serves the page from http://localhost, like `next dev`. These tests run
// first: analytics state lives in the module, and later tests start it.
describe('AnalyticsProvider on localhost', () => {
  it('renders nothing and never starts PostHog', async () => {
    const {container} = render(<AnalyticsProvider />);
    expect(container).toBeEmptyDOMElement();
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(posthogMock.init).not.toHaveBeenCalled();
  });

  it('does not report prints while analytics is off', () => {
    render(<AnalyticsProvider />);
    window.dispatchEvent(new Event('beforeprint'));
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });
});

describe('AnalyticsProvider, print_cv', () => {
  beforeEach(startAnalytics);

  const print = () => {
    window.dispatchEvent(new Event('beforeprint'));
    window.dispatchEvent(new Event('afterprint'));
  };

  it('reports each print once', () => {
    render(<AnalyticsProvider />);
    print();
    print();
    expect(capturedEvents()).toEqual([
      ['print_cv', undefined],
      ['print_cv', undefined],
    ]);
  });

  it('counts a repeated beforeprint within one print dialog once', () => {
    render(<AnalyticsProvider />);
    window.dispatchEvent(new Event('beforeprint'));
    window.dispatchEvent(new Event('beforeprint'));
    expect(capturedEvents()).toEqual([['print_cv', undefined]]);
  });

  it('stops listening when unmounted', () => {
    const {unmount} = render(<AnalyticsProvider />);
    unmount();
    print();
    expect(posthogMock.capture).not.toHaveBeenCalled();
  });
});
