"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X, ExternalLink, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { TechBadge } from "@/components/ui/Badge";
import { Project } from "@/types";

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

/**
 * Full-detail dialog for a project, opened from the "View Details" button
 * on the projects grid. Accessible: role="dialog", Esc to close, backdrop
 * click to close, focus moves to the close button, and body scroll is
 * locked while open.
 */
export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden"; // lock page scroll behind the modal
    closeButtonRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus(); // return focus to the trigger on close
    };
  }, [onClose]);

  const titleId = `project-modal-title-${project.slug}`;
  const motionProps = prefersReducedMotion
    ? {}
    : { transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      {/* Backdrop — plain div so it's not an extra focusable element */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Panel */}
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
        {...motionProps}
        className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background-secondary shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-border px-6 pb-4 pt-5 sm:px-8">
          <div>
            <h2
              id={titleId}
              className="font-display text-xl font-semibold tracking-tight text-foreground sm:text-2xl"
            >
              {project.name}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-border bg-surface px-2.5 py-1 font-mono text-[11px] text-muted">
                {project.status}
              </span>
              {project.links.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
                >
                  <GithubIcon size={13} aria-hidden="true" />
                  Code
                </a>
              )}
              {project.links.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-muted hover:text-foreground"
                >
                  <ExternalLink size={13} aria-hidden="true" />
                  Live Demo
                </a>
              )}
            </div>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Close project details"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="space-y-6 overflow-y-auto px-6 py-5 sm:px-8">
          <p className="text-sm leading-relaxed text-muted">{project.shortDescription}</p>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <TechBadge key={tech} label={tech} />
            ))}
          </div>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Overview</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.detail.overview}</p>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Problem Statement</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              {project.detail.problemStatement}
            </p>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Objectives</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {project.detail.objectives.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Key Features</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {project.detail.features.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Architecture</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{project.detail.architecture}</p>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Challenges</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {project.detail.challenges.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <section>
            <h3 className="font-display text-sm font-semibold text-foreground">Solutions</h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-muted">
              {project.detail.solutions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </section>

          <div className="border-t border-border pt-4">
            <Link
              href={`/projects/${project.slug}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-violet hover:underline"
            >
              Open full project page
              <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
