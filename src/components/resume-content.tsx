'use client';

import React from 'react';
import Image from 'next/image';
import {ProfileAvatar} from '@/components/profile-avatar';
import {Card, CardHeader, CardContent} from '@/components/ui/card';
import {Badge} from '@/components/ui/badge';
import {Section} from '@/components/ui/section';
import {BadgeCheckIcon, DownloadIcon, GlobeIcon, MailIcon} from 'lucide-react';
import {buttonVariants} from '@/components/ui/button';
import {ProjectCard} from '@/components/project-card';
import {SiteFooter} from '@/components/site-footer';
import {ModeToggle} from '@/components/darkmode';
import {LanguageToggle} from '@/components/language-toggle';
import {PrintButton} from '@/components/print-button';
import {useLanguage} from '@/components/language-provider';
import {CopyText} from '@/components/copy-text';
import {IssuerIcon} from '@/components/icons/issuers';
import {PhoneLine, usePhoneReveal} from '@/components/contact-phones';
import {formatPhone} from '@/lib/format-phone';
import {track} from '@/lib/analytics';
import {
  withExperience,
  type Lang,
  type ResumeData,
  type SocialNetwork,
} from '@/data/resume-data';
import {
  durationMonths,
  formatDuration,
  formatPeriod,
  monthStart,
  type YearMonth,
} from '@/lib/dates';

const SOCIAL_EVENTS = {
  GitHub: 'social_github',
  LinkedIn: 'social_linkedin',
} as const satisfies Record<SocialNetwork, string>;

// Stryker disable all: class names only (layout and look), verified visually in a browser.
// A block, not disable next-line: Prettier spreads these over several lines.

/** Outlined 32px icon link, the same look as the theme and language buttons next to it. */
const ICON_LINK = buttonVariants({variant: 'outline', size: 'icon'});

/** Responsive columns for the project grid: never more columns than projects. */
const projectGridCols = (n: number) =>
  n === 1
    ? 'grid-cols-1'
    : n === 2
      ? 'grid-cols-1 md:grid-cols-2'
      : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3';

/** Muted text link in the header, styled like the "Show phone numbers" button. */
const TEXT_LINK =
  'inline-flex items-center gap-1 rounded-sm underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

// Stryker restore all

type DateProps = {
  /**
   * Month the CV is dated to ("YYYY-MM"): the build month, passed down from the
   * server page so the server HTML and the hydrated page show the same years
   * and durations. Never computed in the browser.
   */
  asOf: YearMonth;
  /** Print-only QR code, rendered on the server (see PrintQr). */
  printQr?: React.ReactNode;
};

/** The CV in the language currently selected in LanguageProvider. */
export function ResumeContent(props: DateProps) {
  const {lang, data} = useLanguage();
  return <ResumeView data={data} lang={lang} {...props} />;
}

/** One language's resume data. Its only state is whether the phone numbers are revealed. */
export function ResumeView({
  data,
  lang,
  asOf,
  printQr,
}: DateProps & {data: ResumeData; lang: Lang}) {
  const phones = usePhoneReveal(data.contact.phones);
  const today = monthStart(asOf);

  return (
    <>
      <main
        id="main-content"
        className="container relative mx-auto scroll-my-12 overflow-auto bg-background p-4 md:p-16 print:bg-white print:p-12"
      >
        <section className="mx-auto w-full max-w-2xl space-y-8 bg-background print:space-y-4 print:bg-white">
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
                      className={`inline-flex gap-x-1.5 align-baseline leading-none hover:underline${index > 0 ? 'opacity-80' : ''}`}
                      href={location.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {
                        // Stryker disable next-line all: decorative icon on the primary location
                        index === 0 ? (
                          <GlobeIcon className="size-3" aria-hidden="true" />
                        ) : null
                      }
                      {location.name}
                    </a>
                  </React.Fragment>
                ))}
              </p>
              {data.contact.email ? (
                <p
                  aria-live="polite"
                  // leading-6: the copy button is a 24px-tall target (WCAG 2.5.8).
                  // Hidden on paper: the print-only block below has the address.
                  className="flex text-xs leading-6 text-muted-foreground print:hidden"
                >
                  <CopyText
                    text={data.contact.email}
                    label={`${data.ui.contact.copyEmail} ${data.contact.email}`}
                    copiedLabel={data.ui.contact.copied}
                    onCopy={() => track('contact_email_copy')}
                  />
                </p>
              ) : null}
              {data.contact.phones.length > 0 ? (
                <PhoneLine state={phones} ui={data.ui.contact} />
              ) : null}
              <p className="flex text-xs leading-6 text-muted-foreground print:hidden">
                <a
                  href="/contact.vcf"
                  download
                  onClick={() => track('save_contact')}
                  className={TEXT_LINK}
                >
                  <DownloadIcon className="size-3" aria-hidden="true" />
                  {data.ui.contact.saveContact}
                </a>
              </p>
              <div className="flex gap-x-1 pt-1 text-sm text-muted-foreground print:hidden">
                {data.contact.email ? (
                  <a
                    href={`mailto:${data.contact.email}`}
                    aria-label={data.ui.contact.email}
                    onClick={() => track('contact_email')}
                    className={ICON_LINK}
                  >
                    <MailIcon className="size-4" aria-hidden="true" />
                  </a>
                ) : null}
                {data.contact.social.map(social => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={data.ui.contact.profiles[social.name]}
                    onClick={() => track(SOCIAL_EVENTS[social.name])}
                    className={ICON_LINK}
                  >
                    <social.icon className="size-4" aria-hidden="true" />
                  </a>
                ))}
                <PrintButton />
                <div className="flex size-8 items-center justify-center">
                  <ModeToggle />
                </div>
                <div className="flex size-8 items-center justify-center">
                  <LanguageToggle />
                </div>
              </div>
              <div className="hidden flex-col gap-x-1 text-sm text-muted-foreground print:flex print:text-[12px]">
                {data.contact.email ? (
                  <a href={`mailto:${data.contact.email}`}>
                    <span className="underline">{data.contact.email}</span>
                  </a>
                ) : null}
                {/* Decoded on reveal or on beforeprint, so paper always has both numbers. */}
                {phones.printPhones.map(phone => (
                  <a key={phone} href={`tel:${phone}`}>
                    <span className="underline">{formatPhone(phone)}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="flex shrink-0 items-end gap-4">
              {printQr ? (
                <figure className="hidden flex-col items-center print:flex">
                  {printQr}
                  <figcaption className="text-[10px] text-muted-foreground">
                    {data.ui.print.qrCaption}
                  </figcaption>
                </figure>
              ) : null}
              <ProfileAvatar
                src={data.avatarUrl}
                alt={data.name}
                fallback={data.initials}
              />
            </div>
          </div>
          <Section title={data.ui.sections.about}>
            <p className="text-pretty text-sm text-muted-foreground print:text-[12px]">
              {withExperience(data.summary, lang, today)}
            </p>
          </Section>
          <Section title={data.ui.sections.work}>
            {data.work.map(work => {
              return (
                <Card key={work.company}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-x-2 text-base">
                      <h3 className="inline-flex items-center justify-center gap-x-2 font-semibold leading-none">
                        <Image
                          src={work.logo}
                          alt={`${work.company} logo`}
                          width={20}
                          height={20}
                          className="size-5 rounded-sm object-contain"
                        />
                        <a className="hover:underline" href={work.link}>
                          {work.company}
                        </a>

                        <span className="inline-flex gap-x-1">
                          {work.badges.map(badge => (
                            <Badge
                              variant="secondary"
                              className="align-middle text-xs print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
                              key={badge}
                            >
                              {badge}
                            </Badge>
                          ))}
                        </span>
                      </h3>
                      <div className="shrink-0 text-sm tabular-nums text-muted-foreground">
                        {formatPeriod(
                          work.start,
                          work.end,
                          lang,
                          data.ui.present,
                        )}
                      </div>
                    </div>

                    <div className="flex items-baseline justify-between gap-x-2">
                      <h4 className="text-sm leading-none print:text-[12px]">
                        {work.title}
                      </h4>
                      <span className="shrink-0 text-xs tabular-nums text-muted-foreground print:text-[10px]">
                        {formatDuration(
                          durationMonths(work.start, work.end, today),
                          lang,
                        )}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="mt-2 text-sm print:text-[10px]">
                    <ul className="list-disc space-y-1 pl-4">
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
            {data.education.map(education => {
              return (
                <Card key={education.school}>
                  <CardHeader>
                    <div className="flex items-center justify-between gap-x-2 text-base">
                      <h3 className="font-semibold leading-none">
                        {education.school}
                      </h3>
                      <div className="shrink-0 text-sm tabular-nums text-muted-foreground">
                        {formatPeriod(
                          education.start,
                          education.end,
                          lang,
                          data.ui.present,
                        )}
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
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {group.category}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {group.items.map(skill => (
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
              {data.certifications.map(cert => (
                <div
                  key={`${cert.title}-${cert.issuer}`}
                  className="flex items-center justify-between"
                >
                  <div className="flex flex-col">
                    <div className="flex flex-wrap items-center gap-x-2">
                      <a
                        href={cert.url}
                        onClick={() =>
                          track('cert_link', {
                            cert: cert.title,
                            issuer: cert.issuer,
                          })
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium hover:underline"
                      >
                        {cert.title}
                      </a>
                      {cert.verified ? (
                        <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground">
                          <BadgeCheckIcon
                            className="size-3"
                            aria-hidden="true"
                          />
                          {data.ui.verified}
                        </span>
                      ) : null}
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                      <IssuerIcon
                        issuer={cert.issuer}
                        className="size-3.5 shrink-0"
                      />
                      {cert.issuer}
                    </span>
                  </div>
                  <span className="ml-4 shrink-0 text-sm tabular-nums text-muted-foreground">
                    {cert.year}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section title={data.ui.sections.languages}>
            <div className="flex gap-6">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex flex-col">
                  <span className="text-sm font-medium">{lang.language}</span>
                  <span className="text-xs text-muted-foreground">
                    {lang.proficiency}
                  </span>
                </div>
              ))}
            </div>
          </Section>

          <Section
            className="print-force-new-page scroll-mb-16"
            title={data.ui.sections.projects}
          >
            <div
              // Stryker disable next-line StringLiteral: layout-only classes
              className={`-mx-3 grid gap-3 print:grid-cols-3 print:gap-2 ${projectGridCols(data.projects.length)}`}
            >
              {data.projects.map(project => {
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
