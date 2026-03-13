#!/usr/bin/env node
/**
 * generate-jest-dashboard.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Reads Jest's JSON reporter output and generates a self-contained
 * dashboard HTML file using the shared reporter-template.html.
 *
 * Usage:
 *   node generate-jest-dashboard.mjs \
 *     --json  ./jest-report.json \
 *     --html  ./jest-dashboard.html \
 *     --template ./reporter-template.html
 *
 * Generate the Jest JSON first with:
 *   npx jest --json --outputFile=jest-report.json
 *
 * All flags are optional — defaults shown above.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { resolve, relative, dirname } from 'path';
import { fileURLToPath } from 'url';

// ── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const get  = (flag, fallback) => {
  const i = args.indexOf(flag);
  return i !== -1 ? args[i + 1] : fallback;
};

const jsonPath = resolve(get('--json',     './jest-report.json'));
const outPath  = resolve(get('--html',     './jest-dashboard.html'));
const tmplPath = resolve(get('--template', './reporter-template.html'));

// ── Validate inputs ───────────────────────────────────────────────────────────

if (!existsSync(jsonPath)) {
  console.error(`❌  JSON report not found: ${jsonPath}`);
  console.error('    Make sure you ran: npx jest --json --outputFile=jest-report.json');
  process.exit(1);
}

if (!existsSync(tmplPath)) {
  console.error(`❌  Template not found: ${tmplPath}`);
  console.error('    Pass the correct path with: --template /path/to/reporter-template.html');
  process.exit(1);
}

// ── Read & parse ──────────────────────────────────────────────────────────────

const raw  = JSON.parse(readFileSync(jsonPath, 'utf8'));
const tmpl = readFileSync(tmplPath, 'utf8');

// ── Status mapping: Jest → dashboard model ────────────────────────────────────
// Jest statuses: 'passed' | 'failed' | 'pending' | 'todo' | 'skipped'
// Dashboard outcomes: 'expected' | 'unexpected' | 'skipped'
// Note: Jest has no flaky concept → always 0

function mapStatus(jestStatus) {
  switch (jestStatus) {
    case 'passed':  return 'expected';
    case 'failed':  return 'unexpected';
    default:        return 'skipped';   // pending, todo, skipped
  }
}

// ── Compute total run duration ────────────────────────────────────────────────
// Jest has no root-level duration field, so we derive it.
// If testResults have perfStats, use wall-clock span; otherwise sum assertions.

function computeDuration(raw) {
  const results = raw.testResults ?? [];

  const ends = results
    .map(r => r.perfStats?.end ?? r.perfStats?.runtime ?? null)
    .filter(Boolean);
  if (ends.length > 0) {
    return Math.max(...ends) - raw.startTime;
  }

  return results
    .flatMap(r => r.assertionResults ?? [])
    .reduce((sum, a) => sum + (a.duration ?? 0), 0);
}

// ── Flatten Jest assertions → test objects ────────────────────────────────────

function flattenTests(testResults) {
  const tests = [];
  for (const suite of testResults) {
    let file = suite.testFilePath ?? '';
    try { file = relative(process.cwd(), file) || file; } catch (_) {}
    file = file.replace(/\\/g, '/');

    for (const a of suite.assertionResults ?? []) {
      tests.push({
        title:    a.fullName ?? a.title ?? '(unnamed)',
        file,
        line:     a.location?.line ?? 0,
        project:  'unit',
        outcome:  mapStatus(a.status),
        duration: a.duration ?? 0,
        retries:  0,
        error:    a.failureMessages?.[0] ?? null,
      });
    }
  }
  return tests;
}

// ── Build dashboard data model ────────────────────────────────────────────────

const tests = flattenTests(raw.testResults ?? []);

const expected   = raw.numPassedTests ?? tests.filter(t => t.outcome === 'expected').length;
const unexpected = raw.numFailedTests ?? tests.filter(t => t.outcome === 'unexpected').length;
const skipped    = (raw.numPendingTests ?? 0) + (raw.numTodoTests ?? 0)
                 || tests.filter(t => t.outcome === 'skipped').length;
const total      = raw.numTotalTests  ?? tests.length;

const dashboardData = {
  startTime:    raw.startTime ?? Date.now(),
  duration:     computeDuration(raw),
  workers:      1,
  stats: {
    total,
    expected,
    unexpected,
    flaky:   0,
    skipped,
    ok:      unexpected === 0,
  },
  projectNames: ['unit'],
  tests,
};

// ── Inject into template ──────────────────────────────────────────────────────

const PLACEHOLDER = '/* __PLAYWRIGHT_DATA__ */null';

if (!tmpl.includes(PLACEHOLDER)) {
  console.error(`❌  Template is missing the injection point: ${PLACEHOLDER}`);
  console.error('    Add it inside your <script> block like:');
  console.error('      const DATA = /* __PLAYWRIGHT_DATA__ */null;');
  process.exit(1);
}

const injected = tmpl.replace(
  PLACEHOLDER,
  JSON.stringify(dashboardData, null, 2)
);

writeFileSync(outPath, injected, 'utf8');
console.log(`✅  Dashboard written to: ${outPath}`);
console.log(`    Tests: ${dashboardData.stats.total}  |  Passed: ${dashboardData.stats.expected}  |  Failed: ${dashboardData.stats.unexpected}  |  Skipped: ${dashboardData.stats.skipped}`);
