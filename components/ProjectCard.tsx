import type { ReactNode } from "react";
import Link from "next/link";
import { ExternalLink } from "@/components/ui/ExternalLink";
import type { Project } from "@/types";
import { cn } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent";

/**
 * A project entry. `lead` is the headline project (larger, with the full
 * problem statement); the rest are quieter ruled rows. Not a card: the
 * hairline above is the only container.
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
    <article
      data-project={project.slug}
      className={cn(!lead && "border-t border-border pt-6")}
    >
      <h3
        className={cn(
          "font-semibold text-foreground",
          lead ? "text-2xl leading-tight tracking-tight sm:text-4xl" : "text-lg leading-snug"
        )}
      >
        {project.name}
      </h3>
      {/* One meta line under every title, so status never depends on wrapping. */}
      <p className="mt-1 font-mono text-xs text-muted">{project.status}</p>

      <p className={cn("mt-3 max-w-[60ch] text-foreground", lead ? "text-lead" : "text-base")}>
        {project.shortDescription}
      </p>

      <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-muted">
        <span className="font-medium text-foreground">Problem solved: </span>
        {project.problemSolved}
      </p>

      <p className="mt-4 max-w-[60ch] text-sm leading-relaxed text-muted">
        {project.technologies.join(", ")}
      </p>

      {children && <div className="mt-6 max-w-[65ch]">{children}</div>}

      <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
        <Link href={`/projects/${project.slug}`} className={linkClass}>
          Read the {project.name} write-up
        </Link>
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
      </div>
    </article>
  );
}
