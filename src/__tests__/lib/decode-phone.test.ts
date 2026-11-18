import { decodePhone, encodePhone } from "@/lib/decode-phone";

describe("decodePhone", () => {
  it.each([
    ["+34610831754", "NDU3MTM4MDE2NDMr"],
    ["+528711053221", "MTIyMzUwMTE3ODI1Kw=="],
  ])("decodes %s from its stored form", (e164, encoded) => {
    expect(encodePhone(e164)).toBe(encoded);
    expect(decodePhone(encodePhone(e164))).toBe(e164);
  });

  it("never leaves the digits readable in the encoded form", () => {
    const encoded = encodePhone("+34610831754");
    expect(encoded).not.toMatch(/610|831|754/);
    expect(encoded).not.toContain("+");
  });
});
