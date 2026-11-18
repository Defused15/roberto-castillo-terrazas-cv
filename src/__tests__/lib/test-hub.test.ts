import {
  fetchTestHubStats,
  parseTestHubReport,
  TEST_HUB_REPORT_URL,
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

describe('fetchTestHubStats', () => {
  const realFetch = global.fetch;
  afterEach(() => {
    global.fetch = realFetch;
  });

  it('reads the public report from the Test Hub', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => GREEN,
    }) as unknown as typeof fetch;
    await expect(fetchTestHubStats()).resolves.toEqual({
      total: 435,
      passed: 435,
      ranOn: '2026-11-18',
    });
    expect(global.fetch).toHaveBeenCalledWith(
      TEST_HUB_REPORT_URL,
      expect.anything(),
    );
  });

  it('returns null when the Test Hub answers with an error status', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ok: false}) as unknown as typeof fetch;
    await expect(fetchTestHubStats()).resolves.toBeNull();
  });

  it('returns null when the request fails', async () => {
    global.fetch = jest
      .fn()
      .mockRejectedValue(new Error('offline')) as unknown as typeof fetch;
    await expect(fetchTestHubStats()).resolves.toBeNull();
  });
});
