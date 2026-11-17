import { cn } from "@/lib/utils";
import React from "react";

export interface SectionProps
  extends Omit<React.HTMLAttributes<HTMLElement>, "title"> {
  /** Visible heading; it also names the region landmark for assistive tech. */
  title: React.ReactNode;
}

/**
 * A titled CV section. A `<section>` with an accessible name is exposed as a
 * region landmark, so the name comes from its own `<h2>` via aria-labelledby:
 * it always matches the visible (and translated) heading.
 */
export function Section({ title, className, children, ...props }: SectionProps) {
  const headingId = React.useId();

  return (
    <section
      aria-labelledby={headingId}
      className={cn(
        "flex min-h-0 flex-col gap-y-3 bg-background",
        className
      )}
      {...props}
    >
      <h2 id={headingId} className="text-xl font-bold">
        {title}
      </h2>
      {children}
    </section>
  );
}
