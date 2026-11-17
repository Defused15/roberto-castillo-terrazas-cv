"use client";

import React from "react";
import { ChevronDownIcon } from "lucide-react";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/data/resume-data";

/** Bullets shown per job before "Show N more". */
export const VISIBLE_BULLETS = 4;

/**
 * A job's bullets: the first few, the rest behind a "Show N more" toggle that
 * grows open (grid rows 0fr → 1fr plus opacity). Collapsed bullets are
 * `invisible`, so they are out of the tab order and the accessibility tree,
 * but on paper every bullet is printed and the toggle is hidden.
 */
export function WorkBullets({
  company,
  bullets,
  ui,
}: {
  company: string;
  bullets: readonly string[];
  ui: ResumeData["ui"]["bullets"];
}) {
  const [expanded, setExpanded] = React.useState(false);
  const id = React.useId();
  const shown = bullets.slice(0, VISIBLE_BULLETS);
  const rest = bullets.slice(VISIBLE_BULLETS);

  function toggle() {
    if (!expanded) track("bullets_expand", { company });
    setExpanded(!expanded);
  }

  return (
    <>
      <ul className="list-disc space-y-1 pl-4">
        {shown.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
      {rest.length > 0 ? (
        <>
          <div
            id={id}
            className={cn(
              "bullets-collapse grid print:visible print:grid-rows-[1fr] print:opacity-100",
              expanded ? "grid-rows-[1fr] opacity-100" : "invisible grid-rows-[0fr] opacity-0",
            )}
          >
            <ul className="list-disc space-y-1 overflow-hidden pl-4">
              {rest.map((point, index) => (
                // The first hidden bullet gets the list gap as padding, so the
                // collapsed height is exactly zero.
                <li key={index} className={index === 0 ? "pt-1" : undefined}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={id}
            onClick={toggle}
            className="mt-1.5 inline-flex items-center gap-1 rounded-sm text-xs text-muted-foreground underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring print:hidden"
          >
            {expanded ? ui.showLess : ui.showMore.replace("{n}", String(rest.length))}
            <ChevronDownIcon
              aria-hidden="true"
              className={cn("bullets-chevron size-3", expanded && "rotate-180")}
            />
          </button>
        </>
      ) : null}
    </>
  );
}
