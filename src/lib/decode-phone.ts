/**
 * Phone numbers are stored reversed and base64-encoded, so neither the digits
 * nor a `tel:` link appear in the server HTML or as plain strings in the JS
 * bundle. This only stops scrapers that grep HTML or JS for numbers; anyone
 * who runs the page's JavaScript or reads this file can decode them.
 */
export type EncodedPhone = string & {readonly __encodedPhone: true};

const reverse = (s: string) => [...s].reverse().join('');

/** `+34610831754` → its encoded form. Used to write the data and in tests. */
export function encodePhone(e164: string): EncodedPhone {
  return btoa(reverse(e164)) as EncodedPhone;
}

/** Encoded form → E.164 (`+34610831754`). Call it only in the browser, after a user action. */
export function decodePhone(encoded: EncodedPhone): string {
  return reverse(atob(encoded));
}
