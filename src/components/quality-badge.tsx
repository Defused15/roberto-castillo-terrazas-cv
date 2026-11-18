import {CheckCircle2Icon} from 'lucide-react';
import type {Lang} from '@/data/resume-data';
import {TEST_HUB_URL, type TestHubStats} from '@/lib/test-hub';

const TEXT = {
  en: {
    passing: (n: number) => `${n} tests passing`,
    locale: 'en-GB',
  },
  es: {
    passing: (n: number) => `${n} tests en verde`,
    locale: 'es-ES',
  },
} as const;

/** Live result of a project's test suite, read from the QA Test Hub at build time. */
export function QualityBadge({stats, lang}: {stats: TestHubStats; lang: Lang}) {
  const t = TEXT[lang];
  const date = new Date(`${stats.ranOn}T00:00:00Z`).toLocaleDateString(
    t.locale,
    {day: 'numeric', month: 'short', timeZone: 'UTC'},
  );
  return (
    <a
      href={TEST_HUB_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground transition-colors hover:text-foreground hover:underline print:hidden"
    >
      <CheckCircle2Icon
        className="size-3.5 text-foreground"
        aria-hidden="true"
      />
      <span className="whitespace-nowrap font-medium text-foreground">
        {t.passing(stats.passed)}
      </span>
      <span aria-hidden="true">·</span>
      <time className="whitespace-nowrap" dateTime={stats.ranOn}>
        {date}
      </time>
    </a>
  );
}
