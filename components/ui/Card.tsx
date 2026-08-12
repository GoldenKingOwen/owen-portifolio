import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverLift?: boolean;
}

/**
 * Base glass surface: subtle border, soft background tint, and a
 * gentle backdrop blur. `hoverLift` adds the lift/glow used on
 * interactive cards (project cards) but not static ones (about stats).
 */
export function Card({ hoverLift = false, className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface backdrop-blur-sm",
        "shadow-[0_1px_0_0_rgba(255,255,255,0.05)_inset]",
        hoverLift &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-accent-violet/40 hover:shadow-[0_0_30px_-10px_rgba(124,92,252,0.4)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}