"use client";

import { useEffect, useState } from "react";
import { forceCollide, forceLink, forceManyBody, forceSimulation, forceX, forceY } from "d3-force";
import type { SkillCategory, Project, SkillLevel } from "@/types";

type Node = { id: string; label: string; kind: "person" | "category" | "skill" | "project"; level?: SkillLevel; category?: string; tech?: string[]; x?: number; y?: number };
type Edge = { source: string; target: string };
const categoryName = (name: string) => name === "Programming Languages" ? "Languages" : name === "Mobile Development" ? "Mobile" : name === "Messaging & Infrastructure" ? "Infrastructure" : name;
const nodeData = (skills: SkillCategory[], projects: Project[]) => {
  const categories = ["Languages", "Frontend", "Backend", "Database", "Infrastructure", "Mobile", "Security"];
  const nodes: Node[] = [{ id: "owen", label: "Owen", kind: "person", x: 380, y: 260 }];
  const edges: Edge[] = [];
  categories.forEach((name) => { nodes.push({ id: `cat:${name}`, label: name, kind: "category", x: 380 + Math.cos(categories.indexOf(name) / categories.length * Math.PI * 2) * 175, y: 260 + Math.sin(categories.indexOf(name) / categories.length * Math.PI * 2) * 145 }); edges.push({ source: "owen", target: `cat:${name}` }); });
  skills.forEach((group) => {
    const category = categoryName(group.category);
    group.skills.forEach((skill) => { const id = `skill:${category}:${skill.name}`; nodes.push({ id, label: skill.name, kind: "skill", level: skill.level, category }); edges.push({ source: `cat:${category}`, target: id }); });
  });
  projects.forEach((project, index) => {
    const id = `project:${project.slug}`;
    nodes.push({ id, label: project.name, kind: "project", tech: project.technologies, x: index % 2 ? 720 : 40, y: 100 + index * 95 });
    project.technologies.forEach((tech) => { const skill = nodes.find((node) => node.kind === "skill" && node.label.toLowerCase() === tech.toLowerCase()); if (skill) edges.push({ source: id, target: skill.id }); });
  });
  const simulation = forceSimulation(nodes).force("charge", forceManyBody().strength(-32)).force("link", forceLink(edges).id((node) => (node as Node).id).distance((edge) => (edge as unknown as Edge).source.toString().startsWith("project:") ? 55 : 42).strength(0.65)).force("x", forceX(380).strength(0.03)).force("y", forceY(260).strength(0.04)).force("collision", forceCollide(26)).stop();
  simulation.tick(160);
  return { nodes, edges };
};

const radius = (level?: SkillLevel) => level === "Comfortable" ? 5 : level === "Intermediate" ? 4 : level === "Familiar" ? 3 : 2;

export function SkillConstellation({ skills, projects }: { skills: SkillCategory[]; projects: Project[] }) {
  const [{ nodes, edges }] = useState(() => nodeData(skills, projects));
  const [mode, setMode] = useState<"list" | "graph">("list");
  const [selected, setSelected] = useState<string | null>(null);
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 768px)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const choose = () => setMode(wide.matches && !reduce.matches && !saveData ? "graph" : "list");
    choose(); wide.addEventListener("change", choose); reduce.addEventListener("change", choose);
    return () => { wide.removeEventListener("change", choose); reduce.removeEventListener("change", choose); };
  }, []);
  const focusIds = new Set(selected ? [selected, ...edges.filter((edge) => edge.source === selected || edge.target === selected).map((edge) => edge.source === selected ? edge.target : edge.source)] : []);
  const active = (id: string) => !selected || focusIds.has(id);

  return <div>
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-muted">Self-rated, strongest first: Comfortable, Intermediate, Familiar, Learning.</p>
      <div className="inline-flex rounded-ui border border-border p-1" role="group" aria-label="Skills view">
        {(["graph", "list"] as const).map((view) => <button key={view} type="button" aria-pressed={mode === view} onClick={() => setMode(view)} className="min-h-9 rounded-ui px-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-raised">{view}</button>)}
      </div>
    </div>
    <div className={mode === "graph" ? "hidden md:block" : "block"} aria-hidden={mode === "graph"}>
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => <section key={group.category} className="rounded-ui border border-border bg-panel p-5">
          <h3 className="font-semibold text-foreground">{group.category}</h3><dl className="mt-3 divide-y divide-border">
            {(["Comfortable", "Intermediate", "Familiar", "Learning"] as SkillLevel[]).map((level) => { const names = group.skills.filter((skill) => skill.level === level).map((skill) => skill.name); return names.length ? <div key={level} className="py-3 first:pt-0 last:pb-0"><dt className="font-mono text-xs text-muted">{level}</dt><dd className="mt-1 text-sm leading-6 text-foreground">{names.join(", ")}</dd></div> : null; })}
          </dl>
        </section>)}
        <p className="text-sm text-muted sm:col-span-2 lg:col-span-3">Security practice: CTF challenges in cryptography and forensics.</p>
      </div>
    </div>
    <div className={mode === "graph" ? "block" : "hidden md:hidden"}>
      <p className="sr-only">Interactive skills constellation. Select a skill or project to highlight its connections.</p>
      <svg viewBox="0 0 760 520" role="img" aria-label="Skills, categories and projects constellation" className="w-full overflow-visible rounded-ui border border-border bg-panel">
        {edges.map((edge, index) => { const from = nodes.find((node) => node.id === edge.source)!; const to = nodes.find((node) => node.id === edge.target)!; const on = active(from.id) && active(to.id); return <line key={`${edge.source}-${edge.target}-${index}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} className={`fill-none stroke-field transition-opacity ${on ? "opacity-50" : "opacity-[0.08]"}`} strokeWidth="1" strokeDasharray="4 5" />; })}
        {nodes.map((node) => { if (node.kind === "person") return <g key={node.id}><circle cx={node.x} cy={node.y} r="23" className="fill-accent"/><text x={node.x} y={(node.y ?? 0) + 4} textAnchor="middle" className="fill-accent-ink font-mono text-[11px]">Owen</text></g>; const selectedNode = selected === node.id; const clickable = node.kind === "skill" || node.kind === "project"; return <g key={node.id} role={clickable ? "button" : undefined} tabIndex={clickable ? 0 : undefined} aria-label={clickable ? `Highlight ${node.label}` : undefined} onClick={clickable ? () => setSelected(selected === node.id ? null : node.id) : undefined} onKeyDown={clickable ? (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); setSelected(selected === node.id ? null : node.id); } } : undefined} className={clickable ? "cursor-pointer" : undefined} opacity={active(node.id) ? 1 : 0.25}>
          <circle cx={node.x} cy={node.y} r={node.kind === "category" ? 9 : node.kind === "project" ? 8 : radius(node.level)} className={`${node.kind === "project" ? "fill-coral" : "fill-lake"} stroke-background`} strokeWidth={selectedNode ? 3 : 1}/>
          <text x={(node.x ?? 0) + 11} y={(node.y ?? 0) + 4} className={`${node.kind === "category" ? "fill-foreground font-semibold text-[11px]" : "fill-muted text-[9px]"} pointer-events-none`}>{node.label}</text>
        </g>; })}
      </svg>
      <div className="mt-4 flex flex-wrap gap-4 font-mono text-xs text-muted" aria-label="Skill level legend">{(["Comfortable", "Intermediate", "Familiar", "Learning"] as SkillLevel[]).map((level) => <span key={level} className="inline-flex items-center gap-2"><span className="inline-block rounded-full bg-lake" style={{ width: radius(level) * 2, height: radius(level) * 2 }} />{level}</span>)}</div>
      {selected && <button type="button" onClick={() => setSelected(null)} className="mt-3 min-h-10 text-sm text-foreground underline underline-offset-4">Clear selection</button>}
    </div>
  </div>;
}
