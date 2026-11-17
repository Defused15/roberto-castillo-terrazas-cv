"use client";

import Link from "next/link";
import { useLanguage } from "@/components/language-provider";

export function NotFoundContent() {
  const { data } = useLanguage();
  const { title, description, backHome } = data.ui.notFound;

  return (
    <main className="container bg-white dark:bg-gray-900 relative mx-auto p-4 md:p-16">
      <section className="mx-auto w-full max-w-2xl space-y-4">
        <p className="text-sm tabular-nums text-muted-foreground">404</p>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-pretty text-sm text-muted-foreground">
          {description}
        </p>
        <Link href="/" className="inline-block text-sm underline hover:no-underline">
          {backHome}
        </Link>
      </section>
    </main>
  );
}
