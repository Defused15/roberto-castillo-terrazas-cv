import type { ResumeData } from "@/data/resume-data";

/**
 * Small page footer with the privacy link. Screen only: the printed CV stays clean.
 * A plain <a> on purpose: next/link would add about 11 kB to the CV's first load
 * for a link few visitors follow.
 */
export function SiteFooter({ data }: { data: ResumeData }) {
  return (
    <footer className="bg-background pb-8 text-center text-xs text-muted-foreground print:hidden">
      <span>© 2026 {data.name}</span>
      <span aria-hidden="true" className="mx-1.5">
        ·
      </span>
      <a href="/privacy" className="hover:underline">
        {data.ui.privacy.link}
      </a>
    </footer>
  );
}
