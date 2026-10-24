import { Section } from "@/components/ui/Section";
import { Card, CardBody, CardHeader, CardMeta, CardTitle } from "@/components/ui/Card";
import { CertificationsLazy } from "@/components/CertificationsLazy";
import { education } from "@/data/education";
import { cn, formatDateRange } from "@/lib/utils";

export function Education() {
  return (
    <Section id="education" title="Education" density="tight">
      <ol className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {education.map((entry, i) => {
          const hasDetail = Boolean(entry.relevantCoursework?.length || entry.achievements?.length);
          return (
            <li
              key={`${entry.institution}-${entry.program}`}
              // A qualification with coursework spans the row; the plain ones pair up.
              className={cn(hasDetail && "md:col-span-2")}
            >
              <Card data-entry className="h-full">
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

      <CertificationsLazy />
    </Section>
  );
}
