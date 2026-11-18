'use client';

import React from 'react';
import {ArrowLeftIcon} from 'lucide-react';
import {Section} from '@/components/ui/section';
import {useLanguage} from '@/components/language-provider';

export const AEPD_URL = 'https://www.aepd.es';

/** Turns the `{email}` and `{aepd}` placeholders of a paragraph into links. */
function withLinks(text: string, email: string) {
  return text.split(/(\{email\}|\{aepd\})/).map((part, i) => {
    if (part === '{email}') {
      return (
        <a
          key={i}
          className="underline hover:text-foreground"
          href={`mailto:${email}`}
        >
          {email}
        </a>
      );
    }
    if (part === '{aepd}') {
      return (
        <a
          key={i}
          className="underline hover:text-foreground"
          href={AEPD_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          aepd.es
        </a>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/** The privacy notice in the language currently selected in LanguageProvider. */
export function PrivacyContent() {
  const {data} = useLanguage();
  const privacy = data.ui.privacy;

  return (
    <main className="container relative mx-auto bg-background p-4 md:p-16">
      <article className="mx-auto w-full max-w-2xl space-y-8">
        <header className="space-y-1.5">
          <h1 className="text-2xl font-bold">{privacy.title}</h1>
          <p className="text-pretty text-sm text-muted-foreground">
            {privacy.intro}
          </p>
        </header>
        {privacy.sections.map(section => (
          <Section key={section.title} title={section.title}>
            {section.paragraphs.map((paragraph, i) => (
              <p key={i} className="text-pretty text-sm text-muted-foreground">
                {withLinks(paragraph, data.contact.email)}
              </p>
            ))}
          </Section>
        ))}
        <p className="text-xs text-muted-foreground">
          {privacy.lastUpdatedLabel}: {privacy.lastUpdated}
        </p>
        {/* Plain <a>: next/link adds ~5 kB gzip to the first load; a full load of a static page is fine here. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
        >
          <ArrowLeftIcon className="size-4" aria-hidden="true" />
          {data.ui.notFound.backHome}
        </a>
      </article>
    </main>
  );
}
