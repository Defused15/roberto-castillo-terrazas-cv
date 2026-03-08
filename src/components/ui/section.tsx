import { cn } from "@/lib/utils";
import React from "react";

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  ariaLabel?: string;
}

export function Section({ className, ariaLabel, ...props }: SectionProps) {
  return (
    <section
      role="region"
      aria-label={ariaLabel}
      className={cn(
        "flex min-h-0 flex-col gap-y-3 bg-white dark:bg-gray-900",
        className
      )}
      {...props}
    />
  );
}