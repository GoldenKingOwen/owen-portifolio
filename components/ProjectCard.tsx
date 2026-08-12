import Link from "next/link";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { Card } from "@/components/ui/Card";
import { TechBadge } from "@/components/ui/Badge";
import { ProjectThumbnail } from "@/components/ui/ProjectThumbnail";
import { Project } from "@/types";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Card
      hoverLift
      className={
        project.featured
          ? "col-span-full flex flex-col gap-6 p-6 sm:flex-row sm:p-8 lg:col-span-2"
          : "flex flex-col gap-5 p-6"
      }
    >
      <div className={project.featured ? "sm:w-2/5" : ""}>
        <ProjectThumbnail name={project.name} />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold text-foreground">
            {project.name}
          </h3>
          <span className="whitespace-nowrap rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
            {project.status}
          </span>
        </div>

        <p className="mt-2 text-sm leading-relaxed text-muted">
          {project.shortDescription}
        </p>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          <span className="text-foreground">Problem solved: </span>
          {project.problemSolved}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.technologies.map((tech) => (
            <TechBadge key={tech} label={tech} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-violet hover:underline"
          >
            View Details
            <ArrowUpRight size={14} aria-hidden="true" />
          </Link>

          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              <GithubIcon size={14} aria-hidden="true" />
              Code
            </a>
          )}

          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </Card>
  );
}