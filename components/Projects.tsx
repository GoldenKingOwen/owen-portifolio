"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ProjectCard";
import { cn } from "@/lib/utils";
import { projects } from "@/data/projects";

const ALL = "All";

export function Projects() {
  const prefersReducedMotion = useReducedMotion();
  const [activeFilter, setActiveFilter] = useState(ALL);

  const technologies = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.technologies.forEach((t) => set.add(t)));
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const filtered = useMemo(() => {
    if (activeFilter === ALL) return projects;
    return projects.filter((p) => p.technologies.includes(activeFilter));
  }, [activeFilter]);

  return (
    <section id="projects" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          path="projects"
          title="Projects"
          description="A selection of what I've built — real repos and, where deployed, live demos."
        />

        <div className="mb-10 flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <button
              key={tech}
              onClick={() => setActiveFilter(tech)}
              aria-pressed={activeFilter === tech}
              className={cn(
                "rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors",
                activeFilter === tech
                  ? "border-accent-violet/40 bg-accent-violet/10 text-accent-violet"
                  : "border-border bg-surface text-muted hover:text-foreground"
              )}
            >
              {tech}
            </button>
          ))}
        </div>

        <motion.div layout={!prefersReducedMotion} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.slug}
                layout={!prefersReducedMotion}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: prefersReducedMotion ? 0 : i * 0.05 }}
                className={project.featured ? "lg:col-span-2" : ""}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <p className="py-12 text-center text-sm text-muted">
            No projects use {activeFilter} yet.
          </p>
        )}
      </div>
    </section>
  );
}