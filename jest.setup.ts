import '@testing-library/jest-dom';
import {format} from 'util';
import {toHaveNoViolations} from 'jest-axe';

expect.extend(toHaveNoViolations);

const hasDom = typeof window !== 'undefined';

if (hasDom) {
  // Browser APIs Radix UI relies on that jsdom does not implement.
  class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
  global.ResizeObserver =
    ResizeObserver as unknown as typeof global.ResizeObserver;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
  window.scrollTo = jest.fn();
}

/**
 * Any console.error / console.warn fails the test that produced it: React key,
 * act() and hydration warnings are bugs, not noise. A test that expects a
 * warning must spy on the console itself and assert on it.
 */
let consoleOutput: string[] = [];

beforeEach(() => {
  consoleOutput = [];
  if (hasDom) {
    localStorage.clear();
    document.documentElement.lang = 'en';
  }
  for (const method of ['error', 'warn'] as const) {
    jest.spyOn(console, method).mockImplementation((...args: unknown[]) => {
      consoleOutput.push(`console.${method}: ${format(...args)}`);
    });
  }
});

afterEach(() => {
  const output = consoleOutput;
  consoleOutput = [];
  if (output.length > 0) {
    throw new Error(`Unexpected console output:\n${output.join('\n')}`);
  }
});
