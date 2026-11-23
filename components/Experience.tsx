import { Section } from "@/components/ui/Section";
import { GitCommit } from "@/components/GitCommit";
import { experience } from "@/data/experience";
import { education } from "@/data/education";
import { formatDateRange } from "@/lib/utils";

/** Conventional-commit style titles are labels for this graph, not new facts. */
const WORK_TITLES: Record<string, string> = {
  "Infi-Tech": "feat(portal): multi-tenant feedback platform",
  "World Vision Malawi": "chore(data): field records digitised and verified",
  "Malawi National Examinations Board (MANEB)": "chore(data): examination records transcribed",
};

const WORK_HASHES = ["b4e1c9a", "7d2a5f0", "c9e0f13"];
const STUDY_HASHES = ["3f7c1d2", "e81a4b6", "9d5c2a0"];

/**
 * Experience as a repository history: a work lane and a study lane that merge
 * into main at the present. On desktop the lanes sit side by side; below 768px
 * they stack into one column with lane-coloured dots. The rails are decorative
 * and draw with scroll (data-git-rail); every commit's detail is in the HTML,
 * inside a native disclosure.
 */
export function Experience() {
  return (
    <Section id="experience" title="Experience" density="roomy">
      <div className="git-graph" data-git-graph="">
        <div className="git-lanes">
          <div className="git-lane" data-lane="work">
            <p className="git-lane-label">
              <span aria-hidden="true" className="git-lane-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-foreground">work</span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                lane
              </span>
            </p>
            <div className="git-lane-body">
              <svg
                className="git-trunk"
                viewBox="0 0 2 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                fill="none"
              >
                <path
                  data-git-rail=""
                  d="M1 0V100"
                  pathLength={1}
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol className="git-commits">
                {experience.map((job, index) => (
                  <li key={`${job.organization}-${job.position}`}>
                    <GitCommit
                      hash={WORK_HASHES[index] ?? "0000000"}
                      title={WORK_TITLES[job.organization] ?? job.position}
                      meta={`${job.organization} · ${formatDateRange(job.startDate, job.endDate)}`}
                      lane="work"
                    >
                      <p>{job.description}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-4 marker:text-muted">
                        {job.responsibilities.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                      <p className="mt-2 font-mono text-[0.6875rem] uppercase tracking-[0.1em]">
                        {job.technologies.join(" · ")}
                      </p>
                    </GitCommit>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="git-lane" data-lane="study">
            <p className="git-lane-label">
              <span aria-hidden="true" className="git-lane-dot" />
              <span className="font-mono text-xs uppercase tracking-[0.16em] text-foreground">study</span>
              <span className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
                lane
              </span>
            </p>
            <div className="git-lane-body">
              <svg
                className="git-trunk"
                viewBox="0 0 2 100"
                preserveAspectRatio="none"
                aria-hidden="true"
                fill="none"
              >
                <path
                  data-git-rail=""
                  d="M1 0V100"
                  pathLength={1}
                  stroke="currentColor"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <ol className="git-commits">
                {education.map((entry, index) => (
                  <li key={`${entry.institution}-${entry.program}`}>
                    <GitCommit
                      hash={STUDY_HASHES[index] ?? "0000000"}
                      title={`docs(study): ${entry.program.replace("Diploma in ", "diploma in ")}`}
                      meta={`${entry.institution} · ${formatDateRange(entry.startYear, entry.endYear)}`}
                      lane="study"
                    >
                      {entry.relevantCoursework?.length ? (
                        <>
                          <p>Relevant coursework</p>
                          <ul className="mt-1 grid list-disc gap-x-6 pl-4 marker:text-muted sm:grid-cols-2">
                            {entry.relevantCoursework.map((course) => (
                              <li key={course}>{course}</li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p>Diploma in Computing and Information Systems.</p>
                      )}
                    </GitCommit>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>

        <div className="git-merge">
          <span aria-hidden="true" className="git-merge-node" />
          <p className="text-sm text-foreground">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-accent">main</span>
            <span aria-hidden="true" className="mx-2 text-muted">·</span>
            <span className="text-muted">present — both lanes merge here</span>
          </p>
        </div>
      </div>
    </Section>
  );
}
