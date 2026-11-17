import type { ComponentType, SVGProps } from "react";
import type { StaticImageData } from "next/image";
import type { EncodedPhone } from "@/lib/decode-phone";

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
    /** E.164 numbers, encoded with encodePhone(); decode with decodePhone() in the browser only. */
    phones: readonly EncodedPhone[];
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
    /**
     * The link opens a page that verifies this credential for this person
     * (checked by hand, not inferred from the URL), so the CV can say "Verified".
     */
    verified: boolean;
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
    /** Label next to a certification whose link verifies it. */
    verified: string;
    githubRepo: string;
    theme: { toggle: string; light: string; dark: string; system: string };
    languageToggle: string;
    /** Accessible names for the icon-only contact links. */
    contact: {
      email: string;
      /** Prefix for the phone number, e.g. "Call" → "Call +34 610 831 754". */
      call: string;
      /** Text button in the header that reveals the phone numbers. */
      showPhones: string;
      /** Prefix for a revealed number's copy button, e.g. "Copy" → "Copy +34 610 831 754". */
      copy: string;
      /** Prefix for the email line's copy button, e.g. "Copy email address" → "Copy email address me@x.dev". */
      copyEmail: string;
      /** Feedback shown after a number or the email is copied. */
      copied: string;
      profiles: Record<SocialNetwork, string>;
    };
    notFound: { title: string; description: string; backHome: string };
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
