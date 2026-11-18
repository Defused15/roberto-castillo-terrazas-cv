import {
  CV_REPO,
  fetchTestHubResults,
  parseNewmanReport,
  parsePlaywrightReport,
  parseTestHubReport,
  QA_PLAYGROUND_REPO,
  RESTFUL_BOOKER_REPO,
  TEST_HUB_REPORTS,
} from '@/lib/test-hub';

const GREEN = {
  numTotalTests: 435,
  numPassedTests: 435,
  numFailedTests: 0,
  success: true,
  startTime: Date.UTC(2026, 10, 18, 9, 0),
};

describe('parseTestHubReport', () => {
  it('keeps the totals and the run date of a green report', () => {
    expect(parseTestHubReport(GREEN)).toEqual({
      total: 435,
      passed: 435,
      ranOn: '2026-11-18',
    });
  });

  it.each([
    ['a failing run', {...GREEN, numFailedTests: 1, success: false}],
    ['an unsuccessful run', {...GREEN, success: false}],
    ['failures without the success flag', {...GREEN, numFailedTests: 2}],
    ['an empty run', {...GREEN, numTotalTests: 0, numPassedTests: 0}],
    ['a missing total', {...GREEN, numTotalTests: undefined}],
    ['a missing passed count', {...GREEN, numPassedTests: '435'}],
    ['a missing start time', {...GREEN, startTime: undefined}],
  ])('hides the badge for %s', (_, report) => {
    expect(parseTestHubReport(report)).toBeNull();
  });
});

const PW_GREEN = {
  stats: {
    startTime: '2026-11-18T11:22:16.290Z',
    expected: 971,
    unexpected: 0,
    flaky: 0,
    skipped: 1,
  },
};

describe('parsePlaywrightReport', () => {
  it('counts passed and skipped tests of a green run', () => {
    expect(parsePlaywrightReport(PW_GREEN)).toEqual({
      total: 972,
      passed: 971,
      ranOn: '2026-11-18',
    });
  });

  it('counts flaky tests as passing, since they passed on a retry', () => {
    expect(
      parsePlaywrightReport({stats: {...PW_GREEN.stats, flaky: 2}}),
    ).toEqual({total: 974, passed: 973, ranOn: '2026-11-18'});
  });

  it.each([
    ['a failing run', {...PW_GREEN.stats, unexpected: 1}],
    ['a missing failure count', {...PW_GREEN.stats, unexpected: undefined}],
    ['a run where nothing passed', {...PW_GREEN.stats, expected: 0}],
    ['a missing passed count', {...PW_GREEN.stats, expected: '971'}],
    ['a missing flaky count', {...PW_GREEN.stats, flaky: undefined}],
    ['a missing skipped count', {...PW_GREEN.stats, skipped: undefined}],
    ['a missing start time', {...PW_GREEN.stats, startTime: undefined}],
    ['an invalid start time', {...PW_GREEN.stats, startTime: 'yesterday'}],
  ])('hides the badge for %s', (_, stats) => {
    expect(parsePlaywrightReport({stats})).toBeNull();
  });

  it('hides the badge for a report without stats', () => {
    expect(parsePlaywrightReport({})).toBeNull();
  });
});

const NEWMAN_GREEN = {
  run: {
    stats: {
      items: {total: 34, pending: 0, failed: 0},
      assertions: {total: 106, pending: 0, failed: 0},
    },
    timings: {started: Date.UTC(2026, 10, 18, 9, 0)},
    failures: [],
    error: null,
  },
};
const newman = (run: Record<string, unknown>) => ({
  run: {...NEWMAN_GREEN.run, ...run},
});
const STATS_OF = (stats: Record<string, unknown>) =>
  newman({stats: {...NEWMAN_GREEN.run.stats, ...stats}});

describe('parseNewmanReport', () => {
  it('counts each request as one test, as the Test Hub does', () => {
    expect(parseNewmanReport(NEWMAN_GREEN)).toEqual({
      total: 34,
      passed: 34,
      ranOn: '2026-11-18',
    });
  });

  it.each([
    ['a failed request', STATS_OF({items: {total: 34, failed: 1}})],
    ['a failed assertion', STATS_OF({assertions: {total: 106, failed: 1}})],
    ['a missing assertion count', STATS_OF({assertions: undefined})],
    ['an empty run', STATS_OF({items: {total: 0, failed: 0}})],
    ['a missing request count', STATS_OF({items: undefined})],
    ['listed failures', newman({failures: [{error: {}}]})],
    ['missing failures', newman({failures: undefined})],
    ['a run error', newman({error: {message: 'ECONNREFUSED'}})],
    ['a missing start time', newman({timings: {}})],
    ['a report without a run', {}],
  ])('hides the badge for %s', (_, report) => {
    expect(parseNewmanReport(report)).toBeNull();
  });
});

describe('fetchTestHubResults', () => {
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
  });

  const urlOf = (repo: string) =>
    TEST_HUB_REPORTS.find(r => r.repo === repo)!.url;
  const serve = (responses: Record<string, unknown>) => {
    global.fetch = jest.fn(async (url: string) => {
      const body = responses[url];
      if (body instanceof Error) throw body;
      return body === undefined
        ? {ok: false}
        : {ok: true, json: async () => body};
    }) as unknown as typeof fetch;
  };

  it('reads every project report from the Test Hub, keyed by repo', async () => {
    serve({
      [urlOf(CV_REPO)]: GREEN,
      [urlOf(QA_PLAYGROUND_REPO)]: PW_GREEN,
      [urlOf(RESTFUL_BOOKER_REPO)]: NEWMAN_GREEN,
    });
    await expect(fetchTestHubResults()).resolves.toEqual({
      [CV_REPO]: {total: 435, passed: 435, ranOn: '2026-11-18'},
      [QA_PLAYGROUND_REPO]: {total: 972, passed: 971, ranOn: '2026-11-18'},
      [RESTFUL_BOOKER_REPO]: {total: 34, passed: 34, ranOn: '2026-11-18'},
    });
    expect(global.fetch).toHaveBeenCalledTimes(TEST_HUB_REPORTS.length);
  });

  it('parses each report with its own reporter format', async () => {
    // Swapped formats are not green for either parser.
    serve({
      [urlOf(CV_REPO)]: PW_GREEN,
      [urlOf(QA_PLAYGROUND_REPO)]: NEWMAN_GREEN,
      [urlOf(RESTFUL_BOOKER_REPO)]: GREEN,
    });
    await expect(fetchTestHubResults()).resolves.toEqual({});
  });

  it('leaves out a project whose report answers with an error status', async () => {
    serve({[urlOf(CV_REPO)]: GREEN});
    await expect(fetchTestHubResults()).resolves.toEqual({
      [CV_REPO]: {total: 435, passed: 435, ranOn: '2026-11-18'},
    });
  });

  it('leaves out a project whose request fails', async () => {
    serve({
      [urlOf(CV_REPO)]: new Error('offline'),
      [urlOf(QA_PLAYGROUND_REPO)]: PW_GREEN,
    });
    await expect(fetchTestHubResults()).resolves.toEqual({
      [QA_PLAYGROUND_REPO]: {total: 972, passed: 971, ranOn: '2026-11-18'},
    });
  });

  it('leaves out a project whose report is not green', async () => {
    serve({
      [urlOf(CV_REPO)]: {...GREEN, success: false},
      [urlOf(QA_PLAYGROUND_REPO)]: PW_GREEN,
    });
    await expect(fetchTestHubResults()).resolves.toEqual({
      [QA_PLAYGROUND_REPO]: {total: 972, passed: 971, ranOn: '2026-11-18'},
    });
  });

  it('points each project at its own report', () => {
    expect(urlOf(CV_REPO)).toMatch(
      /\/roberto-castillo-terrazas-cv\/latest\.json$/,
    );
    expect(urlOf(QA_PLAYGROUND_REPO)).toMatch(
      /\/QA-Playground-Tests\/latest\.json$/,
    );
    expect(urlOf(RESTFUL_BOOKER_REPO)).toMatch(
      /\/Restful-Booker\/latest\.json$/,
    );
  });
});
