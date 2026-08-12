import { notFound } from "next/navigation";
import { projects } from "@/data/projects";
import { Card } from "@/components/ui/Card";
import { ExternalLink, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import Link from "next/link";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted hover:text-foreground"
        >
          <ArrowUpRight size={14} className="-rotate-90" aria-hidden="true" />
          Back to Projects
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-3xl font-semibold text-foreground">{project.name}</h1>
              <p className="mt-2 text-base text-muted">{project.shortDescription}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-muted"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground"
                >
                  <GithubIcon size={14} aria-hidden="true" />
                  View Code
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

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Overview</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.detail.overview}</p>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Problem Statement</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.detail.problemStatement}</p>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Objectives</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {project.detail.objectives.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Key Features</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {project.detail.features.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Architecture</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.detail.architecture}</p>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Challenges</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {project.detail.challenges.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>

            <Card className="p-6">
              <h2 className="font-display text-lg font-semibold text-foreground">Solutions</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
                {project.detail.solutions.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
