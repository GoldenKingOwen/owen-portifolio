import { cn } from "@/lib/utils";
import { SkillLevel } from "@/types";

interface TechBadgeProps {
  label: string;
  className?: string;
}

/**
 * Neutral mono-font tag used for technology names on project cards
 * and skill lists.
 */
export function TechBadge({ label, className }: TechBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border border-border bg-surface",
        "px-2.5 py-1 font-mono text-xs text-muted",
        className
      )}
    >
      {label}
    </span>
  );
}

const LEVEL_STYLES: Record<SkillLevel, string> = {
  Comfortable: "border-accent-violet/30 bg-accent-violet/10 text-accent-violet",
  Intermediate: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
  Familiar: "border-border bg-surface text-muted",
  Learning: "border-border/60 bg-surface/50 text-muted/80",
};

interface LevelBadgeProps {
  level: SkillLevel;
  className?: string;
}

/**
 * Color-coded badge for a skill's proficiency level. Color is paired
 * with the text label itself (never color alone) to stay accessible.
 */
export function LevelBadge({ level, className }: LevelBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium",
        LEVEL_STYLES[level],
        className
      )}
    >
      {level}
    </span>
  );
}