import { cn } from "@/lib/utils";

interface GlowOrbProps {
  color?: "violet" | "blue";
  size?: number;
  className?: string;
}

const COLOR_MAP = {
  violet: "bg-violet-600/30",
  blue: "bg-blue-600/25",
};

/**
 * A single soft blurred gradient orb used for ambient background
 * atmosphere. Pure CSS, no JS — the drift animation only runs under
 * `motion-safe` so it's inert automatically when the user has
 * `prefers-reduced-motion` enabled.
 */
export function GlowOrb({ color = "violet", size = 400, className }: GlowOrbProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-3xl",
        "motion-safe:animate-orb-drift",
        COLOR_MAP[color],
        className
      )}
      style={{ width: size, height: size }}
    />
  );
}