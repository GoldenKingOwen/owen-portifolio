import { Section } from "@/components/ui/Section";
import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { experience } from "@/data/experience";
import { cn, formatDateRange } from "@/lib/utils";

/**
 * Cards hung off a vertical rail with a node per entry. The current role is
 * featured; earlier roles are quieter. The rail draws with a scrubbed scaleY and
 * each node appears as it is reached (motion layer: data-timeline, data-node).
 * Dates are Geist Mono. Without motion the rail and nodes are simply drawn.
 */
export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <div data-timeline="" className="relative">
        <span
          data-timeline-rail=""
          aria-hidden="true"
          className="absolute bottom-2 left-[4px] top-2 block w-px origin-top bg-field"
        />
        <ol className="space-y-4 pl-8 sm:space-y-6">
          {experience.map((job, i) => {
            const current = i === 0;
            return (
              <li key={`${job.organization}-${job.position}`} className="relative">
                <span
                  data-node=""
                  aria-hidden="true"
                  className={cn(
                    "absolute -left-8 block h-[9px] w-[9px] rounded-full border",
                    current ? "top-9 border-accent bg-accent" : "top-7 border-field bg-background"
                  )}
                />
                <Card featured={current} data-entry>
                  <CardHeader>
                    <CardTitle featured={current} className={cn(!current && "text-base")}>
                      {job.position}
                    </CardTitle>
                    <CardMeta className="tabular">
                      {formatDateRange(job.startDate, job.endDate)}
                    </CardMeta>
                    <p className="text-sm text-muted">
                      {job.organization}, {job.location}
                    </p>
                  </CardHeader>

                  <CardBody>
                    <p
                      className={cn(
                        "max-w-[65ch] leading-relaxed",
                        current ? "text-base text-foreground" : "text-sm text-muted"
                      )}
                    >
                      {job.description}
                    </p>

                    {job.responsibilities.length > 0 && (
                      <ul className="mt-4 max-w-[65ch] list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-muted">
                        {job.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    )}

                    <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">
                      {job.technologies.join(", ")}
                    </p>
                  </CardBody>
                </Card>
              </li>
            );
          })}
        </ol>
      </div>
    </Section>
  );
}
