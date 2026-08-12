import { cn } from "@/lib/utils";

interface ProjectThumbnailProps {
  name: string;
  className?: string;
}

/**
 * Honest placeholder for a project screenshot: a gradient panel with
 * the project name in mono type, rather than a fabricated image.
 * Once real screenshots exist in /public/projects, swap this for a
 * <Image src={project.image} ... /> call in ProjectCard.
 */
export function ProjectThumbnail({ name, className }: ProjectThumbnailProps) {
  return (
    <div
      className={cn(
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl",
        "bg-gradient-to-br from-accent-violet/20 via-background-secondary to-accent-blue/10",
        "border border-border",
        className
      )}
      role="img"
      aria-label={`${name} project preview placeholder`}
    >
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
        aria-hidden="true"
      />
      <span className="relative font-mono text-sm text-muted">{name}</span>
    </div>
  );
}