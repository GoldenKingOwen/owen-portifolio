import Image from "next/image";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";
import type { Project } from "@/types";

/**
 * The dominant half of a project card.
 *
 * A real screenshot is used wherever the project has one, at a single crop
 * (16/10, 16/9 for the lead card) so the collection reads as one set. Projects
 * without a genuine interface get an art-directed plate built from their own
 * name, status and stack — never an invented dashboard or stock photograph.
 *
 * Server component: the imagery is in the HTML, and the hover treatment is CSS.
 */
export function ProjectPreview({ project, lead = false }: { project: Project; lead?: boolean }) {
  const index = String(projects.findIndex((p) => p.slug === project.slug) + 1).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative overflow-hidden border-b border-border bg-panel",
        lead ? "aspect-[16/9]" : "aspect-[16/10]"
      )}
    >
      {project.image ? (
        <>
          <Image
            src={project.image}
            alt={project.imageAlt ?? ""}
            fill
            sizes={lead ? "(min-width: 1024px) 960px, 100vw" : "(min-width: 768px) 470px, 100vw"}
            className="media-shot object-cover object-top"
          />
          {/* A single light pass on hover. Nothing sits over the screenshot that
              would soften its colours or make its interface unreadable. */}
          <div aria-hidden="true" className="media-sheen absolute inset-0" />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10"
          />
        </>
      ) : (
        <BrandedPlate project={project} index={index} lead={lead} />
      )}

      {project.previewNote && (
        <span className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-ui bg-panel/85 px-2 py-1 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-panel-ink backdrop-blur-[2px]">
          <span aria-hidden="true" className="h-1 w-1 rounded-full bg-panel-accent" />
          {project.previewNote}
        </span>
      )}
    </div>
  );
}

/**
 * The plate for projects whose repository has no representative screen yet.
 * Typography, a hairline grid and registration marks only — it reads as a
 * designed cover for the project, not as a screenshot of something that does
 * not exist.
 */
function BrandedPlate({ project, index, lead }: { project: Project; index: string; lead: boolean }) {
  const title = project.previewTitle ?? project.name;

  return (
    <div className="absolute inset-0 flex flex-col justify-between p-5 text-panel-ink sm:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          maskImage: "radial-gradient(120% 100% at 15% 100%, #000 20%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(120% 100% at 15% 100%, #000 20%, transparent 78%)",
        }}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(70% 90% at 88% 8%, color-mix(in oklch, var(--panel-accent) 22%, transparent), transparent 62%)",
        }}
      />

      {/* Registration marks: the design-canvas language, kept to four corners. */}
      {[
        "left-3 top-3 border-l border-t",
        "right-3 top-3 border-r border-t",
        "left-3 bottom-3 border-b border-l",
        "right-3 bottom-3 border-b border-r",
      ].map((pos) => (
        <span
          key={pos}
          aria-hidden="true"
          className={cn("pointer-events-none absolute h-3 w-3 border-panel-ink/35", pos)}
        />
      ))}

      <div className="relative flex items-start justify-between gap-4 font-mono text-[0.625rem] uppercase tracking-[0.2em] text-panel-ink/65">
        <span className="tabular">{index} / {String(projects.length).padStart(2, "0")}</span>
        <span className="text-panel-accent">{project.status}</span>
      </div>

      <div className="relative max-w-[26ch]">
        <span aria-hidden="true" className="block h-0.5 w-8 bg-panel-accent" />
        <p
          className={cn(
            "mt-3 font-semibold leading-tight tracking-tight text-panel-ink",
            lead ? "text-2xl sm:text-4xl" : "text-xl sm:text-2xl"
          )}
        >
          {title}
        </p>
        <p className="mt-3 font-mono text-[0.625rem] uppercase leading-relaxed tracking-[0.16em] text-panel-ink/60">
          {project.technologies.slice(0, 3).join(" / ")}
        </p>
      </div>
    </div>
  );
}
