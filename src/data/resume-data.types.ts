import type { ComponentType, SVGProps } from "react";
import type { StaticImageData } from "next/image";

export type Lang = "en" | "es";

export type SocialNetwork = "GitHub" | "LinkedIn";

export const LANGS: readonly Lang[] = ["en", "es"];

export function isLang(value: unknown): value is Lang {
  return (LANGS as readonly unknown[]).includes(value);
}

export type Project = {
  title: string;
  techStack: readonly string[];
  description: string;
  link?: {
    label: string;
    href: string;
  };
  githubLink?: string;
};

export type ResumeData = {
  name: string;
  initials: string;
  locations: readonly { name: string; link: string }[];
  about: string;
  summary: string;
  avatarUrl: string;
  contact: {
    email: string;
    phones: readonly string[];
    social: readonly {
      name: SocialNetwork;
      url: string;
      icon: ComponentType<SVGProps<SVGSVGElement>>;
    }[];
  };
  education: readonly {
    school: string;
    degree: string;
    start: string;
    end: string | null;
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
    /** Accessible names for the icon-only contact links. */
    contact: {
      email: string;
      /** Prefix for the phone number, e.g. "Call" → "Call +34 610 831 754". */
      call: string;
      profiles: Record<SocialNetwork, string>;
    };
    notFound: { title: string; description: string; backHome: string };
    skipToContent: string;
    error: { title: string; description: string; retry: string; backHome: string };
    /**
     * Privacy notice and its footer link. In paragraphs, `{email}` becomes a
     * mailto link to the contact email and `{aepd}` a link to the AEPD site.
     */
    privacy: {
      link: string;
      title: string;
      intro: string;
      sections: readonly { title: string; paragraphs: readonly string[] }[];
      lastUpdatedLabel: string;
      lastUpdated: string;
    };
  };
};
