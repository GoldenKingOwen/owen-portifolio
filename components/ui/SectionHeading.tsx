import { cn } from "@/lib/utils";
import type { CSSProperties } from "react";

interface SectionHeadingProps {
  /** e.g. "about", "projects" — rendered as a terminal-style path like ~/about */
  path: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * The page's signature structural device: every section opens with a
 * mono-font path (~/about, ~/projects) instead of a decorative number
 * or icon — a small nod to the subject (a developer) that also gives
 * each section a consistent, scannable anchor.
 */
export function SectionHeading({
  path,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {/* Decorative terminal path (~/about). The text is rendered by a CSS
          pseudo-element (see .section-path::before in globals.css) rather
          than a real text node, so screen readers never announce it — the
          aria-hidden below is just extra safety. The path is hidden
          entirely on small screens and the <h2> below is the actual
          navigation point for screen-reader heading navigation. */}
      <span
        className="section-path hidden font-mono text-sm text-accent-violet/80 sm:block"
        style={{ "--section-path": `~/${path}` } as CSSProperties}
        aria-hidden="true"
      />
      <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "max-w-2xl text-base text-muted",
            align === "center" && "mx-auto"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}