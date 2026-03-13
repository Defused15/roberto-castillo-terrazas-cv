import { RESUME_DATA } from "@/data/resume-data";

// ─────────────────────────────────────────────
// resume-data.ts Tests
// ─────────────────────────────────────────────

describe("RESUME_DATA", () => {

  // ───────────── Personal Info ─────────────
  describe("Personal Info", () => {
    it("has a non-empty name", () => {
      expect(RESUME_DATA.name).toBeTruthy();
    });

    it("has a valid avatar URL", () => {
      expect(RESUME_DATA.avatarUrl).toMatch(/^https?:\/\/.+/);
    });

    it("all URLs are non-empty strings", () => {
      const urls = [
        RESUME_DATA.avatarUrl,
        ...RESUME_DATA.contact.social.map(s => s.url),
        ...RESUME_DATA.work.map(w => w.link),
        ...RESUME_DATA.certifications.map(c => c.url),
        ...RESUME_DATA.projects.map(p => p.link?.href).filter(Boolean)
      ];
      urls.forEach(url => {
        expect(typeof url).toBe("string");
        expect(url.trim().length).toBeGreaterThan(0);
      });
    });

    it("has a valid email address", () => {
      expect(RESUME_DATA.contact.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });

    it("has a valid phone number", () => {
      expect(RESUME_DATA.contact.tel).toMatch(/^\+?[\d\s\-()]{7,}/);
    });

    it("has initials matching the name", () => {
      const expectedInitials = RESUME_DATA.name
        .split(" ")
        .map((part) => part[0])
        .join("");
      expect(RESUME_DATA.initials).toBe(expectedInitials);
    });

    it("initials match name for multi-word names", () => {
      const name = "Roberto Castillo Terrazas";
      const expected = "RCT";
      const initials = name.split(" ").map(p => p[0]).join("");
      expect(initials).toBe(expected);
    });
  });

  // ───────────── Social Links ─────────────
  describe("Social Links", () => {
    it("has at least one social link", () => {
      expect(RESUME_DATA.contact.social.length).toBeGreaterThan(0);
    });

    it("all social links have a name, url, and icon", () => {
      RESUME_DATA.contact.social.forEach((social) => {
        expect(social.name).toBeTruthy();
        expect(social.url).toMatch(/^https?:\/\/.+/);
        expect(social.icon).toBeDefined();
      });
    });

    it("has a GitHub social link pointing to correct profile", () => {
      const github = RESUME_DATA.contact.social.find((s) => s.name === "GitHub");
      expect(github?.url).toContain("github.com/Defused15");
    });

    it("has a LinkedIn social link", () => {
      const linkedin = RESUME_DATA.contact.social.find((s) => s.name === "LinkedIn");
      expect(linkedin?.url).toContain("linkedin.com");
    });
  });

  // ───────────── Work Experience ─────────────
  describe("Work Experience", () => {
    it("has exactly 3 work entries", () => {
      expect(RESUME_DATA.work.length).toBe(3);
    });

    it("all work entries have required fields", () => {
      RESUME_DATA.work.forEach((job) => {
        expect(job.company).toBeTruthy();
        expect(job.title).toBeTruthy();
        expect(job.start).toMatch(/^\d{4}$/);
        expect(job.link).toMatch(/^https?:\/\/.+/);
      });
    });

    it("all work entries have at least one description bullet", () => {
      RESUME_DATA.work.forEach((job) => {
        expect(job.description.length).toBeGreaterThan(0);
      });
    });

    it("all work entries have at least one badge", () => {
      RESUME_DATA.work.forEach((job) => {
        expect(job.badges.length).toBeGreaterThan(0);
      });
    });

    it("work entries are sorted from newest to oldest", () => {
      const years = RESUME_DATA.work.map(job => Number(job.start));
      for (let i = 0; i < years.length - 1; i++) {
        expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
      }
    });

    it("most recent job has null end date (currently employed)", () => {
      expect(RESUME_DATA.work[0].end).toBeNull();
    });

    it("end years are null or valid 4-digit years", () => {
      RESUME_DATA.work.forEach((job) => {
        if (job.end !== null) {
          expect(job.end).toMatch(/^\d{4}$/);
        }
      });
    });

    it("Inetum is the most recent job", () => {
      expect(RESUME_DATA.work[0].company).toBe("Inetum");
    });

    it("all work badges are non-empty strings", () => {
      RESUME_DATA.work.forEach(job => {
        job.badges.forEach(badge => {
          expect(typeof badge).toBe("string");
          expect(badge.trim()).toBeTruthy();
        });
      });
    });
  });

  // ───────────── Company Logos ─────────────
  describe("Company Logos", () => {
    it("all work entries have a logo defined", () => {
      RESUME_DATA.work.forEach((job) => {
        expect(job.logo).toBeDefined();
      });
    });

    it("all logos have a valid src", () => {
      RESUME_DATA.work.forEach(job => {
        expect((job.logo as any).src).toBeTruthy();
      });
    });
  });

  // ───────────── Education ─────────────
  describe("Education", () => {
    it("has at least one education entry", () => {
      expect(RESUME_DATA.education.length).toBeGreaterThan(0);
    });

    it("all education entries have required fields", () => {
      RESUME_DATA.education.forEach((edu) => {
        expect(edu.school).toBeTruthy();
        expect(edu.degree).toBeTruthy();
        expect(edu.start).toMatch(/^\d{4}$/);
        expect(edu.end).toMatch(/^\d{4}$/);
      });
    });
  });

  // ───────────── Skills ─────────────
  describe("Skills", () => {
    it("has at least one skill", () => {
      expect(RESUME_DATA.skills.length).toBeGreaterThan(0);
    });

    it("contains core QA tools", () => {
      expect(RESUME_DATA.skills).toContain("Playwright");
      expect(RESUME_DATA.skills).toContain("Cypress");
      expect(RESUME_DATA.skills).toContain("Jest");
    });

    it("contains Salesforce Marketing Cloud", () => {
      expect(RESUME_DATA.skills).toContain("Salesforce Marketing Cloud");
    });

    it("contains AI-Powered Testing", () => {
      expect(RESUME_DATA.skills).toContain("AI-Powered Testing");
    });

    it("has no duplicate skills", () => {
      const unique = new Set(RESUME_DATA.skills);
      expect(unique.size).toBe(RESUME_DATA.skills.length);
    });

    it("all skills are non-empty strings", () => {
      RESUME_DATA.skills.forEach((skill) => {
        expect(typeof skill).toBe("string");
        expect(skill.trim().length).toBeGreaterThan(0);
      });
    });
  });

  // ───────────── Certifications ─────────────
  describe("Certifications", () => {
    it("has at least one certification", () => {
      expect(RESUME_DATA.certifications.length).toBeGreaterThan(0);
    });

    it("all certifications have required fields", () => {
      RESUME_DATA.certifications.forEach((cert) => {
        expect(cert.title).toBeTruthy();
        expect(cert.issuer).toBeTruthy();
        expect(cert.year).toMatch(/^\d{4}$/);
        expect(cert.url).toMatch(/^https:\/\/.+/);
      });
    });

    it("certifications are sorted from newest to oldest", () => {
      const years = RESUME_DATA.certifications.map((c) => parseInt(c.year));
      for (let i = 0; i < years.length - 1; i++) {
        expect(years[i]).toBeGreaterThanOrEqual(years[i + 1]);
      }
    });

    it("has at least 3 Anthropic certifications", () => {
      const anthropicCerts = RESUME_DATA.certifications.filter(
        (c) => c.issuer === "Anthropic"
      );
      expect(anthropicCerts.length).toBeGreaterThanOrEqual(3);
    });
  });

  // ───────────── Projects ─────────────
  describe("Projects", () => {
    it("has at least one project", () => {
      expect(RESUME_DATA.projects.length).toBeGreaterThan(0);
    });

    it("all projects have required fields", () => {
      RESUME_DATA.projects.forEach((project) => {
        expect(project.title).toBeTruthy();
        expect(project.description).toBeTruthy();
        expect(project.techStack.length).toBeGreaterThan(0);
        project.techStack.forEach(tech => {
          expect(typeof tech).toBe("string");
          expect(tech.trim()).toBeTruthy();
        });
      });
    });

    it("optional project links are valid if present", () => {
      RESUME_DATA.projects.forEach((project) => {
        if (project.link) {
          expect(project.link.href).toMatch(/^https?:\/\/.+/);
          expect(project.link.label).toBeTruthy();
        }
      });
    });

    it("has exactly 3 projects", () => {
      expect(RESUME_DATA.projects.length).toBe(3);
    });

    it("QA Playground project exists", () => {
      const qaProject = RESUME_DATA.projects.find(
        (p) => p.title === "QA Playground Test Automation"
      );
      expect(qaProject).toBeDefined();
    });

    it("QA Test Hub project exists with correct fields", () => {
      const hub = RESUME_DATA.projects.find((p) => p.title === "QA Test Hub");
      expect(hub).toBeDefined();
      expect(hub?.link?.href).toBe("https://qa.rcastillo.dev");
      expect(hub?.githubLink).toBe("https://github.com/Defused15/test-hub");
      expect(hub?.techStack).toContain("GitHub Actions");
    });

    it("Minimalist CV project exists with correct fields", () => {
      const cv = RESUME_DATA.projects.find((p) => p.title === "Minimalist CV");
      expect(cv).toBeDefined();
      expect(cv?.githubLink).toBe("https://github.com/Defused15/roberto-castillo-terrazas-cv");
      expect(cv?.techStack).toContain("Jest");
      expect(cv?.techStack).toContain("Stryker");
    });

    it("all projects with a githubLink have a valid GitHub URL", () => {
      RESUME_DATA.projects.forEach((project) => {
        if (project.githubLink) {
          expect(project.githubLink).toMatch(/^https:\/\/github\.com\/.+/);
        }
      });
    });

    it("all project githubLinks point to the Defused15 account", () => {
      RESUME_DATA.projects.forEach((project) => {
        if (project.githubLink) {
          expect(project.githubLink).toContain("github.com/Defused15");
        }
      });
    });

    it("project link.href does not point to GitHub when githubLink is also present", () => {
      RESUME_DATA.projects.forEach((project) => {
        if (project.link && project.githubLink) {
          expect(project.link.href).not.toMatch(/^https:\/\/github\.com/);
        }
      });
    });
  });
});