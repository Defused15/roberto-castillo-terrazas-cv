import type { Lang } from "@/data/resume-data";
import type { PhoneCountry } from "@/lib/format-phone";

/** Every custom event and its properties. Nothing here may identify a visitor. */
export type AnalyticsEvents = {
  contact_email: undefined;
  contact_email_copy: undefined;
  contact_phone_reveal: undefined;
  contact_phone: { number_country: PhoneCountry };
  social_github: undefined;
  social_linkedin: undefined;
  language_switch: { to: Lang };
  theme_change: { theme: "light" | "dark" | "system" };
  print_cv: undefined;
  project_link: { project: string };
  project_repo: { project: string };
  cert_link: { cert: string; issuer: string };
  not_found: { path: string };
  app_error: { digest: string };
};

export type AnalyticsEvent = keyof AnalyticsEvents;

/** Arguments after the event name: its properties, or nothing for events without any. */
export type EventArgs<E extends AnalyticsEvent> = AnalyticsEvents[E] extends undefined
  ? []
  : [props: AnalyticsEvents[E]];
