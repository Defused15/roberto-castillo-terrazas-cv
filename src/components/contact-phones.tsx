'use client';

import React from 'react';
import {flushSync} from 'react-dom';
import {PhoneIcon} from 'lucide-react';
import {CopyText} from '@/components/copy-text';
import {decodePhone, type EncodedPhone} from '@/lib/decode-phone';
import {formatPhone, phoneCountry} from '@/lib/format-phone';
import {track} from '@/lib/analytics';
import type {ResumeData} from '@/data/resume-data';

type ContactUi = ResumeData['ui']['contact'];

const PHONE_LINE_ID = 'contact-phones';

/** Reports a phone copy or call by country only; the number itself is never sent. */
export function trackPhone(e164: string) {
  const country = phoneCountry(e164);
  if (country) track('contact_phone', {number_country: country});
}

/**
 * Reveal state for the phone numbers. They stay encoded until the visitor asks
 * for them (the "Show phone numbers" button), or until the browser is about to print, so
 * the server HTML never contains them.
 */
export function usePhoneReveal(encoded: readonly EncodedPhone[]) {
  const [revealed, setRevealed] = React.useState(false);
  const [printing, setPrinting] = React.useState(false);
  const firstNumber = React.useRef<HTMLButtonElement>(null);

  // Stryker disable next-line ArrayDeclaration: equivalent mutant
  React.useEffect(() => {
    // flushSync: the print block must be in the DOM before the browser lays out the page.
    const onBeforePrint = () => flushSync(() => setPrinting(true));
    window.addEventListener('beforeprint', onBeforePrint);
    return () => window.removeEventListener('beforeprint', onBeforePrint);
  }, []);

  // The button that was clicked is replaced by the numbers, so focus moves to the first one.
  React.useEffect(() => {
    if (revealed) firstNumber.current?.focus();
  }, [revealed]);

  const reveal = React.useCallback(() => {
    setRevealed(true);
    track('contact_phone_reveal');
  }, []);

  const decoded = React.useMemo(
    () => (revealed || printing ? encoded.map(decodePhone) : []),
    [encoded, revealed, printing],
  );

  return {
    revealed,
    phones: revealed ? decoded : [],
    printPhones: decoded,
    reveal,
    firstNumber,
  };
}

type Reveal = ReturnType<typeof usePhoneReveal>;

/**
 * The header line: a muted "Show phone numbers" button that turns into the
 * numbers. Each number copies itself; on touch screens a small call link sits
 * next to it. The line reserves its revealed height (two stacked lines on
 * narrow screens, one from `sm` up) so nothing below moves. Lines are 24px
 * tall so every button and link meets the WCAG 2.5.8 minimum target size.
 */
export function PhoneLine({state, ui}: {state: Reveal; ui: ContactUi}) {
  return (
    <p
      id={PHONE_LINE_ID}
      aria-live="polite"
      // Stryker disable next-line StringLiteral: layout-only classes
      className="flex min-h-12 flex-col items-start text-xs leading-6 text-muted-foreground sm:min-h-6 sm:flex-row sm:flex-wrap sm:items-center print:hidden"
    >
      {state.revealed ? (
        state.phones.map((phone, index) => (
          <React.Fragment key={phone}>
            {index > 0 ? (
              <span
                aria-hidden="true"
                className="phone-reveal mx-1.5 hidden sm:inline"
                style={stagger(index)}
              >
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
          onClick={state.reveal}
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
const stagger = (index: number) =>
  ({'--stagger': index}) as React.CSSProperties;

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
  const formatted = formatPhone(e164);
  return (
    <span
      className="phone-reveal inline-flex items-center gap-1 whitespace-nowrap"
      style={stagger(index)}
    >
      <CopyText
        text={formatted}
        value={e164}
        label={`${ui.copy} ${formatted}`}
        copiedLabel={ui.copied}
        onCopy={() => trackPhone(e164)}
        buttonRef={buttonRef}
        className="tabular-nums"
      />
      <a
        href={`tel:${e164}`}
        onClick={() => trackPhone(e164)}
        aria-label={`${ui.call} ${formatted}`}
        className="hidden size-6 items-center justify-center rounded-sm hover:text-foreground [@media(pointer:coarse)]:inline-flex"
      >
        <PhoneIcon className="size-3" aria-hidden="true" />
      </a>
    </span>
  );
}
