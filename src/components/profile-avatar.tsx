"use client";

import * as React from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

interface Props {
  src: string;
  alt: string;
  fallback: string;
  className?: string;
}

/**
 * Rounded avatar rendered with next/image so the <img> is present in the
 * server HTML (Radix AvatarImage only mounts it after a client-side load).
 * Falls back to initials if the image fails to load.
 */
export function ProfileAvatar({ src, alt, fallback, className }: Props) {
  const [failed, setFailed] = React.useState(false);

  return (
    <div
      className={cn(
        "relative flex size-28 shrink-0 overflow-hidden rounded-xl",
        className,
      )}
    >
      {failed ? (
        <div className="flex h-full w-full items-center justify-center rounded-xl bg-muted">
          {fallback}
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          width={112}
          height={112}
          priority
          onError={() => setFailed(true)}
          className="aspect-square h-full w-full object-cover"
        />
      )}
    </div>
  );
}
