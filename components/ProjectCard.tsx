import { ArrowRight } from "lucide-react";
import { Card, CardBody, CardFooter, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ProjectPreview } from "@/components/ProjectPreview";
import type { Project } from "@/types";

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4";

/** A project's live URL is labelled honestly: a preview stays a preview. */
function liveLabel(project: Project) {
  return project.status === "Planning" ? "Preview" : "Live site";
}

/**
 * Project card: a large preview carrying the card's visual identity, then a
 * quiet block of name, status, one description and a restrained stack line.
 *
 * The whole card opens the write-up (the title holds the single stretched
 * link); source and live links stay separate tab stops in the footer. Hover is
 * one coordinated move — preview scale, card lift, border, underline, arrow —
 * and none of it is required to understand or use the card.
 */
export function ProjectCard({ project, lead = false }: { project: Project; lead?: boolean }) {
  const identity = (
    <CardHeader className="gap-1.5">
      <CardTitle
        href={`/projects/${project.slug}`}
        size={
          lead
            ? "text-2xl leading-tight tracking-tight sm:text-3xl"
            : "text-xl leading-snug tracking-tight sm:text-2xl sm:leading-snug"
        }
      >
        {project.name}
        <span className="sr-only"> write-up</span>
      </CardTitle>
      <CardMeta>
        Status: <span className="font-medium text-foreground">{project.status}</span>
      </CardMeta>
    </CardHeader>
  );

  const description = (
    <CardBody className={lead ? "mt-4" : "mt-3"}>
      <p className={lead ? "max-w-[58ch] text-lead text-foreground" : "text-base leading-relaxed text-foreground"}>
        {project.shortDescription}
      </p>
      {lead && (
        <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">Problem solved: </span>
          {project.problemSolved}
        </p>
      )}
      {project.statusNote && (
        <p className="mt-2 text-sm leading-relaxed text-muted">{project.statusNote}</p>
      )}
    </CardBody>
  );

  const stack = (
    <p className="font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.14em] text-muted">
      {project.technologies.slice(0, lead ? 5 : 4).join(" · ")}
    </p>
  );

  const footer = (
    <CardFooter className={lead ? "mt-5 sm:mt-0" : "mt-4"}>
      {/* Visible cue that the whole card opens the write-up. Not a second link:
          aria-hidden and pointer-transparent, so the stretched title link takes
          the click. */}
      <span aria-hidden="true" className={`${linkClass} cursor-pointer`}>
        View case study
        <ArrowRight
          size={15}
          className="transition-transform duration-300 ease-out group-hover:translate-x-1"
        />
      </span>
      {project.links.github && (
        <ExternalLink
          href={project.links.github}
          aria-label={`${project.name} source on GitHub, opens in a new tab`}
          className={linkClass}
        >
          Source
        </ExternalLink>
      )}
      {project.links.live && (
        <ExternalLink
          href={project.links.live}
          aria-label={`${liveLabel(project)} of ${project.name}, opens in a new tab`}
          className={linkClass}
        >
          {liveLabel(project)}
        </ExternalLink>
      )}
    </CardFooter>
  );

  return (
    <Card
      variant="interactive"
      featured={lead}
      flush
      data-project={project.slug}
      data-project-lead={lead ? "" : undefined}
    >
      <ProjectPreview project={project} lead={lead} />

      {lead ? (
        <div className="flex flex-1 flex-col gap-6 p-5 sm:p-7 lg:grid lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start lg:gap-10">
          <div>
            {identity}
            {description}
          </div>
          <div className="flex flex-col gap-4 lg:justify-between lg:self-stretch">
            {stack}
            {footer}
          </div>
        </div>
      ) : (
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          {identity}
          {description}
          <div className="mt-auto pt-5">
            {stack}
            {footer}
          </div>
        </div>
      )}
    </Card>
  );
}
