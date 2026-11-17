"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";
import { trackWhenReady } from "@/lib/analytics";

// Stryker disable next-line all: entrance animation delay, verified visually
function stagger(n: number): React.CSSProperties {
  return { "--stagger": n } as React.CSSProperties;
}

export function NotFoundContent() {
  const { data } = useLanguage();
  const { title, description, backHome } = data.ui.notFound;

  useEffect(() => {
    trackWhenReady("not_found", { path: window.location.pathname });
  }, []);

  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-white p-4 dark:bg-gray-900 md:p-16">
      <section className="mx-auto flex w-full max-w-2xl flex-col items-center text-center">
        <p
          className="nf-enter select-none bg-gradient-to-b from-foreground/30 to-foreground/5 bg-clip-text text-8xl font-bold tabular-nums leading-none text-transparent md:text-9xl"
          style={stagger(0)}
          aria-hidden="true"
        >
          404
        </p>
        <h1
          className="nf-enter mt-6 text-3xl font-bold md:text-4xl"
          style={stagger(1)}
        >
          {title}
        </h1>
        <p
          className="nf-enter mt-3 max-w-md text-pretty text-base text-muted-foreground"
          style={stagger(2)}
        >
          {description}
        </p>
        <div className="nf-enter mt-8" style={stagger(3)}>
          <Button
            asChild
            size="lg"
            className="gap-2 transition-[transform,background-color] duration-150 ease-out active:scale-[0.97]"
          >
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
