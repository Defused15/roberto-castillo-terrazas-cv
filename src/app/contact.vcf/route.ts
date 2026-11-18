import {RESUME_DATA} from '@/data/resume-data';
import {buildVCard} from '@/lib/vcard';

/**
 * Downloadable contact card. TRADEOFF: it carries the decoded phone numbers in
 * a static file, which the HTML deliberately avoids (scrapers). To drop it,
 * delete this folder and `src/lib/vcard.ts`; nothing else imports them.
 */
export const dynamic = 'force-static';

export function GET() {
  return new Response(buildVCard(RESUME_DATA), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': 'attachment; filename="roberto-castillo.vcf"',
    },
  });
}
