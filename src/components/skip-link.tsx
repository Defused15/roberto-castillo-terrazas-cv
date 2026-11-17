"use client";

import { useLanguage } from "@/components/language-provider";

/** First focusable element: hidden until focused, then jumps to the main landmark. */
export function SkipLink({ targetId }: { targetId: string }) {
  const { data } = useLanguage();
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:px-3 focus:py-2 focus:text-sm focus:font-medium print:hidden"
    >
      {data.ui.skipToContent}
    </a>
  );
}
