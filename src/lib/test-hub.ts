export const TEST_HUB_URL = 'https://qa.rcastillo.dev';

const REPORTS_BASE =
  'https://raw.githubusercontent.com/Defused15/test-hub/main/projects';

export const CV_REPO =
  'https://github.com/Defused15/roberto-castillo-terrazas-cv';
export const QA_PLAYGROUND_REPO =
  'https://github.com/Defused15/QA-Playground-Tests';

export type TestHubStats = {
  total: number;
  passed: number;
  /** ISO date of the run, e.g. "2026-11-18". */
  ranOn: string;
};

/** Live results keyed by the project's GitHub URL (the `githubLink` of its card). */
export type TestHubResults = Partial<Record<string, TestHubStats>>;

type JestReport = {
  numTotalTests?: unknown;
  numPassedTests?: unknown;
  numFailedTests?: unknown;
  success?: unknown;
  startTime?: unknown;
};

type PlaywrightReport = {
  stats?: {
    startTime?: unknown;
    expected?: unknown;
    unexpected?: unknown;
    flaky?: unknown;
    skipped?: unknown;
  };
};

/** Keeps only a green, well-formed Jest report; anything else hides the badge. */
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
 * Keeps only a green, well-formed Playwright JSON report. Flaky tests passed on a
 * retry, so they count as passing; skipped tests count towards the total only.
 */
export function parsePlaywrightReport(
  report: PlaywrightReport,
): TestHubStats | null {
  const {startTime, expected, unexpected, flaky, skipped} = report.stats ?? {};
  if (
    typeof expected !== 'number' ||
    typeof flaky !== 'number' ||
    typeof skipped !== 'number' ||
    typeof startTime !== 'string' ||
    unexpected !== 0 ||
    expected + flaky <= 0
  ) {
    return null;
  }
  const ran = new Date(startTime);
  if (Number.isNaN(ran.getTime())) return null;
  return {
    total: expected + flaky + skipped,
    passed: expected + flaky,
    ranOn: ran.toISOString().slice(0, 10),
  };
}

/** Projects whose CI publishes a report to the QA Test Hub on every push to main. */
export const TEST_HUB_REPORTS = [
  {
    repo: CV_REPO,
    url: `${REPORTS_BASE}/roberto-castillo-terrazas-cv/latest.json`,
    parse: parseTestHubReport,
  },
  {
    repo: QA_PLAYGROUND_REPO,
    url: `${REPORTS_BASE}/QA-Playground-Tests/latest.json`,
    parse: parsePlaywrightReport,
  },
] as const;

async function fetchReport(
  url: string,
  parse: (report: never) => TestHubStats | null,
): Promise<TestHubStats | null> {
  try {
    const res = await fetch(url, {cache: 'force-cache'});
    if (!res.ok) return null;
    return parse((await res.json()) as never);
  } catch {
    return null;
  }
}

/**
 * Reads the latest reports at build time. The site is static, so this runs once per
 * build (the weekly scheduled redeploy refreshes it). A project whose report fails
 * to load, or is not green, is left out and its card renders without the badge.
 */
export async function fetchTestHubResults(): Promise<TestHubResults> {
  const stats = await Promise.all(
    TEST_HUB_REPORTS.map(r => fetchReport(r.url, r.parse)),
  );
  const results: TestHubResults = {};
  TEST_HUB_REPORTS.forEach((r, i) => {
    const s = stats[i];
    if (s) results[r.repo] = s;
  });
  return results;
}
