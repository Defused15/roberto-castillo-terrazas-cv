import {RESUME_DATA} from '@/data/resume-data';
import {SkipLink} from '@/components/skip-link';
import {ResumeContent} from '@/components/resume-content';
import {PrintQr} from '@/components/print-qr';
import {buildPersonJsonLd, serializeJsonLd} from './structured-data';
import {BUILD_MONTH} from './site-config';
import {fetchTestHubResults} from '@/lib/test-hub';

export default async function Page() {
  const quality = await fetchTestHubResults();
  const jsonLd = serializeJsonLd(buildPersonJsonLd(RESUME_DATA));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: jsonLd}}
      />
      <SkipLink targetId="main-content" />
      {/* The QR code is encoded here, on the server, so the encoder ships no client JS. */}
      <ResumeContent
        asOf={BUILD_MONTH}
        printQr={<PrintQr />}
        quality={quality}
      />
    </>
  );
}
