"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types";

const slug = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Sticky table of contents for a case study: scrollspy on the section headings
 * plus a real reading-progress bar. Both read the document directly, so the
 * whole contents list is server-rendered and works before hydration (the
 * in-page anchors are plain links).
 */
export function ProjectToc({ project }: { project: Project }) {
  const planning = project.status === "Planning";
  const items = useMemo(
    () => [
      "Overview",
      "Problem statement",
      "Goals and constraints",
      ...(project.detail.role ? ["My role and contributions"] : []),
      planning ? "Planned capabilities" : "Technical approach",
      planning ? "Planned architecture" : "Architecture",
      ...(project.detail.decisions?.length ? ["Implementation decisions"] : []),
      planning ? "Open design questions" : "Challenges",
      ...(project.detail.solutions.length ? ["Solutions"] : []),
      "Current status and limitations",
      ...(project.detail.lessons?.length ? ["Lessons learned"] : []),
    ],
    [project, planning],
  );

  const [active, setActive] = useState("overview");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const headings = items
      .map((title) => document.getElementById(slug(title)))
      .filter((item): item is HTMLElement => Boolean(item));
    const article = document.querySelector<HTMLElement>("[data-case-study]");
    if (!headings.length) return;

    // The heading that owns the reading position is the last one whose top has
    // passed just under the sticky header. Comparing positions (rather than
    // observing intersections) keeps the highlight correct after anchor jumps
    // and in short final sections.
    const offset = 148;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = headings[0].id;
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top <= offset) current = heading.id;
        else break;
      }

      if (article) {
        const rect = article.getBoundingClientRect();
        const total = article.scrollHeight - window.innerHeight;
        setProgress(total > 0 ? Math.max(0, Math.min(100, (-rect.top / total) * 100)) : 0);
        if (rect.bottom <= window.innerHeight + 8) current = headings[headings.length - 1].id;
      }

      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("hashchange", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("hashchange", onScroll);
    };
  }, [items]);

  const percent = Math.round(progress);

  return (
    <nav aria-label="On this page" className="h-fit lg:sticky lg:top-28">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">Contents</p>
        <p className="font-mono text-[0.625rem] tabular text-muted" aria-hidden="true">
          {String(percent).padStart(2, "0")}%
        </p>
      </div>
      <div
        className="mt-2 h-0.5 w-full overflow-hidden bg-border"
        role="progressbar"
        aria-label="Reading progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        aria-valuetext={`${percent}% read`}
      >
        <span
          className="block h-full bg-gradient-to-r from-sun to-coral transition-[width] duration-150 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
      <ol className="mt-5 border-l border-border">
        {items.map((title) => {
          const id = slug(title);
          const isActive = active === id;
          return (
            <li key={id}>
              <a
                href={`#${id}`}
                aria-current={isActive ? "location" : undefined}
                data-toc-link=""
                data-active={isActive}
                className="group/toc relative -ml-px flex min-h-9 items-center gap-2 border-l border-transparent py-1.5 pl-3 pr-1 text-xs text-muted transition-colors hover:text-foreground data-[active=true]:border-accent data-[active=true]:text-foreground"
              >
                <span
                  aria-hidden="true"
                  className="h-1 w-1 shrink-0 rounded-full bg-muted transition-colors group-data-[active=true]/toc:bg-sun"
                />
                {title}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
