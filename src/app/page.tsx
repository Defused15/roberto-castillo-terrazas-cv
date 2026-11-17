import { RESUME_DATA } from "@/data/resume-data";
import { ResumeContent } from "@/components/resume-content";
import { buildPersonJsonLd } from "./structured-data";

export default function Page() {
  const jsonLd = JSON.stringify(buildPersonJsonLd(RESUME_DATA)).replace(
    /</g,
    "\\u003c",
  );

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
