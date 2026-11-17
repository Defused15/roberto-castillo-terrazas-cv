import { RESUME_DATA, RESUME_DATA_BY_LANG } from "@/data/resume-data";
import { isLang } from "@/data/resume-data.types";

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
});
