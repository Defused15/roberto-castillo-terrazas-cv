'use client';

import * as React from 'react';
import {useLanguage} from '@/components/language-provider';
import {encodeQR, QR_QUIET_ZONE} from '@/lib/qr';

export const PRINT_QR_URL = 'https://www.rcastillo.dev';

/** QR code to the live CV, shown only when printing, with a caption in the page language. */
export function PrintQr() {
  const {data} = useLanguage();
  const modules = React.useMemo(() => encodeQR(PRINT_QR_URL), []);
  const view = modules.length + 2 * QR_QUIET_ZONE;

  return (
    <figure className="hidden print:block">
      <svg
        viewBox={`0 0 ${view} ${view}`}
        className="h-[72px] w-[72px] bg-white"
        shapeRendering="crispEdges"
        aria-hidden="true"
        focusable="false"
      >
        {modules.flatMap((row, y) =>
          row.map((dark, x) =>
            dark ? (
              <rect
                key={`${x}-${y}`}
                x={x + QR_QUIET_ZONE}
                y={y + QR_QUIET_ZONE}
                width={1}
                height={1}
                fill="#000"
              />
            ) : null,
          ),
        )}
      </svg>
      <figcaption className="text-xs">{data.ui.print.qrCaption}</figcaption>
    </figure>
  );
}
