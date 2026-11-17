/**
 * Digit grouping per country calling code, used to print E.164 numbers in a
 * human-readable form. Countries not listed here are returned unchanged.
 */
const PHONE_GROUPS: Record<string, readonly number[]> = {
  "+34": [3, 3, 3],
  "+52": [3, 3, 4],
};

/** Formats an E.164 number (`+34610831754`) for display (`+34 610 831 754`). */
export function formatPhone(e164: string): string {
  const code = Object.keys(PHONE_GROUPS).find((c) => e164.startsWith(c));
  if (!code) return e164;
  let rest = e164.slice(code.length);
  const parts = PHONE_GROUPS[code].map((n) => {
    const part = rest.slice(0, n);
    rest = rest.slice(n);
    return part;
  });
  return [code, ...parts, rest].filter(Boolean).join(" ");
}
