import type { ComponentType, SVGProps } from "react";
import type { StaticImageData } from "next/image";

export type Lang = "en" | "es";

export const LANGS: readonly Lang[] = ["en", "es"];

export function isLang(value: unknown): value is Lang {
  return typeof value === "string" && (LANGS as readonly string[]).includes(value);
}

export type Project = {
  title: string;
  techStack: readonly string[];
  description: string;
  logo: string;
  link?: {
    label: string;
    href: string;
  };
  githubLink?: string;
};

export type ResumeData = {
  name: string;
  initials: string;
  location: string;
  locationLink: string;
  about: string;
  summary: string;
  avatarUrl: string;
  personalWebsiteUrl: string;
  contact: {
    email: string;
    tel: string;
    social: readonly {
      name: string;
      url: string;
      icon: ComponentType<SVGProps<SVGSVGElement>>;
    }[];
  };
  education: readonly {
    school: string;
    degree: string;
    start: string;
    end: string;
  }[];
  work: readonly {
    company: string;
    link: string;
    badges: readonly string[];
    title: string;
    logo: StaticImageData;
    start: string;
    end: string | null;
    description: readonly string[];
  }[];
  skills: readonly {
    category: string;
    items: readonly string[];
  }[];
  certifications: readonly {
    title: string;
    issuer: string;
    year: string;
    url: string;
  }[];
  languages: readonly {
    language: string;
    proficiency: string;
  }[];
  projects: readonly Project[];
  ui: {
    sections: {
      about: string;
      work: string;
      education: string;
      skills: string;
      certifications: string;
      languages: string;
      projects: string;
    };
    present: string;
    githubRepo: string;
    theme: { toggle: string; light: string; dark: string; system: string };
    languageToggle: string;
  };
};
