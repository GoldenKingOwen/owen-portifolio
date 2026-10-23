import { Section } from "@/components/ui/Section";
import { CertificationsLazy } from "@/components/CertificationsLazy";
import { education } from "@/data/education";
import { formatDateRange } from "@/lib/utils";

export function Education() {
  return (
    <Section id="education" title="Education">
      <ol className="space-y-10">
        {education.map((entry, i) => (
          <li
            key={`${entry.institution}-${entry.program}`}
            data-entry
            className={i === 0 ? "" : "border-t border-border pt-8"}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-lg font-semibold text-foreground">{entry.program}</h3>
              <p className="tabular font-mono text-xs text-muted">
                {formatDateRange(entry.startYear, entry.endYear)}
              </p>
            </div>
            <p className="mt-1 text-sm text-muted">{entry.institution}</p>

            {entry.relevantCoursework && entry.relevantCoursework.length > 0 && (
              <p className="mt-4 max-w-[65ch] text-sm leading-relaxed text-muted">
                <span className="font-medium text-foreground">Relevant coursework: </span>
                {entry.relevantCoursework.join(", ")}
              </p>
            )}

            {entry.achievements && entry.achievements.length > 0 && (
              <ul className="mt-4 max-w-[65ch] list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted marker:text-muted">
                {entry.achievements.map((a) => (
                  <li key={a}>{a}</li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ol>

      <CertificationsLazy />
    </Section>
  );
}
