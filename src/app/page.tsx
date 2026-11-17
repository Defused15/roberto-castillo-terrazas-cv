import { RESUME_DATA } from "@/data/resume-data";
import { ResumeContent } from "@/components/resume-content";
import { buildPersonJsonLd, serializeJsonLd } from "./structured-data";

export default function Page() {
  const jsonLd = serializeJsonLd(buildPersonJsonLd(RESUME_DATA));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />
      <ResumeContent />
    </>
  );
}
