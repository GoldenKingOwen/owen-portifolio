import { Section } from "@/components/ui/Section";
import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { Certifications } from "@/components/Certifications";
import { education } from "@/data/education";
import { cn, formatDateRange } from "@/lib/utils";

export function Education() {
  return (
    <Section id="education" title="Education" density="tight">
      <div data-timeline="" className="relative">
        <span
          data-timeline-rail=""
          aria-hidden="true"
          className="absolute bottom-2 left-[4px] top-2 block w-px origin-top bg-field"
        />
        <ol className="space-y-4 pl-8 sm:space-y-6">
          {education.map((entry, i) => {
            const hasDetail = Boolean(
              entry.relevantCoursework?.length || entry.achievements?.length
            );
            return (
              <li key={`${entry.institution}-${entry.program}`} className="relative">
                <span
                  data-node=""
                  aria-hidden="true"
                  className="absolute -left-8 top-7 block h-[9px] w-[9px] border border-field bg-background"
                />
                <Card data-entry>
                  <CardHeader>
                    <CardTitle className={cn(i > 0 && "text-base")}>{entry.program}</CardTitle>
                    <CardMeta className="tabular">
                      {formatDateRange(entry.startYear, entry.endYear)}
                    </CardMeta>
                    <p className="text-sm text-muted">{entry.institution}</p>
                  </CardHeader>

                  {hasDetail && (
                    <CardBody>
                      {entry.relevantCoursework && entry.relevantCoursework.length > 0 && (
                        <>
                          <p className="text-sm font-medium text-foreground">Relevant coursework</p>
                          <ul className="mt-2 grid list-disc gap-x-8 gap-y-1 pl-5 text-sm leading-relaxed text-muted marker:text-muted sm:grid-cols-2">
                            {entry.relevantCoursework.map((course) => (
                              <li key={course}>{course}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {entry.achievements && entry.achievements.length > 0 && (
                        <ul className="mt-4 max-w-[65ch] list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-muted">
                          {entry.achievements.map((a) => (
                            <li key={a}>{a}</li>
                          ))}
                        </ul>
                      )}
                    </CardBody>
                  )}
                </Card>
              </li>
            );
          })}
        </ol>
      </div>

      <Certifications />
    </Section>
  );
}
