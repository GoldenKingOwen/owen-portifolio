import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { TechBadge } from "@/components/ui/Badge";
import { experience } from "@/data/experience";
import { formatDateRange } from "@/lib/utils";

export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading path="experience" title="Experience" />

        <ol className="relative space-y-8 border-l border-border pl-8">
          {experience.map((item) => (
            <li key={`${item.organization}-${item.startDate}`} className="relative">
              <span
                className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-violet"
                aria-hidden="true"
              />
              <Card className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {item.position}
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {formatDateRange(item.startDate, item.endDate)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-accent-violet">
                  {item.organization} · {item.location}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.description}</p>

                <ul className="mt-4 space-y-2">
                  {item.responsibilities.map((r, i) => (
                    <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                      <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                      {r}
                    </li>
                  ))}
                </ul>

                {item.technologies.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {item.technologies.map((tech) => (
                      <TechBadge key={tech} label={tech} />
                    ))}
                  </div>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}