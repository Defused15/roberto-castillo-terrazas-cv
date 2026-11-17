import { formatPhone, phoneCountry } from "@/lib/format-phone";

describe("formatPhone", () => {
  it.each([
    ["Spain (3-3-3)", "+34610831754", "+34 610 831 754"],
    ["Mexico (3-3-4)", "+528711053221", "+52 871 105 3221"],
    ["a short number drops empty groups", "+34123", "+34 123"],
    ["extra digits are kept in a trailing group", "+3461083175499", "+34 610 831 754 99"],
    ["an unknown country code falls back to the raw number", "+15551234567", "+15551234567"],
  ])("formats %s", (_case, input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });
});

describe("phoneCountry", () => {
  it.each([
    ["+34610831754", "ES"],
    ["+528711053221", "MX"],
    ["+15551234567", undefined],
  ])("maps %s to %p", (input, expected) => {
    expect(phoneCountry(input)).toBe(expected);
  });
});
