'use client';

import React from 'react';
import {cn} from '@/lib/utils';

/** How long the "Copied ✓" label stays up after a copy. */
const COPIED_MS = 1600;

/**
 * Text that copies `value` on click and confirms it in place: the confirmation
 * shares a grid cell with the text, so the button keeps the wider of the two
 * widths and nothing around it moves. Place it inside an `aria-live` region so
 * the visually hidden confirmation is announced.
 */
export function CopyText({
  text,
  value,
  label,
  copiedLabel,
  onCopy,
  buttonRef,
  className,
}: {
  /** What is shown, e.g. a formatted phone number. */
  text: string;
  /** What is copied; defaults to `text`. */
  value?: string;
  /** Accessible name; should contain `text` so voice users can say what they see. */
  label: string;
  copiedLabel: string;
  /** Called on every click, before the clipboard write (for analytics). */
  onCopy?: () => void;
  buttonRef?: React.Ref<HTMLButtonElement>;
  className?: string;
}) {
  const [copiedAt, setCopiedAt] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (copiedAt === null) return;
    const timer = setTimeout(() => setCopiedAt(null), COPIED_MS);
    return () => clearTimeout(timer);
  }, [copiedAt]);

  async function copy() {
    onCopy?.();
    try {
      await navigator.clipboard.writeText(value ?? text);
      setCopiedAt(Date.now());
    } catch {
      // Clipboard unavailable (insecure context or denied): the text stays selectable.
    }
  }

  const copied = copiedAt !== null;
  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={copy}
        aria-label={label}
        className={cn(
          'grid justify-items-start rounded-sm underline-offset-2 transition-colors hover:text-foreground hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
          className,
        )}
      >
        <span
          className={cn('copy-swap [grid-area:1/1]', copied && 'opacity-0')}
        >
          {text}
        </span>
        <span
          aria-hidden="true"
          className={cn(
            'copy-swap select-none text-foreground [grid-area:1/1]',
            !copied && 'invisible translate-y-0.5 opacity-0',
          )}
        >
          {copiedLabel}
        </span>
      </button>
      <span className="sr-only">{copied ? copiedLabel : ''}</span>
    </>
  );
}
