"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Project, SkillCategory } from "@/types";

const SkillConstellationGraph = dynamic(
  () => import("@/components/SkillConstellationGraph"),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-[19/13.5] w-full rounded-ui border border-border bg-panel" aria-hidden="true" />
    ),
  },
);

type View = "graph" | "list";

/**
 * Graph/list shell. The list is the server-rendered default and stays in the
 * document in both views, so the content is never graph-only. The force layout
 * lives in a separate chunk that is fetched only when the section approaches
 * the viewport, and the graph is offered only where it is readable (768px+,
 * motion allowed, no Save-Data).
 */
export function SkillConstellation({
  list,
  skills,
  projects,
}: {
  list: ReactNode;
  skills: SkillCategory[];
  projects: Project[];
}) {
  const container = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>("list");
  const [chosen, setChosen] = useState(false);
  const [near, setNear] = useState(false);
  const [graphAvailable, setGraphAvailable] = useState(false);

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = Boolean(
      (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData,
    );

    const choose = () => {
      const allowed = wide.matches && !reduce.matches && !saveData;
      setGraphAvailable(allowed);
      if (!allowed) setView("list");
      else if (!chosen) setView("graph");
    };

    choose();
    wide.addEventListener("change", choose);
    reduce.addEventListener("change", choose);
    return () => {
      wide.removeEventListener("change", choose);
      reduce.removeEventListener("change", choose);
    };
  }, [chosen]);

  useEffect(() => {
    const node = container.current;
    if (!node || near) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setNear(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [near]);

  const showGraph = view === "graph" && graphAvailable;

  return (
    <div ref={container}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">
          Self-rated, strongest first: Comfortable, Intermediate, Familiar, Learning.
        </p>
        <div
          className="inline-flex rounded-ui border border-border p-1"
          role="group"
          aria-label="Skills view"
        >
          {graphAvailable && (
            <button
              type="button"
              aria-pressed={showGraph}
              onClick={() => {
                setChosen(true);
                setView("graph");
              }}
              className="min-h-9 rounded-ui px-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-raised aria-pressed:bg-raised"
            >
              Graph
            </button>
          )}
          <button
            type="button"
            aria-pressed={!showGraph}
            onClick={() => {
              setChosen(true);
              setView("list");
            }}
            className="min-h-9 rounded-ui px-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-raised aria-pressed:bg-raised"
          >
            List
          </button>
        </div>
      </div>

      {/* Visually hidden — never removed — while the graph is on screen. */}
      <div className={showGraph ? "sr-only" : undefined}>{list}</div>

      {showGraph && (
        <div className="hidden md:block">
          {near ? (
            <SkillConstellationGraph skills={skills} projects={projects} />
          ) : (
            <p className="text-sm text-muted">Preparing the constellation…</p>
          )}
        </div>
      )}
    </div>
  );
}
