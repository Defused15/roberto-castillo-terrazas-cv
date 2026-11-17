import { RESUME_DATA, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { isLang } from "@/data/resume-data.types";

const EN = RESUME_DATA_BY_LANG.en;
const ES = RESUME_DATA_BY_LANG.es;

function typeOf(value: unknown): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

function sameShape(a: unknown, b: unknown, path = "root"): string[] {
  const ta = typeOf(a);
  const tb = typeOf(b);
  if (ta !== tb) return [`${path}: ${ta} !== ${tb}`];
  if (ta === "array") {
    const aa = a as unknown[];
    const bb = b as unknown[];
    if (aa.length !== bb.length) {
      return [`${path}: length ${aa.length} !== ${bb.length}`];
    }
    return aa.flatMap((item, i) => sameShape(item, bb[i], `${path}[${i}]`));
  }
  if (ta === "object") {
    const ao = a as Record<string, unknown>;
    const bo = b as Record<string, unknown>;
    const ka = Object.keys(ao).sort();
    const kb = Object.keys(bo).sort();
    if (ka.join(",") !== kb.join(",")) {
      return [`${path}: keys [${ka}] !== [${kb}]`];
    }
    return ka.flatMap((k) => sameShape(ao[k], bo[k], `${path}.${k}`));
  }
  return [];
}

// Walks ES and EN together: an ES string may only be empty where EN is empty too.
function emptyStrings(es: unknown, en: unknown, path = "root"): string[] {
  if (typeof es === "string") {
    return es.trim() === "" && !(typeof en === "string" && en.trim() === "")
      ? [path]
      : [];
  }
  if (Array.isArray(es)) {
    const enArr = Array.isArray(en) ? en : [];
    return es.flatMap((item, i) => emptyStrings(item, enArr[i], `${path}[${i}]`));
  }
  if (es && typeof es === "object") {
    const enObj = (en && typeof en === "object" ? en : {}) as Record<string, unknown>;
    return Object.entries(es as Record<string, unknown>).flatMap(([k, v]) =>
      emptyStrings(v, enObj[k], `${path}.${k}`),
    );
  }
  return [];
}

describe("resume data i18n", () => {
  it("maps en to RESUME_DATA", () => {
    expect(RESUME_DATA_BY_LANG.en).toBe(RESUME_DATA);
  });

  it("exposes EN UI strings", () => {
    expect(RESUME_DATA.ui.sections.about).toBe("About");
    expect(RESUME_DATA.ui.present).toBe("Present");
  });

  it("isLang accepts supported languages only", () => {
    expect(isLang("en")).toBe(true);
    expect(isLang("es")).toBe(true);
    expect(isLang("fr")).toBe(false);
    expect(isLang(null)).toBe(false);
    expect(isLang(1)).toBe(false);
  });

  describe("ES content", () => {
    it("is a distinct object from EN", () => {
      expect(ES).not.toBe(EN);
    });

    it("has the same shape as EN", () => {
      expect(sameShape(EN, ES)).toEqual([]);
    });

    it("keeps non-text fields identical to EN", () => {
      expect(ES.name).toBe(EN.name);
      expect(ES.initials).toBe(EN.initials);
      expect(ES.avatarUrl).toBe(EN.avatarUrl);
      expect(ES.location).toBe(EN.location);
      expect(ES.locationLink).toBe(EN.locationLink);
      expect(ES.personalWebsiteUrl).toBe(EN.personalWebsiteUrl);
      expect(ES.contact).toEqual(EN.contact);
      expect(ES.certifications).toEqual(EN.certifications);

      ES.work.forEach((w, i) => {
        const en = EN.work[i];
        expect(w.company).toBe(en.company);
        expect(w.link).toBe(en.link);
        expect(w.logo).toBe(en.logo);
        expect(w.start).toBe(en.start);
        expect(w.end).toBe(en.end);
      });

      ES.education.forEach((e, i) => {
        const en = EN.education[i];
        expect(e.school).toBe(en.school);
        expect(e.start).toBe(en.start);
        expect(e.end).toBe(en.end);
      });

      ES.skills.forEach((s, i) => {
        expect(s.items).toEqual(EN.skills[i].items);
      });

      ES.projects.forEach((p, i) => {
        const en = EN.projects[i];
        expect(p.title).toBe(en.title);
        expect(p.techStack).toEqual(en.techStack);
        expect(p.link).toEqual(en.link);
        expect(p.githubLink).toBe(en.githubLink);
      });
    });

    it("translates text fields", () => {
      expect(ES.summary).not.toBe(EN.summary);
      expect(ES.about).not.toBe(EN.about);

      ES.work.forEach((w, i) => {
        w.description.forEach((d, j) => {
          expect(d).not.toBe(EN.work[i].description[j]);
        });
      });

      ES.work.forEach((w, i) => {
        w.badges.forEach((b, j) => {
          expect(b).not.toBe(EN.work[i].badges[j]);
        });
      });

      ES.skills.forEach((s, i) => {
        expect(s.category).not.toBe(EN.skills[i].category);
      });

      ES.education.forEach((e, i) => {
        expect(e.degree).not.toBe(EN.education[i].degree);
      });

      ES.languages.forEach((l, i) => {
        expect(l.language).not.toBe(EN.languages[i].language);
        expect(l.proficiency).not.toBe(EN.languages[i].proficiency);
      });

      ES.projects.forEach((p, i) => {
        expect(p.description).not.toBe(EN.projects[i].description);
      });
    });

    it("uses the fixed ES UI strings", () => {
      expect(ES.ui).toEqual({
        sections: {
          about: "Acerca de",
          work: "Experiencia laboral",
          education: "Educación",
          skills: "Habilidades",
          certifications: "Certificaciones y cursos",
          languages: "Idiomas",
          projects: "Proyectos",
        },
        present: "Actual",
        githubRepo: "Repo en GitHub",
        theme: {
          toggle: "Cambiar tema",
          light: "Claro",
          dark: "Oscuro",
          system: "Sistema",
        },
        languageToggle: "Cambiar idioma",
      });
    });

    it("has no empty strings", () => {
      expect(emptyStrings(ES, EN)).toEqual([]);
    });
  });
});
