import Link from "next/link";
import type { ResumeData } from "@/data/resume-data";

/** Small page footer with the privacy link. Screen only: the printed CV stays clean. */
export function SiteFooter({ data }: { data: ResumeData }) {
  return (
    <footer className="bg-white pb-8 text-center text-xs text-muted-foreground print:hidden dark:bg-gray-900">
      <span>© 2026 {data.name}</span>
      <span aria-hidden="true" className="mx-1.5">
        ·
      </span>
      <Link href="/privacy" className="hover:underline">
        {data.ui.privacy.link}
      </Link>
    </footer>
  );
}
