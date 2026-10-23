import { Section } from "@/components/ui/Section";
import { experience } from "@/data/experience";
import { formatDateRange } from "@/lib/utils";

export function Experience() {
  return (
    <Section id="experience" title="Experience">
      <ol className="space-y-12">
        {experience.map((job, i) => (
          <li
            key={`${job.organization}-${job.position}`}
            data-entry
            className={i === 0 ? "" : "border-t border-border pt-8"}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className={i === 0 ? "text-h2 font-semibold text-foreground" : "text-lg font-semibold text-foreground"}>
                {job.position}
              </h3>
              <p className="tabular font-mono text-xs text-muted">
                {formatDateRange(job.startDate, job.endDate)}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">
              {job.organization}, {job.location}
            </p>

            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-foreground">
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
          </li>
        ))}
      </ol>
    </Section>
  );
}
