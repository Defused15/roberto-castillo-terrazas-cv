"use client";

// Replaces the root layout when it fails, so it renders its own <html> and has
// no providers, fonts or theme: plain, self-contained and bilingual.
const TEXT = {
  en: { title: "Something went wrong", retry: "Try again", home: "Back to the CV" },
  es: { title: "Algo salió mal", retry: "Intentar de nuevo", home: "Volver al CV" },
} as const;

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const lang = typeof navigator !== "undefined" && navigator.language.toLowerCase().startsWith("es") ? "es" : "en";
  const t = TEXT[lang];
  return (
    <html lang={lang}>
      <body style={{ fontFamily: "system-ui, sans-serif", margin: 0, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: "1rem" }}>
        <main>
          <h1 style={{ fontSize: "1.875rem" }}>{t.title}</h1>
          <p>
            <button type="button" onClick={() => reset()} style={{ marginRight: "1rem", padding: "0.5rem 1rem", cursor: "pointer" }}>
              {t.retry}
            </button>
            <a href="/" style={{ color: "inherit" }}>{t.home}</a>
          </p>
        </main>
      </body>
    </html>
  );
}
