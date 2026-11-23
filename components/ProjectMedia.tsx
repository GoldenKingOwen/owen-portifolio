import Image from "next/image";
import { ProjectBlueprint } from "@/components/ProjectBlueprint";
import { ViewTransitionLink } from "@/components/ViewTransitionLink";
import type { Project } from "@/types";

/**
 * Media plate for a project panel: a browser frame around a real screenshot, or
 * original blueprint art built from the project's own architecture when no
 * screenshot exists. Nothing here pretends to be a live interface.
 *
 * The frame carries the shared view-transition-name; the case-study hero uses
 * the same name so the plate can morph into it.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const liveHost = project.links.live
    ? project.links.live.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : project.status === "Planning"
      ? "preview build"
      : "internal preview";

  return (
    <ViewTransitionLink
      href={`/projects/${project.slug}`}
      data-cursor="media"
      aria-label={`View the ${project.name} case study`}
      className="group/media block rounded-ui focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div
        className="project-media-frame"
        style={{ viewTransitionName: `project-media-${project.slug}` }}
      >
        <div className="project-media-bar" aria-hidden="true">
          <span className="project-media-dots">
            <i /><i /><i />
          </span>
          <span className="project-media-url">{liveHost}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden border-t border-border bg-panel">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.imageAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover/media:scale-[1.02]"
            />
          ) : (
            <ProjectBlueprint slug={project.slug} />
          )}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
        </div>
      </div>
      {project.previewNote && (
        <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          {project.previewNote}
        </span>
      )}
    </ViewTransitionLink>
  );
}
