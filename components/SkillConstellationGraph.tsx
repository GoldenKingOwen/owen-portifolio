"use client";

import { useMemo, useState } from "react";
import {
  forceCollide,
  forceLink,
  forceManyBody,
  forceSimulation,
  forceX,
  forceY,
} from "d3-force";
import type { Project, SkillCategory, SkillLevel } from "@/types";

type NodeKind = "person" | "category" | "skill" | "project";

type GraphNode = {
  id: string;
  label: string;
  kind: NodeKind;
  level?: SkillLevel;
  category?: string;
  x: number;
  y: number;
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  length: number;
};

const CATEGORIES = [
  "Languages",
  "Frontend",
  "Backend",
  "Database",
  "Infrastructure",
  "Mobile",
  "Security",
] as const;

/** The data file names categories for a reader; the graph needs short labels. */
function shortCategory(name: string) {
  if (name === "Programming Languages") return "Languages";
  if (name === "Mobile Development") return "Mobile";
  if (name === "Messaging & Infrastructure" || name === "Tools & Technologies") return "Infrastructure";
  return name;
}

/** Ring fill per proficiency: full, three quarters, half, and a dashed dial. */
const RING_FILL: Record<SkillLevel, number | "dashed"> = {
  Comfortable: 1,
  Intermediate: 0.75,
  Familiar: 0.5,
  Learning: "dashed",
};

const RING_RADIUS = 6;

/**
 * Layout is physical, then frozen: d3-force runs once for a fixed number of
 * ticks and the positions are cached in a memo, so no simulation survives the
 * first render and resizing never reshuffles the constellation.
 */
function buildGraph(skills: SkillCategory[], projects: Project[]) {
  const nodes: Array<Omit<GraphNode, "x" | "y"> & { x?: number; y?: number }> = [
    { id: "owen", label: "Owen", kind: "person", x: 380, y: 262 },
  ];
  const edges: Array<{ source: string; target: string }> = [];

  CATEGORIES.forEach((name, index) => {
    const angle = (index / CATEGORIES.length) * Math.PI * 2 - Math.PI / 2;
    nodes.push({
      id: `cat:${name}`,
      label: name,
      kind: "category",
      x: 380 + Math.cos(angle) * 178,
      y: 262 + Math.sin(angle) * 150,
    });
    edges.push({ source: "owen", target: `cat:${name}` });
  });

  skills.forEach((group) => {
    const category = shortCategory(group.category);
    group.skills.forEach((skill) => {
      const id = `skill:${category}:${skill.name}`;
      nodes.push({ id, label: skill.name, kind: "skill", level: skill.level, category });
      edges.push({ source: `cat:${category}`, target: id });
    });
  });

  projects.forEach((project, index) => {
    const id = `project:${project.slug}`;
    nodes.push({
      id,
      label: project.name,
      kind: "project",
      x: index < 2 ? 56 : 704,
      y: 88 + index * 118,
    });
    project.technologies.forEach((tech) => {
      const skill = nodes.find(
        (node) => node.kind === "skill" && node.label.toLowerCase() === tech.toLowerCase(),
      );
      if (skill) edges.push({ source: id, target: skill.id });
    });
  });

  const links = edges.map((edge) => ({ ...edge }));
  const simulation = forceSimulation(nodes)
    .force("charge", forceManyBody().strength(-34))
    .force(
      "link",
      forceLink(links)
        .id((node) => (node as GraphNode).id)
        .distance(54)
        .strength(0.6),
    )
    .force("x", forceX(380).strength(0.028))
    .force("y", forceY(262).strength(0.035))
    .force("collision", forceCollide(26))
    .stop();
  simulation.tick(180);

  const positioned = nodes as GraphNode[];
  const positions = new Map(positioned.map((node) => [node.id, node]));
  const measured: GraphEdge[] = edges.flatMap((edge) => {
    const from = positions.get(edge.source);
    const to = positions.get(edge.target);
    if (!from || !to) return [];
    return [
      {
        id: `${edge.source}->${edge.target}`,
        source: edge.source,
        target: edge.target,
        length: Math.round(Math.hypot(to.x - from.x, to.y - from.y) * 10) / 10,
      },
    ];
  });

  return { nodes: positioned, edges: measured };
}

function nodeId(id: string) {
  return id.replace(/[^a-zA-Z0-9_-]/g, "-");
}

export default function SkillConstellationGraph({
  skills,
  projects,
}: {
  skills: SkillCategory[];
  projects: Project[];
}) {
  const { nodes, edges } = useMemo(() => buildGraph(skills, projects), [skills, projects]);
  const [pinned, setPinned] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const focus = pinned ?? hovered;

  const connected = useMemo(() => {
    if (!focus) return null;
    const ids = new Set<string>([focus]);
    edges.forEach((edge) => {
      if (edge.source === focus) ids.add(edge.target);
      if (edge.target === focus) ids.add(edge.source);
    });
    return ids;
  }, [focus, edges]);

  const isActive = (id: string) => !connected || connected.has(id);
  const positions = useMemo(() => new Map(nodes.map((node) => [node.id, node])), [nodes]);

  const selectable = (kind: NodeKind) => kind === "skill" || kind === "project";

  return (
    <div>
      <svg
        viewBox="0 0 760 540"
        role="img"
        aria-label="Skills constellation: Owen at the centre, categories around him, individual skills and projects linked by technology."
        className="w-full overflow-visible rounded-ui border border-border bg-panel"
      >
        <defs>
          <filter id="skill-node-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {edges.map((edge) => {
          const from = positions.get(edge.source);
          const to = positions.get(edge.target);
          if (!from || !to) return null;
          const on = isActive(edge.source) && isActive(edge.target);
          const linked = focus !== null && on && (edge.source === focus || edge.target === focus);
          return (
            <g key={edge.id}>
              <line
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                strokeWidth="1"
                strokeDasharray="4 5"
                className="stroke-field"
                opacity={on ? 0.4 : 0.08}
              />
              {linked && (
                <line
                  x1={from.x}
                  y1={from.y}
                  x2={to.x}
                  y2={to.y}
                  pathLength={1}
                  strokeWidth="1.25"
                  strokeDasharray="1"
                  className="skill-edge-draw stroke-lake"
                  style={{ "--edge-len": 1 } as React.CSSProperties}
                />
              )}
            </g>
          );
        })}

        {nodes.map((node) => {
          if (node.kind === "person") {
            return (
              <g key={node.id}>
                <circle cx={node.x} cy={node.y} r="24" className="fill-accent" />
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  className="fill-accent-ink font-mono text-[11px]"
                >
                  Owen
                </text>
              </g>
            );
          }

          const active = isActive(node.id);
          const isFocused = focus === node.id;
          const clickable = selectable(node.kind);
          const filterOn = isFocused ? "url(#skill-node-glow)" : undefined;

          return (
            <g
              key={node.id}
              id={`skill-node-${nodeId(node.id)}`}
              role={clickable ? "button" : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-label={clickable ? `Highlight ${node.label} and its connections` : node.label}
              aria-pressed={clickable ? pinned === node.id : undefined}
              onClick={
                clickable
                  ? () => setPinned(pinned === node.id ? null : node.id)
                  : undefined
              }
              onKeyDown={
                clickable
                  ? (event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setPinned(pinned === node.id ? null : node.id);
                      }
                      if (event.key === "Escape") setPinned(null);
                    }
                  : undefined
              }
              onPointerEnter={clickable ? () => setHovered(node.id) : undefined}
              onPointerLeave={clickable ? () => setHovered(null) : undefined}
              onFocus={clickable ? () => setHovered(node.id) : undefined}
              onBlur={clickable ? () => setHovered(null) : undefined}
              opacity={active ? 1 : 0.25}
              className={clickable ? "cursor-pointer outline-none" : undefined}
            >
              {node.kind === "category" && (
                <circle cx={node.x} cy={node.y} r="10" className="fill-lake stroke-background" strokeWidth="1.5" />
              )}

              {node.kind === "skill" && node.level && (
                <g transform={`translate(${node.x} ${node.y})`} filter={filterOn}>
                  <circle r={RING_RADIUS} className="fill-background stroke-field" strokeWidth="1" />
                  {RING_FILL[node.level] === "dashed" ? (
                    <circle
                      r={RING_RADIUS}
                      pathLength={1}
                      fill="none"
                      className="stroke-lake"
                      strokeWidth="1.75"
                      strokeDasharray="0.08 0.1"
                      transform="rotate(-90)"
                    />
                  ) : (
                    <circle
                      r={RING_RADIUS}
                      pathLength={1}
                      fill="none"
                      className="stroke-lake"
                      strokeWidth="1.75"
                      strokeDasharray={`${RING_FILL[node.level]} 1`}
                      transform="rotate(-90)"
                    />
                  )}
                </g>
              )}

              {node.kind === "project" && (
                <rect
                  x={node.x - 5}
                  y={node.y - 5}
                  width="10"
                  height="10"
                  transform={`rotate(45 ${node.x} ${node.y})`}
                  className="fill-coral stroke-background"
                  strokeWidth="1.5"
                  filter={filterOn}
                />
              )}

              {isFocused && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="16"
                  fill="none"
                  className="stroke-sun"
                  strokeWidth="1"
                  strokeDasharray="2 3"
                />
              )}

              <text
                x={node.x + 13}
                y={node.y + 4}
                className={
                  node.kind === "category"
                    ? "pointer-events-none fill-foreground text-[11px] font-semibold"
                    : "pointer-events-none fill-muted text-[9px]"
                }
                stroke="var(--panel)"
                strokeWidth="2.5"
                paintOrder="stroke"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3 font-mono text-xs text-muted" aria-label="Skill level legend">
        {(Object.keys(RING_FILL) as SkillLevel[]).map((level) => (
          <span key={level} className="inline-flex items-center gap-2">
            <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
              <circle cx="10" cy="10" r="6" className="fill-background stroke-field" strokeWidth="1" />
              <circle
                cx="10"
                cy="10"
                r="6"
                pathLength={1}
                fill="none"
                className="stroke-lake"
                strokeWidth="1.75"
                strokeDasharray={
                  RING_FILL[level] === "dashed" ? "0.08 0.1" : `${RING_FILL[level]} 1`
                }
                transform="rotate(-90 10 10)"
              />
            </svg>
            {level}
          </span>
        ))}
        <span className="inline-flex items-center gap-2">
          <svg viewBox="0 0 20 20" className="h-[18px] w-[18px]" aria-hidden="true">
            <rect x="1" y="1" width="8" height="8" className="fill-coral" />
          </svg>
          Project
        </span>
      </div>

      <div className="mt-3 flex items-center gap-4">
        <p className="text-xs text-muted">
          Hover or focus a node to isolate its links; select it to keep the highlight.
        </p>
        {pinned && (
          <button
            type="button"
            onClick={() => setPinned(null)}
            className="min-h-10 text-sm text-foreground underline underline-offset-4"
          >
            Clear selection
          </button>
        )}
      </div>
    </div>
  );
}
