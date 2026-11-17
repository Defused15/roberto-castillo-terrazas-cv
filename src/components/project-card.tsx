import {
  Card,
  CardHeader,
  CardContent,
  CardDescription,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { GitHubIcon } from "./icons";
import { track } from "@/lib/analytics";

interface Props {
  title: string;
  description: string;
  tags: readonly string[];
  link?: string;
  linkLabel?: string;
  githubLink?: string;
  githubLabel?: string;
}

function getCleanLink(link: string) {
  return link.replace(/^https?:\/\//i, "").replace(/^www\./i, "");
}

export function ProjectCard({
  title,
  description,
  tags,
  link,
  linkLabel,
  githubLink,
  githubLabel = "GitHub repo",
}: Props) {
  const printedLink = linkLabel || (link && getCleanLink(link));

  return (
    <Card className="flex flex-col overflow-hidden border border-muted p-3">
      <CardHeader>
        <div className="space-y-1">
          <CardTitle className="text-base">
            <div className="inline-flex items-center gap-2">
              {link ? (
                <a
                  href={link}
                  onClick={() => track("project_link", { project: title })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {title}
                </a>
              ) : (
                title
              )}
              {githubLink && (
                <a
                  href={githubLink}
                  onClick={() => track("project_repo", { project: title })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-normal text-muted-foreground hover:text-foreground transition-colors"
                >
                  <GitHubIcon className="size-3" />
                  <span>{githubLabel}</span>
                </a>
              )}
            </div>
          </CardTitle>

          {printedLink ? (
            <div className="hidden text-xs underline print:block">
              {printedLink}
            </div>
          ) : null}

          <CardDescription className="text-xs print:text-[10px]">
            {description}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="mt-auto flex">
        <div className="mt-2 flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Badge
              className="px-1 py-0 text-[10px] print:px-1 print:py-0.5 print:text-[8px] print:leading-tight"
              variant="secondary"
              key={tag}
            >
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}