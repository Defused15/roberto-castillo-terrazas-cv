"use client";

import React from "react";
import { ProfileAvatar } from "@/components/profile-avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { SiteFooter } from "@/components/site-footer";
import { ModeToggle } from "@/components/darkmode";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { formatPhone, phoneCountry } from "@/lib/format-phone";
import { track } from "@/lib/analytics";
import type { ResumeData, SocialNetwork } from "@/data/resume-data";

const SOCIAL_EVENTS = {
  GitHub: "social_github",
  LinkedIn: "social_linkedin",
} as const satisfies Record<SocialNetwork, string>;

/** Reports a phone click by country only; the number itself is never sent. */
function trackPhone(e164: string) {
  const country = phoneCountry(e164);
  if (country) track("contact_phone", { number_country: country });
}

/** Responsive columns for the project grid: never more columns than projects. */
// Stryker disable next-line all: layout-only classes, verified visually
const projectGridCols = (n: number) => (n === 1 ? "grid-cols-1" : n === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3");

/** The CV in the language currently selected in LanguageProvider. */
export function ResumeContent() {
  const { data } = useLanguage();
  return <ResumeView data={data} />;
}

/** Pure rendering of one language's resume data. */
export function ResumeView({ data }: { data: ResumeData }) {

  return (
    <>
    <main className="container bg-white dark:bg-gray-900 relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16">
      <section className="mx-auto bg-white dark:bg-gray-900 w-full max-w-2xl space-y-8 bg-white print:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="max-w-md text-pretty text-sm text-muted-foreground print:text-[12px]">
              {data.about}
            </p>
            <p className="max-w-md items-center text-pretty text-xs text-muted-foreground">
              {data.locations.map((location, index) => (
                <React.Fragment key={location.link}>
                  {index > 0 ? (
                    <span aria-hidden="true" className="mx-1.5">
                      ·
                    </span>
                  ) : null}
                  <a
                    // Stryker disable next-line all: presentational only (secondary locations are dimmed)
                    className={`inline-flex gap-x-1.5 align-baseline leading-none hover:underline${index > 0 ? " opacity-80" : ""}`}
                    href={location.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {
                      // Stryker disable next-line all: decorative icon on the primary location
                      index === 0 ? <GlobeIcon className="size-3" aria-hidden="true" /> : null
                    }
                    {location.name}
                  </a>
                </React.Fragment>
              ))}
            </p>
            {data.contact.email ? (
              <p className="text-xs text-muted-foreground">
                {data.contact.email}
              </p>
            ) : null}
            {data.contact.phones.length > 0 ? (
              <p className="text-xs text-muted-foreground print:hidden">
                {data.contact.phones.map((phone, index) => (
                  <React.Fragment key={phone}>
                    {index > 0 ? (
                      <span aria-hidden="true" className="mx-1.5">
                        ·
                      </span>
                    ) : null}
                    <a
                      className="hover:underline"
                      href={`tel:${phone}`}
                      onClick={() => trackPhone(phone)}
                    >
                      {formatPhone(phone)}
                    </a>
                  </React.Fragment>
                ))}
              </p>
            ) : null}
            <div className="flex gap-x-1 pt-1 text-sm text-muted-foreground print:hidden">
              {data.contact.email ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={`mailto:${data.contact.email}`}
                    aria-label={data.ui.contact.email}
                    onClick={() => track("contact_email")}
                  >
                    <MailIcon className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
              {data.contact.phones[0] ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={`tel:${data.contact.phones[0]}`}
                    onClick={() => trackPhone(data.contact.phones[0])}
                    aria-label={`${data.ui.contact.call} ${formatPhone(data.contact.phones[0])}`}
                  >
                    <PhoneIcon className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              ) : null}
              {data.contact.social.map((social) => (
                <Button
                  key={social.name}
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={data.ui.contact.profiles[social.name]}
                    onClick={() => track(SOCIAL_EVENTS[social.name])}
                  >
                    <social.icon className="size-4" aria-hidden="true" />
                  </a>
                </Button>
              ))}
              <div className="size-8 flex items-center justify-center">
                <ModeToggle />
              </div>
              <div className="size-8 flex items-center justify-center">
                <LanguageToggle />
              </div>
            </div>
            <div className="hidden flex-col gap-x-1 text-sm text-muted-foreground print:flex print:text-[12px]">
              {data.contact.email ? (
                <a href={`mailto:${data.contact.email}`}>
                  <span className="underline">{data.contact.email}</span>
                </a>
              ) : null}
              {data.contact.phones.map((phone) => (
                <a key={phone} href={`tel:${phone}`}>
                  <span className="underline">{formatPhone(phone)}</span>
                </a>
              ))}
            </div>
          </div>

          <ProfileAvatar
            src={data.avatarUrl}
            alt={data.name}
            fallback={data.initials}
          />
        </div>
        <Section title={data.ui.sections.about}>
          <p className="text-pretty text-sm text-muted-foreground print:text-[12px]">
            {data.summary}
          </p>
        </Section>
        <Section title={data.ui.sections.work}>
          {data.work.map((work) => {
            return (
              <Card key={work.company}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="inline-flex items-center justify-center gap-x-2 font-semibold leading-none">
                      <img
                        src={work.logo.src}
                        alt={`${work.company} logo`}
                        className="size-5 rounded-sm object-contain"
                      />
                      <a className="hover:underline" href={work.link}>
                        {work.company}
                      </a>

                      <span className="inline-flex gap-x-1">
                        {work.badges.map((badge) => (
                          <Badge
                            variant="secondary"
                            className="align-middle text-xs print:text-[8px] print:leading-tight print:px-1 print:py-0.5"
                            key={badge}
                          >
                            {badge}
                          </Badge>
                        ))}
                      </span>
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {work.start} - {work.end ?? data.ui.present}
                    </div>
                  </div>

                  <h4 className="text-sm leading-none print:text-[12px]">
                    {work.title}
                  </h4>
                </CardHeader>
                <CardContent className="mt-2 text-sm print:text-[10px]">
                  <ul className="list-disc pl-4 space-y-1">
                    {work.description.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section title={data.ui.sections.education}>
          {data.education.map((education) => {
            return (
              <Card key={education.school}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">
                      {education.school}
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {education.start} - {education.end ?? data.ui.present}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="mt-2 print:text-[12px]">
                  {education.degree}
                </CardContent>
              </Card>
            );
          })}
        </Section>
        <Section title={data.ui.sections.skills}>
          <div className="flex flex-col gap-3">
            {data.skills.map((group, index) => (
              <div key={index}>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  {group.category}
                </p>
                <div className="flex flex-wrap gap-1">
                  {group.items.map((skill) => (
                    <Badge className="print:text-[10px]" key={skill}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title={data.ui.sections.certifications}>
          <div className="flex flex-col gap-2">
            {data.certifications.map((cert) => (
              <div key={`${cert.title}-${cert.issuer}`} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <a
                    href={cert.url}
                    onClick={() => track("cert_link", { cert: cert.title, issuer: cert.issuer })}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline text-sm"
                  >
                    {cert.title}
                  </a>
                  <span className="text-xs text-muted-foreground">{cert.issuer}</span>
                </div>
                <span className="text-sm tabular-nums text-gray-500 shrink-0 ml-4">{cert.year}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section title={data.ui.sections.languages}>
          <div className="flex gap-6">
            {data.languages.map((lang, index) => (
              <div key={index} className="flex flex-col">
                <span className="text-sm font-medium">{lang.language}</span>
                <span className="text-xs text-muted-foreground">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section className="print-force-new-page scroll-mb-16" title={data.ui.sections.projects}>
          <div
            // Stryker disable next-line StringLiteral: layout-only classes
            className={`-mx-3 grid gap-3 print:grid-cols-3 print:gap-2 ${projectGridCols(data.projects.length)}`}
          >
            {data.projects.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={project.link?.href}
                  linkLabel={project.link?.label}
                  githubLink={project.githubLink}
                  githubLabel={data.ui.githubRepo}
                />
              );
            })}
          </div>
        </Section>
      </section>
    </main>
    <SiteFooter data={data} />
    </>
  );
}