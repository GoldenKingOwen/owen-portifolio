import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ProjectMedia } from "@/components/ProjectMedia";
import type { Project, ProjectStatus } from "@/types";

const STATUS_TONE: Record<ProjectStatus, string> = {
  Live: "live",
  "In Development": "active",
  Planning: "planned",
  Completed: "active",
  Academic: "planned",
};

function StatusPill({ status }: { status: ProjectStatus }) {
  return (
    <span className="status-pill" data-status={STATUS_TONE[status]}>
      <span aria-hidden="true" className="status-pill-dot" />
      {status}
    </span>
  );
}

function liveLabel(project: Project) {
  return project.status === "Planning" ? "Preview site" : "Live site";
}

/**
 * One project sheet in the desktop stack. Everything except the media is plain
 * server-rendered text; the media is a browser frame around a real screenshot or
 * original blueprint art. Links are separate tab stops and never nested.
 */
export function ProjectPanel({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const number = String(index + 1).padStart(2, "0");

  return (
    <article
      data-project-panel=""
      data-project={project.slug}
      aria-labelledby={`project-${project.slug}-title`}
      className="project-panel rounded-ui border border-border bg-background p-5 shadow-[0_24px_60px_-50px_rgba(0,0,0,.5)] sm:p-7 lg:p-8"
    >
      <div className="grid gap-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,21rem)] lg:items-start lg:gap-10">
        <div className="flex min-w-0 flex-col">
          <div className="flex items-start justify-between gap-4">
            <span
              aria-hidden="true"
              className="project-index font-display text-[clamp(3.25rem,7vw,6rem)] leading-[0.8] tracking-tight text-foreground/15"
            >
              {number}
            </span>
            <StatusPill status={project.status} />
          </div>
          <span className="sr-only">
            Project {number} of {String(total).padStart(2, "0")}.
          </span>

          <h3
            id={`project-${project.slug}-title`}
            className="mt-3 text-balance font-display text-[clamp(1.75rem,3.4vw,2.75rem)] font-semibold leading-[1.05] tracking-tight text-foreground"
          >
            <Link
              href={`/projects/${project.slug}`}
              className="underline decoration-border decoration-2 underline-offset-[6px] transition-colors hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            >
              {project.name}
            </Link>
          </h3>

          <p className="mt-4 max-w-[52ch] text-base leading-relaxed text-foreground">
            {project.problemSolved}
          </p>
          {project.statusNote && (
            <p className="mt-2 max-w-[52ch] text-sm leading-relaxed text-muted">
              {project.statusNote}
            </p>
          )}

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project.technologies.slice(0, 7).map((tech) => (
              <li
                key={tech}
                className="rounded-ui border border-border px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href={`/projects/${project.slug}`}
              className="group inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent"
            >
              Case study
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="transition-transform duration-300 ease-out group-hover:translate-x-1"
              />
            </Link>
            {project.links.live && (
              <ExternalLink
                href={project.links.live}
                aria-label={`${liveLabel(project)}: ${project.name}, opens in a new tab`}
                className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent"
              >
                {liveLabel(project)}
              </ExternalLink>
            )}
            {project.links.github && (
              <ExternalLink
                href={project.links.github}
                aria-label={`${project.name} source on GitHub, opens in a new tab`}
                className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent"
              >
                Source
              </ExternalLink>
            )}
          </div>

          {index === 0 && (
            <a
              href="#request-journey"
              className="mt-4 inline-flex min-h-11 w-fit items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-accent underline-offset-4 hover:underline"
            >
              <span aria-hidden="true">↳</span> Trace a request through the system
            </a>
          )}
        </div>

        <ProjectMedia project={project} />
      </div>
    </article>
  );
}
