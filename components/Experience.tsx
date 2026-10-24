import { Section } from "@/components/ui/Section";
import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { experience } from "@/data/experience";
import { cn, formatDateRange } from "@/lib/utils";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      {/* The current role leads at full width; earlier roles are quieter cards beneath it. */}
      <ol className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {experience.map((job, i) => {
          const current = i === 0;
          return (
            <li key={`${job.organization}-${job.position}`} className={cn(current && "md:col-span-2")}>
              <Card featured={current} data-entry className="h-full">
                <CardHeader>
                  <CardTitle featured={current} className={cn(!current && "text-base")}>
                    {job.position}
                  </CardTitle>
                  <CardMeta className="tabular">{formatDateRange(job.startDate, job.endDate)}</CardMeta>
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
    </Section>
  );
}
