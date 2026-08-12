import { GithubIcon } from "@/components/icons/GithubIcon";
import { ArrowUpRight } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/data/site-config";
import { projects } from "@/data/projects";

export function GitHubActivity() {
  const repos = projects.filter((p) => p.links.github);

  return (
    <section id="github" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          path="github"
          title="On GitHub"
          description="A few repositories from my profile — check GitHub directly for the full picture."
        />

        <Card className="flex flex-wrap items-center justify-between gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface">
              <GithubIcon size={20} className="text-foreground" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">
                @{siteConfig.githubUsername}
              </p>
              <p className="text-xs text-muted">github.com/{siteConfig.githubUsername}</p>
            </div>
          </div>
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-foreground transition-colors hover:border-accent-violet/40"
          >
            View Full Profile
            <ArrowUpRight size={14} aria-hidden="true" />
          </a>
        </Card>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {repos.map((project) => (
            <a
              key={project.slug}
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card hoverLift className="h-full p-5">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-sm text-foreground">{project.name}</p>
                  <ArrowUpRight size={14} className="text-muted" aria-hidden="true" />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {project.shortDescription}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
