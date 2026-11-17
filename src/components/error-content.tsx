"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon, RotateCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { track } from "@/lib/analytics";

// Stryker disable next-line all: entrance animation delay, verified visually
function stagger(n: number): React.CSSProperties {
  return { "--stagger": n } as React.CSSProperties;
}

export function ErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { data } = useLanguage();
  const { title, description, retry, backHome } = data.ui.error;

  useEffect(() => {
    // Only the opaque digest is sent: the message could contain personal data.
    if (error.digest) track("app_error", { digest: error.digest });
  }, [error]);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-background p-4 md:p-16">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <h1 className="nf-enter text-3xl font-bold md:text-4xl" style={stagger(0)}>
          {title}
        </h1>
        <p
          className="nf-enter mt-3 max-w-md text-pretty text-base text-muted-foreground"
          style={stagger(1)}
        >
          {description}
        </p>
        <div className="nf-enter mt-8 flex flex-wrap justify-center gap-3" style={stagger(2)}>
          <Button size="lg" className="gap-2" onClick={() => reset()}>
            <RotateCcwIcon className="size-4" aria-hidden="true" />
            {retry}
          </Button>
          <Button asChild size="lg" variant="outline" className="gap-2">
            <Link href="/">
              <ArrowLeftIcon className="size-4" aria-hidden="true" />
              {backHome}
            </Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
