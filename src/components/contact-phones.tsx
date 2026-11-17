"use client";

import React from "react";
import { flushSync } from "react-dom";
import { PhoneIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { decodePhone, type EncodedPhone } from "@/lib/decode-phone";
import { formatPhone, phoneCountry } from "@/lib/format-phone";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/data/resume-data";

type ContactUi = ResumeData["ui"]["contact"];

const PHONE_LINE_ID = "contact-phones";
/** How long "Copied ✓" stays up after a copy. */
const COPIED_MS = 1600;

/** Reports a phone copy or call by country only; the number itself is never sent. */
export function trackPhone(e164: string) {
  const country = phoneCountry(e164);
  if (country) track("contact_phone", { number_country: country });
}

/**
 * Reveal state for the phone numbers. They stay encoded until the visitor asks
 * for them (text or icon button), or until the browser is about to print, so
 * the server HTML never contains them.
 */
export function usePhoneReveal(encoded: readonly EncodedPhone[]) {
  const [revealed, setRevealed] = React.useState(false);
  const [printing, setPrinting] = React.useState(false);
  const firstNumber = React.useRef<HTMLButtonElement>(null);
  const focusPending = React.useRef(false);

  // Stryker disable next-line ArrayDeclaration: equivalent mutant
  React.useEffect(() => {
    // flushSync: the print block must be in the DOM before the browser lays out the page.
    const onBeforePrint = () => flushSync(() => setPrinting(true));
    window.addEventListener("beforeprint", onBeforePrint);
    return () => window.removeEventListener("beforeprint", onBeforePrint);
  }, []);

  React.useEffect(() => {
    if (revealed && focusPending.current) {
      focusPending.current = false;
      firstNumber.current?.focus();
    }
  }, [revealed]);

  const reveal = React.useCallback(
    ({ focus }: { focus: boolean }) => {
      if (revealed) {
        if (focus) firstNumber.current?.focus();
        return;
      }
      focusPending.current = focus;
      setRevealed(true);
      track("contact_phone_reveal");
    },
    [revealed],
  );

  const decoded = React.useMemo(
    () => (revealed || printing ? encoded.map(decodePhone) : []),
    [encoded, revealed, printing],
  );

  return { revealed, phones: revealed ? decoded : [], printPhones: decoded, reveal, firstNumber };
}

type Reveal = ReturnType<typeof usePhoneReveal>;

/**
 * The header line: a muted "Show phone numbers" button that turns into the
 * numbers. Each number copies itself; on touch screens a small call link sits
 * next to it. The line reserves its revealed height (two stacked lines on
 * narrow screens, one from `sm` up) so nothing below moves.
 */
export function PhoneLine({ state, ui }: { state: Reveal; ui: ContactUi }) {
  return (
    <p
      id={PHONE_LINE_ID}
      aria-live="polite"
      // Stryker disable next-line StringLiteral: layout-only classes
      className="flex min-h-8 flex-col items-start text-xs leading-4 text-muted-foreground sm:min-h-4 sm:flex-row sm:flex-wrap sm:items-center print:hidden"
    >
      {state.revealed ? (
        state.phones.map((phone, index) => (
          <React.Fragment key={phone}>
            {index > 0 ? (
              <span aria-hidden="true" className="phone-reveal mx-1.5 hidden sm:inline" style={stagger(index)}>
                ·
              </span>
            ) : null}
            <PhoneNumber
              e164={phone}
              ui={ui}
              index={index}
              buttonRef={index === 0 ? state.firstNumber : undefined}
            />
          </React.Fragment>
        ))
      ) : (
        <button
          type="button"
          aria-expanded={false}
          aria-controls={PHONE_LINE_ID}
          onClick={() => state.reveal({ focus: true })}
          className="inline-flex items-center gap-1 rounded-sm underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PhoneIcon className="size-3" aria-hidden="true" />
          {ui.showPhones}
        </button>
      )}
    </p>
  );
}

// Stryker disable next-line all: animation timing only, verified visually
const stagger = (index: number) => ({ "--stagger": index }) as React.CSSProperties;

function PhoneNumber({
  e164,
  ui,
  index,
  buttonRef,
}: {
  e164: string;
  ui: ContactUi;
  index: number;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const [copiedAt, setCopiedAt] = React.useState<number | null>(null);
  const formatted = formatPhone(e164);

  React.useEffect(() => {
    if (copiedAt === null) return;
    const timer = setTimeout(() => setCopiedAt(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  async function copy() {
    trackPhone(e164);
    try {
      await navigator.clipboard.writeText(e164);
      setCopiedAt(Date.now());
    } catch {
      // Clipboard unavailable (insecure context or denied): the number stays selectable.
    }
  }

  const copied = copiedAt !== null;
  return (
    <span className="phone-reveal inline-flex items-center gap-1 whitespace-nowrap" style={stagger(index)}>
      <button
        ref={buttonRef}
        type="button"
        onClick={copy}
        aria-label={`${ui.copy} ${formatted}`}
        className="grid justify-items-start rounded-sm tabular-nums underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {/* Both labels share one grid cell, so the button keeps the wider width. */}
        <span className={cn("phone-swap [grid-area:1/1]", copied && "opacity-0")}>{formatted}</span>
        <span
          aria-hidden="true"
          className={cn(
            "phone-swap select-none [grid-area:1/1] text-foreground",
            !copied && "invisible translate-y-0.5 opacity-0",
          )}
        >
          {ui.copied}
        </span>
      </button>
      <span className="sr-only">{copied ? ui.copied : ""}</span>
      <a
        href={`tel:${e164}`}
        onClick={() => trackPhone(e164)}
        aria-label={`${ui.call} ${formatted}`}
        className="hidden rounded-sm p-0.5 hover:text-foreground [@media(pointer:coarse)]:inline-flex"
      >
        <PhoneIcon className="size-3" aria-hidden="true" />
      </a>
    </span>
  );
}

/** The phone icon in the quick-contact row: reveals the header line (no tel: link in the HTML). */
export function PhoneIconButton({ state, ui }: { state: Reveal; ui: ContactUi }) {
  return (
    <Button
      className="size-8"
      variant="outline"
      size="icon"
      aria-label={ui.phoneButton}
      aria-expanded={state.revealed}
      aria-controls={PHONE_LINE_ID}
      onClick={() => state.reveal({ focus: state.revealed })}
    >
      <PhoneIcon className="size-4" aria-hidden="true" />
    </Button>
  );
}
