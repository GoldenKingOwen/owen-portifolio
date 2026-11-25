import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { projects } from "@/data/projects";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/data/site-config";
import { projectJsonLd } from "@/lib/structured-data";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { ProjectToc } from "@/components/ProjectToc";
import { ProjectHeroMedia } from "@/components/ProjectHeroMedia";
import { DecisionNotes, ProblemCallout } from "@/components/DecisionNotes";
import type { Project } from "@/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

function truncate(text: string, max: number) {
  return text.length <= max ? text : `${text.slice(0, max - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return { title: "Project Not Found", robots: { index: false } };

  const title = `${project.name} — ${project.technologies.slice(0, 3).join(", ")} project`;
  const description = truncate(`${project.shortDescription} ${project.detail.overview}`, 158);
  const path = `/projects/${project.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "article",
      url: path,
      title: `${project.name} | ${siteConfig.name}`,
      description,
      siteName: `${siteConfig.name} — Portfolio`,
      authors: [siteConfig.name],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.name} | ${siteConfig.name}`,
      description,
    },
  };
}

const linkClass =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent";

function Prose({ title, children }: { title: string; children: React.ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <section id={id} data-block data-reveal="" className="scroll-mt-28 border-t border-border pt-7">
      <h2 className="font-display text-[clamp(1.5rem,2.6vw,2rem)] font-semibold leading-tight tracking-tight text-foreground">
        {title}
      </h2>
      <div className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground">{children}</div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 marker:text-muted">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function NextProjectBand({ project }: { project: Project }) {
  return (
    <nav aria-label="Next project" className="mt-20 border-t border-border">
      <Link
        href={`/projects/${project.slug}`}
        data-reveal=""
        className="next-project group relative block overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-accent"
      >
        <span aria-hidden="true" className="next-project-wipe" />
        <div className="relative mx-auto flex max-w-6xl flex-col gap-4 px-4 py-12 sm:px-6 sm:py-16 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0">
            <span className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              Next project · {project.status}
            </span>
            <span className="mt-3 block text-balance font-display text-[clamp(2.25rem,6vw,5rem)] font-semibold leading-[0.95] tracking-[-0.04em] text-foreground">
              {project.name}
            </span>
          </div>
          <span
            aria-hidden="true"
            className="next-project-arrow inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-border text-foreground"
          >
            <ArrowRight size={20} />
          </span>
        </div>
      </Link>
    </nav>
  );
}

export default async function ProjectPage({
  params,
}: {
  // Next.js 16: params is a Promise that must be awaited.
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  const { detail } = project;
  const isPlanning = project.status === "Planning";
  // A deployed preview is not a shipped product: label the link honestly.
  const liveLabel = isPlanning ? "Preview" : "Live demo";
  const statusDot =
    project.status === "Live" ? "bg-success" : isPlanning ? "bg-muted" : "bg-sun";
  const related = projects.filter((p) => p.slug !== project.slug).slice(0, 2);
  const projectOrder = ["tenant-feedback-portal", "chess-practice", "cyber-awareness", "world-scope"];
  const projectIndex = projectOrder.indexOf(project.slug);
  const nextProject = projects.find((item) => item.slug === projectOrder[(projectIndex + 1) % projectOrder.length]);

  return (
    <article data-case-study="" data-view-target={project.slug} className="pb-0 pt-28 sm:pt-32">
      <JsonLd data={projectJsonLd(project)} />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Link
          href="/#projects"
          data-page-head=""
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          All projects
        </Link>

        <header className="mt-5">
          <p data-page-head="" className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
            Case study · {project.status}
          </p>
          {/* The title is the largest-contentful paint: it is never hidden
              behind the motion gate, so it paints with the server HTML. */}
          <h1 className="mt-4 max-w-[18ch] text-balance font-display text-[clamp(2.75rem,8vw,6.5rem)] font-semibold leading-[0.92] tracking-[-0.045em] text-foreground [overflow-wrap:anywhere]">
            {project.name}
          </h1>
          <p data-page-head="" className="mt-6 max-w-[62ch] text-lead text-muted">
            {project.shortDescription}
          </p>
          {project.statusNote && (
            <p data-page-head="" className="mt-2 max-w-[62ch] text-sm text-muted">
              {project.statusNote}
            </p>
          )}

          <dl
            data-page-head=""
            className="mt-8 grid gap-x-8 gap-y-5 border-y border-border py-5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,0.7fr)_minmax(0,0.9fr)_minmax(0,1.3fr)]"
          >
            {detail.role && (
              <div>
                <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Role</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-foreground">{detail.role}</dd>
              </div>
            )}
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Status</dt>
              <dd className="mt-1.5 flex items-center gap-2 text-sm text-foreground">
                <span aria-hidden="true" className={`h-1.5 w-1.5 shrink-0 rounded-full ${statusDot}`} />
                {project.status}
              </dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Timeline</dt>
              {/* TODO(owen): add a verified project timeline (start/end or duration) to
                  data/projects.ts. The page deliberately does not invent dates. */}
              <dd className="mt-1.5 text-sm text-muted">Not yet documented</dd>
            </div>
            <div>
              <dt className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Stack</dt>
              <dd className="mt-1.5 text-sm leading-relaxed text-foreground">
                {project.technologies.join(", ")}
              </dd>
            </div>
          </dl>

          {(project.links.github || project.links.live) && (
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
              {project.links.github && (
                <ExternalLink
                  href={project.links.github}
                  aria-label={`${project.name} source on GitHub, opens in a new tab`}
                  className={linkClass}
                >
                  Source on GitHub
                </ExternalLink>
              )}
              {project.links.live && (
                <ExternalLink
                  href={project.links.live}
                  aria-label={`${liveLabel} of ${project.name}, opens in a new tab`}
                  className={linkClass}
                >
                  {liveLabel}
                </ExternalLink>
              )}
            </div>
          )}
        </header>

        <ProjectHeroMedia project={project} />

        <div className="mt-14 grid gap-8 lg:grid-cols-[12rem_minmax(0,1fr)] xl:grid-cols-[12rem_minmax(0,1fr)_13rem]">
          <ProjectToc project={project} />
          <div className="space-y-10">
            <Prose title="Overview">
              <p>{detail.overview}</p>
            </Prose>
            <Prose title="Problem statement">
              <ProblemCallout>{detail.problemStatement}</ProblemCallout>
            </Prose>
            <Prose title="Goals and constraints">
              <p className="font-medium text-foreground">Goals</p>
              <List items={detail.objectives} />
              {detail.constraints && detail.constraints.length > 0 && (
                <>
                  <p className="mt-4 font-medium text-foreground">Constraints</p>
                  <List items={detail.constraints} />
                </>
              )}
            </Prose>
            {detail.role && (
              <Prose title="My role and contributions">
                <p>{detail.role}</p>
              </Prose>
            )}
            <Prose title={isPlanning ? "Planned capabilities" : "Technical approach"}>
              {isPlanning && (
                <p className="mb-3 text-sm text-muted">
                  Designed capabilities, not implemented features.
                </p>
              )}
              <List items={detail.features} />
            </Prose>
            <Prose title={isPlanning ? "Planned architecture" : "Architecture"}>
              {project.slug === "tenant-feedback-portal" && <ArchitectureDiagram />}
              <p>{detail.architecture}</p>
              {project.plannedStack && (
                <>
                  <p className="mt-6 font-medium text-foreground">Planned technology stack</p>
                  <p className="mt-1 text-sm text-muted">
                    Documented architecture choices for the build; not all of this is in use yet.
                  </p>
                  <dl className="mt-4 border-t border-border text-sm">
                    {project.plannedStack.map((row) => (
                      <div
                        key={row.layer}
                        className="grid grid-cols-1 gap-1 border-b border-border py-2.5 sm:grid-cols-[11rem_1fr] sm:gap-4"
                      >
                        <dt className="text-muted">{row.layer}</dt>
                        <dd className="text-foreground">{row.technology}</dd>
                      </div>
                    ))}
                  </dl>
                </>
              )}
            </Prose>
            {project.roadmap && (
              <Prose title="Planned roadmap">
                <p className="mb-3 text-sm text-muted">
                  The documented phase plan. Nothing in it is completed work.
                </p>
                <List items={project.roadmap} />
              </Prose>
            )}
            {detail.decisions && detail.decisions.length > 0 && (
              <Prose title="Implementation decisions">
                <DecisionNotes decisions={detail.decisions} />
              </Prose>
            )}
            <Prose title={isPlanning ? "Open design questions" : "Challenges"}>
              <List items={detail.challenges} />
            </Prose>
            {detail.solutions.length > 0 && (
              <Prose title="Solutions">
                <List items={detail.solutions} />
              </Prose>
            )}
            <Prose title="Current status and limitations">
              <p>
                <span className="font-medium text-foreground">Status:</span> {project.status}.
                {detail.limitations ? ` ${detail.limitations}` : ""}
              </p>
            </Prose>
            {detail.lessons && detail.lessons.length > 0 && (
              <Prose title="Lessons learned">
                <List items={detail.lessons} />
              </Prose>
            )}
          </div>

          <aside aria-label="Project facts" className="hidden xl:sticky xl:top-28 xl:block xl:self-start">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Project facts</p>
            <dl className="mt-3 border-t border-border text-sm">
              <div className="border-b border-border py-3">
                <dt className="text-muted">Status</dt>
                <dd className="mt-1 text-foreground">{project.status}</dd>
              </div>
              <div className="border-b border-border py-3">
                <dt className="text-muted">{isPlanning ? "Seen in the preview" : "Built with"}</dt>
                <dd className="mt-1 text-sm leading-relaxed text-foreground">
                  {project.technologies.join(", ")}
                </dd>
              </div>
              <div className="border-b border-border py-3">
                <dt className="text-muted">Links</dt>
                <dd className="mt-1 flex flex-col">
                  {project.links.github && (
                    <ExternalLink
                      href={project.links.github}
                      aria-label={`${project.name} source on GitHub, opens in a new tab`}
                      className={linkClass}
                    >
                      Source on GitHub
                    </ExternalLink>
                  )}
                  {project.links.live && (
                    <ExternalLink
                      href={project.links.live}
                      aria-label={`${liveLabel} of ${project.name}, opens in a new tab`}
                      className={linkClass}
                    >
                      {liveLabel}
                    </ExternalLink>
                  )}
                </dd>
              </div>
            </dl>
          </aside>
        </div>

        <nav aria-labelledby="related-projects-heading" className="mt-16 border-t border-border pt-8">
          <h2 id="related-projects-heading" className="text-lg font-semibold text-foreground">
            Related projects
          </h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {related.map((item) => (
              <li key={item.slug}>
                <Link
                  href={`/projects/${item.slug}`}
                  className="flex min-h-14 flex-col justify-center rounded-ui border border-border px-4 py-3 transition-colors hover:border-field hover:bg-raised"
                >
                  <span className="text-sm font-medium text-foreground">{item.name}</span>
                  <span className="mt-1 font-mono text-xs text-muted">{item.status}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#projects"
            className="mt-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Back to all projects
          </Link>
        </nav>
      </div>

      {nextProject && <NextProjectBand project={nextProject} />}
    </article>
  );
}
