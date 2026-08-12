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
        "inline-flex items-center rounded-md border border-white/10 bg-white/[0.03]",
        "px-2.5 py-1 font-mono text-xs text-slate-300",
        className
      )}
    >
      {label}
    </span>
  );
}

const LEVEL_STYLES: Record<SkillLevel, string> = {
  Comfortable: "border-violet-400/30 bg-violet-400/10 text-violet-200",
  Intermediate: "border-blue-400/30 bg-blue-400/10 text-blue-200",
  Familiar: "border-slate-400/30 bg-slate-400/10 text-slate-300",
  Learning: "border-slate-500/20 bg-slate-500/5 text-slate-400",
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