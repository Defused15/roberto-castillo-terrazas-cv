export type PhoneCountry = 'ES' | 'MX';

/**
 * Country and digit grouping per calling code, used to print E.164 numbers in
 * a human-readable form. Countries not listed here are returned unchanged.
 */
const PHONE_FORMATS: Record<
  string,
  {country: PhoneCountry; groups: readonly number[]}
> = {
  '+34': {country: 'ES', groups: [3, 3, 3]},
  '+52': {country: 'MX', groups: [3, 3, 4]},
};

const callingCode = (e164: string) =>
  Object.keys(PHONE_FORMATS).find(c => e164.startsWith(c));

/** Formats an E.164 number (`+34610831754`) for display (`+34 610 831 754`). */
export function formatPhone(e164: string): string {
  const code = callingCode(e164);
  if (!code) return e164;
  let rest = e164.slice(code.length);
  const parts = PHONE_FORMATS[code].groups.map(n => {
    const part = rest.slice(0, n);
    rest = rest.slice(n);
    return part;
  });
  return [code, ...parts, rest].filter(Boolean).join(' ');
}

/** Country of an E.164 number (`+34…` → `"ES"`), or undefined for unlisted codes. */
export function phoneCountry(e164: string): PhoneCountry | undefined {
  const code = callingCode(e164);
  return code ? PHONE_FORMATS[code].country : undefined;
}
