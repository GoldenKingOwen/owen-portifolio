import type { ReactNode } from "react";
import Image from "next/image";
import { Card, CardBody, CardFooter, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Project } from "@/types";

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4";

/**
 * A project card. The title is the card's one internal link (the write-up); source
 * and live links sit in the footer as separate, named links. `lead` makes it the
 * featured card; `children` render inside the body (the lead carries the
 * architecture diagram). Real imagery only: a project without a real image shows
 * none, never a placeholder. On hover the image scales to 1.04 inside its frame
 * (transform only; the card itself does not move).
 */
export function ProjectCard({
  project,
  lead = false,
  children,
}: {
  project: Project;
  lead?: boolean;
  children?: ReactNode;
}) {
  return (
    <Card variant="interactive" featured={lead} data-project={project.slug}>
      {project.image && (
        <div className="relative mb-5 aspect-[16/10] overflow-hidden rounded-ui border border-border bg-background">
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
            fill
            sizes="(min-width: 1024px) 340px, (min-width: 768px) 45vw, 100vw"
            quality={75}
            className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        </div>
      )}

      <CardHeader>
        <CardTitle href={`/projects/${project.slug}`} featured={lead}>
          {project.name}
          <span className="sr-only"> write-up</span>
        </CardTitle>
        {/* One meta line under every title, so status never depends on wrapping. */}
        <CardMeta>{project.status}</CardMeta>
      </CardHeader>

      <CardBody>
        <p className={lead ? "max-w-[60ch] text-lead text-foreground" : "text-base text-foreground"}>
          {project.shortDescription}
        </p>

        <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted">
          <span className="font-medium text-foreground">Problem solved: </span>
          {project.problemSolved}
        </p>

        <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
          {project.technologies.join(", ")}
        </p>

        {children && <div className="mt-6 max-w-[65ch] [&_figure]:mb-0">{children}</div>}
      </CardBody>

      <CardFooter>
        {/* Visible cue that the whole card opens the write-up. Not a second link:
            aria-hidden, and it ignores the pointer so the stretched title link takes the click. */}
        <span aria-hidden="true" className={`${linkClass} cursor-pointer`}>
          Read the write-up
        </span>
        {project.links.github && (
          <ExternalLink href={project.links.github} className={linkClass}>
            {project.name} source on GitHub
          </ExternalLink>
        )}
        {project.links.live && (
          <ExternalLink href={project.links.live} className={linkClass}>
            Open {project.name} live
          </ExternalLink>
        )}
      </CardFooter>
    </Card>
  );
}
