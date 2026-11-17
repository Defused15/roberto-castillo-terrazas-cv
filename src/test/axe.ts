import { act } from "@testing-library/react";
import { configureAxe } from "jest-axe";

/**
 * Shared axe instance. Colour contrast needs real layout and computed styles,
 * which jsdom does not provide, so it is left to browser-level checks.
 */
const runAxe = configureAxe({
  rules: { "color-contrast": { enabled: false } },
});

/**
 * Runs axe inside act(): axe is async, and components such as next/link
 * update state from idle callbacks while it runs.
 */
export async function axe(...args: Parameters<typeof runAxe>) {
  let results: Awaited<ReturnType<typeof runAxe>> | undefined;
  await act(async () => {
    results = await runAxe(...args);
  });
  return results!;
}
