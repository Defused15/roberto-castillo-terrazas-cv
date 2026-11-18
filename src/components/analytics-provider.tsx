'use client';

import {useEffect} from 'react';
import {initAnalytics, track} from '@/lib/analytics';

/**
 * Starts analytics after hydration (production hostnames only) and reports
 * each time the CV is printed. Renders nothing.
 */
export function AnalyticsProvider() {
  useEffect(() => {
    void initAnalytics(window.location.hostname);

    // Some browsers fire beforeprint more than once per dialog; count one print until afterprint.
    let printing = false;
    const onBeforePrint = () => {
      if (printing) return;
      printing = true;
      track('print_cv');
    };
    const onAfterPrint = () => {
      printing = false;
    };
    window.addEventListener('beforeprint', onBeforePrint);
    window.addEventListener('afterprint', onAfterPrint);
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint);
      window.removeEventListener('afterprint', onAfterPrint);
    };
  }, []);

  return null;
}
