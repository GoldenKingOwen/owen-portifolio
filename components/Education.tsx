import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { education } from "@/data/education";
import { formatDateRange } from "@/lib/utils";

export function Education() {
  return (
    <section id="education" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading path="education" title="Education" />

        <ol className="relative space-y-8 border-l border-border pl-8">
          {education.map((entry) => (
            <li key={`${entry.institution}-${entry.program}`} className="relative">
              <span
                className="absolute -left-[calc(2rem+5px)] top-1.5 h-2.5 w-2.5 rounded-full bg-accent-blue"
                aria-hidden="true"
              />
              <Card className="p-6">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {entry.program}
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {formatDateRange(entry.startYear, entry.endYear)}
                  </span>
                </div>
                <p className="mt-1 text-sm text-accent-blue">{entry.institution}</p>

                {entry.relevantCoursework && entry.relevantCoursework.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-medium uppercase tracking-wide text-muted">
                      Relevant Coursework
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {entry.relevantCoursework.map((course) => (
                        <span
                          key={course}
                          className="rounded-md border border-border bg-surface px-2.5 py-1 text-xs text-muted"
                        >
                          {course}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {entry.achievements && entry.achievements.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {entry.achievements.map((a, i) => (
                      <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                        <span className="mt-2 h-1 w-1 flex-shrink-0 rounded-full bg-muted" />
                        {a}
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}