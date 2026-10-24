import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { JsonLd } from "@/components/JsonLd";
import { siteConfig } from "@/data/site-config";
import { projectJsonLd } from "@/lib/structured-data";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { ExternalLink } from "@/components/ui/ExternalLink";

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
  return (
    <section data-block data-reveal="" className="border-t border-border pt-6">
      <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      <div className="mt-3 max-w-[65ch] text-base leading-relaxed text-foreground">{children}</div>
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

  return (
    <article className="pb-16 pt-28 sm:pb-24 sm:pt-32">
      <JsonLd data={projectJsonLd(project)} />
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <Link
          href="/#projects"
          className="inline-flex min-h-11 items-center gap-1.5 text-sm text-muted hover:text-foreground"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          All projects
        </Link>

        <header className="mt-4 max-w-3xl">
          <h1 className="text-h2 font-semibold text-foreground sm:text-4xl sm:leading-tight">
            {project.name}
          </h1>
          <p className="mt-4 max-w-[60ch] text-lead text-muted">{project.shortDescription}</p>
        </header>

        <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_15rem]">
          <div className="space-y-10">
            <Prose title="Overview">
              <p>{detail.overview}</p>
            </Prose>
            <Prose title="Problem statement">
              <p>{detail.problemStatement}</p>
            </Prose>
            <Prose title="Objectives">
              <List items={detail.objectives} />
            </Prose>
            <Prose title="Key features">
              <List items={detail.features} />
            </Prose>
            <Prose title="Architecture">
              {project.slug === "tenant-feedback-portal" && <ArchitectureDiagram />}
              <p>{detail.architecture}</p>
            </Prose>
            <Prose title="Challenges">
              <List items={detail.challenges} />
            </Prose>
            <Prose title="Solutions">
              <List items={detail.solutions} />
            </Prose>
          </div>

          <aside aria-label="Project facts" className="lg:sticky lg:top-24 lg:self-start">
            <dl className="border-t border-border text-sm">
              <div className="border-b border-border py-3">
                <dt className="text-muted">Status</dt>
                <dd className="mt-1 text-foreground">{project.status}</dd>
              </div>
              <div className="border-b border-border py-3">
                <dt className="text-muted">Built with</dt>
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
                      aria-label={`Open ${project.name} live, opens in a new tab`}
                      className={linkClass}
                    >
                      Live demo
                    </ExternalLink>
                  )}
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </div>
    </article>
  );
}
