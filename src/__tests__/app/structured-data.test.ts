import { buildPersonJsonLd, serializeJsonLd } from "@/app/structured-data";
import { RESUME_DATA_EN } from "@/data/resume-data.en";

describe("buildPersonJsonLd", () => {
  const ld = buildPersonJsonLd(RESUME_DATA_EN);
  const json = JSON.stringify(ld);

  it("is a ProfilePage with a Person main entity", () => {
    expect(ld["@type"]).toBe("ProfilePage");
    expect(ld.mainEntity["@type"]).toBe("Person");
    expect(ld.mainEntity.name).toBe("Roberto Castillo");
  });

  it("never exposes phone numbers or email", () => {
    expect(json).not.toMatch(/telephone|email|mailto|tel:/i);
    RESUME_DATA_EN.contact.phones.forEach((p) => expect(json).not.toContain(p));
    expect(json).not.toContain(RESUME_DATA_EN.contact.email);
  });

  it("links social profiles via sameAs", () => {
    expect(ld.mainEntity.sameAs).toEqual([
      "https://github.com/Defused15",
      "https://www.linkedin.com/in/rocastil/",
    ]);
  });

  it("uses the headline as jobTitle", () => {
    expect(ld.mainEntity.jobTitle).toBe("QA Engineer | AI-Augmented SDET");
  });

  it("sets worksFor to the current employer", () => {
    expect(ld.mainEntity.worksFor).toMatchObject({ name: "Inetum" });
  });

  it("uses Spain as address country and lists both universities", () => {
    expect(ld.mainEntity.address).toEqual({ "@type": "PostalAddress", addressCountry: "ES" });
    expect(ld.mainEntity.alumniOf.map((a) => a.name)).toEqual([
      "Universidad de Almería",
      "Instituto Tecnológico de La Laguna",
    ]);
  });

  it("includes a self-hosted absolute image and knowsAbout", () => {
    expect(ld.mainEntity.image).toBe("https://www.rcastillo.dev/avatar.jpg");
    expect(ld.mainEntity.knowsAbout.length).toBeGreaterThan(3);
  });
});

describe("serializeJsonLd", () => {
  it("escapes < so </script> cannot terminate the tag", () => {
    const out = serializeJsonLd({ name: "</script><script>alert(1)</script>" });
    expect(out).not.toContain("<");
    expect(out).toContain("\\u003c/script>");
    expect(JSON.parse(out).name).toBe("</script><script>alert(1)</script>");
  });

  it("is used by the page", () => {
    const src = require("fs").readFileSync(
      require("path").join(process.cwd(), "src/app/page.tsx"),
      "utf8",
    );
    expect(src).toContain("serializeJsonLd(");
    expect(src).not.toMatch(/replace\(/);
  });
});
