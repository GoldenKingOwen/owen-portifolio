import Image from "next/image";
import { ProjectBlueprint } from "@/components/ProjectBlueprint";
import type { Project } from "@/types";

/**
 * The case-study hero plate. It shares its `view-transition-name` with the
 * project plate on the home stack, so View Transitions can carry the same
 * object from one page to the other instead of cutting.
 *
 * A project without a verified screenshot gets the same labelled blueprint
 * used on the home page, never a fabricated interface.
 */
export function ProjectHeroMedia({ project }: { project: Project }) {
  const liveHost = project.links.live
    ? project.links.live.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : project.status === "Planning"
      ? "preview build"
      : "internal preview";

  return (
    <figure className="mt-10">
      <div
        data-vt-media=""
        className="project-media-frame rounded-ui"
        style={{ viewTransitionName: `project-media-${project.slug}` }}
      >
        <div className="project-media-bar" aria-hidden="true">
          <span className="project-media-dots">
            <i /><i /><i />
          </span>
          <span className="project-media-url">{liveHost}</span>
          <span className="project-media-url ml-auto normal-case tracking-normal">
            {project.status}
          </span>
        </div>
        <div className="relative aspect-[16/9] overflow-hidden border-t border-border bg-panel">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.imageAlt ?? ""}
              fill
              priority
              sizes="(min-width: 1024px) 960px, 100vw"
              quality={80}
              className="object-cover object-top"
            />
          ) : (
            <ProjectBlueprint slug={project.slug} />
          )}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
        </div>
      </div>
      <figcaption className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
        <span>{project.image ? "Project screenshot" : "Generated blueprint — no screenshot available"}</span>
        {project.previewNote && <span>{project.previewNote}</span>}
      </figcaption>
    </figure>
  );
}
