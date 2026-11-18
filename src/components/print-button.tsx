'use client';

import {Printer} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {useLanguage} from '@/components/language-provider';
import {track} from '@/lib/analytics';

/** Icon button that opens the browser's print dialog (print or save as PDF). */
export function PrintButton() {
  const {data} = useLanguage();
  return (
    <Button
      variant="outline"
      size="icon"
      className="size-8 print:hidden"
      aria-label={data.ui.contact.print}
      onClick={() => {
        track('print_cv_button');
        window.print();
      }}
    >
      <Printer className="size-4" aria-hidden="true" />
    </Button>
  );
}
