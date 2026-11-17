"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Section } from "@/components/ui/section";
import { GlobeIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/project-card";
import { ModeToggle } from "@/components/darkmode";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export function ResumeContent() {
  const { data } = useLanguage();
  const projectCount = data.projects.length as number;

  return (
    <main className={`container bg-white dark:bg-gray-900 relative mx-auto scroll-my-12 overflow-auto p-4 print:p-12 md:p-16`}>
      <section className="mx-auto bg-white dark:bg-gray-900 w-full max-w-2xl space-y-8 bg-white print:space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-1.5">
            <h1 className="text-2xl font-bold">{data.name}</h1>
            <p className="max-w-md text-pretty text-sm text-muted-foreground print:text-[12px]">
              {data.about}
            </p>
            <p className="max-w-md items-center text-pretty text-xs text-muted-foreground">
              <a
                className="inline-flex gap-x-1.5 align-baseline leading-none hover:underline"
                href={data.locationLink}
                target="_blank"
              >
                <GlobeIcon className="size-3" />
                {data.location}
              </a>
            </p>
            {data.contact.email ? (
              <p className="text-xs text-muted-foreground">
                {data.contact.email}
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
                  <a href={`mailto:${data.contact.email}`}>
                    <MailIcon className="size-4" />
                  </a>
                </Button>
              ) : null}
              {data.contact.tel ? (
                <Button
                  className="size-8"
                  variant="outline"
                  size="icon"
                  asChild
                >
                  <a href={`tel:${data.contact.tel}`}>
                    <PhoneIcon className="size-4" />
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
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    <social.icon className="size-4" />
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
              {data.contact.tel ? (
                <a href={`tel:${data.contact.tel}`}>
                  <span className="underline">{data.contact.tel}</span>
                </a>
              ) : null}
            </div>
          </div>

          <Avatar className="size-28">
            <AvatarImage alt={data.name} src={data.avatarUrl} />
            <AvatarFallback>{data.initials}</AvatarFallback>
          </Avatar>
        </div>
        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.about}</h2>
          <p className="text-pretty text-sm text-muted-foreground print:text-[12px]">
            {data.summary}
          </p>
        </Section>
        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.work}</h2>
          {data.work.map((work) => {
            return (
              <Card key={work.company}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="inline-flex items-center justify-center gap-x-2 font-semibold leading-none">
                      {work.logo && (
                        <img
                          src={work.logo.src}
                          alt={`${work.company} logo`}
                          className="size-5 rounded-sm object-contain"
                        />
                      )}
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
        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.education}</h2>
          {data.education.map((education) => {
            return (
              <Card key={education.school}>
                <CardHeader>
                  <div className="flex items-center justify-between gap-x-2 text-base">
                    <h3 className="font-semibold leading-none">
                      {education.school}
                    </h3>
                    <div className="text-sm tabular-nums text-gray-500">
                      {education.start} - {education.end}
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
        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.skills}</h2>
          <div className="flex flex-col gap-3">
            {data.skills.map((group) => (
              <div key={group.category}>
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

        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.certifications}</h2>
          <div className="flex flex-col gap-2">
            {data.certifications.map((cert) => (
              <div key={cert.title} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <a
                    href={cert.url}
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

        <Section>
          <h2 className="text-xl font-bold">{data.ui.sections.languages}</h2>
          <div className="flex gap-6">
            {data.languages.map((lang) => (
              <div key={lang.language} className="flex flex-col">
                <span className="text-sm font-medium">{lang.language}</span>
                <span className="text-xs text-muted-foreground">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section className="print-force-new-page scroll-mb-16">
          <h2 className="text-xl font-bold">{data.ui.sections.projects}</h2>
          <div className={`-mx-3 grid gap-3 print:grid-cols-3 print:gap-2 ${
            projectCount === 1
              ? "grid-cols-1"
              : projectCount === 2
              ? "grid-cols-1 md:grid-cols-2"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}>
            {data.projects.map((project) => {
              return (
                <ProjectCard
                  key={project.title}
                  title={project.title}
                  description={project.description}
                  tags={project.techStack}
                  link={project.link?.href}
                  githubLink={project.githubLink}
                  githubLabel={data.ui.githubRepo}
                />
              );
            })}
          </div>
        </Section>
      </section>

    </main>
  );
}