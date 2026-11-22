"use client";

import { useEffect, useMemo, useState } from "react";
import type { Project } from "@/types";

const slug = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export function ProjectToc({ project }: { project: Project }) {
  const planning = project.status === "Planning";
  const items = useMemo(() => ["Overview", "Problem statement", "Goals and constraints", ...(project.detail.role ? ["My role and contributions"] : []), planning ? "Planned capabilities" : "Technical approach", planning ? "Planned architecture" : "Architecture", ...(project.detail.decisions?.length ? ["Implementation decisions"] : []), planning ? "Open design questions" : "Challenges", ...(project.detail.solutions.length ? ["Solutions"] : []), "Current status and limitations", ...(project.detail.lessons?.length ? ["Lessons learned"] : [])], [project]);
  const [active, setActive] = useState("overview");
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const headings = items.map((title) => document.getElementById(slug(title))).filter((item): item is HTMLElement => Boolean(item));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (visible) setActive(visible.target.id);
    }, { rootMargin: "-20% 0px -70% 0px" });
    headings.forEach((heading) => observer.observe(heading));
    const update = () => {
      const article = document.querySelector("article");
      if (!article) return;
      const rect = article.getBoundingClientRect();
      const total = article.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.max(0, Math.min(100, -rect.top / total * 100)) : 0);
    };
    update(); window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update);
    return () => { observer.disconnect(); window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, [items]);
  return <nav aria-label="On this page" className="h-fit lg:sticky lg:top-28">
    <p className="font-mono text-[0.625rem] uppercase tracking-widest text-muted">Contents</p>
    <div className="mt-2 h-1 w-full bg-border" role="progressbar" aria-label="Reading progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}><span className="block h-full bg-accent" style={{ width: `${progress}%` }} /></div>
    <ol className="mt-4 space-y-1 border-l border-border pl-3 text-xs">
      {items.map((title) => { const id = slug(title); return <li key={id}><a href={`#${id}`} aria-current={active === id ? "location" : undefined} className="block py-1 text-muted hover:text-foreground aria-[current=location]:text-accent">{title}</a></li>; })}
    </ol>
  </nav>;
}
