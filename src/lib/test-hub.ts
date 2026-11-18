/** Public Jest report the CI publishes to the QA Test Hub on every push to main. */
export const TEST_HUB_REPORT_URL =
  'https://raw.githubusercontent.com/Defused15/test-hub/main/projects/roberto-castillo-terrazas-cv/latest.json';
export const TEST_HUB_URL = 'https://qa.rcastillo.dev';

export type TestHubStats = {
  total: number;
  passed: number;
  /** ISO date of the run, e.g. "2026-11-18". */
  ranOn: string;
};

type JestReport = {
  numTotalTests?: unknown;
  numPassedTests?: unknown;
  numFailedTests?: unknown;
  success?: unknown;
  startTime?: unknown;
};

/** Keeps only a green, well-formed report; anything else hides the badge. */
export function parseTestHubReport(report: JestReport): TestHubStats | null {
  const {numTotalTests, numPassedTests, numFailedTests, success, startTime} =
    report;
  if (
    typeof numTotalTests !== 'number' ||
    typeof numPassedTests !== 'number' ||
    typeof startTime !== 'number' ||
    numTotalTests <= 0 ||
    numFailedTests !== 0 ||
    success !== true
  ) {
    return null;
  }
  return {
    total: numTotalTests,
    passed: numPassedTests,
    ranOn: new Date(startTime).toISOString().slice(0, 10),
  };
}

/**
 * Reads the latest report at build time. The site is static, so this runs once per
 * build (the weekly scheduled redeploy refreshes it). Any failure returns null and
 * the page renders without the badge.
 */
export async function fetchTestHubStats(): Promise<TestHubStats | null> {
  try {
    const res = await fetch(TEST_HUB_REPORT_URL, {cache: 'force-cache'});
    if (!res.ok) return null;
    return parseTestHubReport((await res.json()) as JestReport);
  } catch {
    return null;
  }
}
