import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionProps {
  id: string;
  title: string;
  children: ReactNode;
  className?: string;
}

/**
 * Every home-page section: a hairline rule, the title in a left margin
 * column, and the content in the right column. No eyebrow, no card.
 * `data-section` / `data-reveal` are stable hooks for a later motion pass.
 */
export function Section({ id, title, children, className }: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      data-section={id}
      className={cn("border-t border-border py-14 sm:py-20", className)}
    >
      <div className="mx-auto grid max-w-5xl gap-6 px-4 sm:px-6 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-12">
        <h2
          id={`${id}-heading`}
          className="text-h2 font-semibold text-foreground lg:sticky lg:top-24 lg:self-start"
        >
          {title}
        </h2>
        <div data-reveal>{children}</div>
      </div>
    </section>
  );
}
