import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  /** Vertical rhythm: tight for reference lists, roomy for the work and the close. */
  density?: "tight" | "default" | "roomy";
  /** A larger title, reserved for the page's closing section. */
  emphasis?: boolean;
}

const DENSITY = {
  tight: "py-10 sm:py-14",
  default: "py-14 sm:py-20",
  roomy: "py-16 sm:py-28",
} as const;

/**
 * Every home-page section: a hairline rule, the title in a left margin
 * column, and the content in the right column. No eyebrow, no card.
 * `data-section` / `data-reveal` are stable hooks for a later motion pass.
 */
export function Section({ id, title, children, density = "default", emphasis = false }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section={id}
      className={cn("border-t border-border", DENSITY[density])}
    >
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <h2
          id={`${id}-heading`}
          className={cn(
            "font-semibold text-foreground lg:sticky lg:top-24 lg:self-start",
            emphasis ? "text-4xl leading-none tracking-tight sm:text-5xl" : "text-h2"
          )}
        >
          {title}
        </h2>
        <div data-reveal>{children}</div>
      </div>
    </section>
  );
}
