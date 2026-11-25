import { Section } from "@/components/ui/Section";
import { ProjectPanel } from "@/components/ProjectPanel";
import { projects } from "@/data/projects";
import { RequestJourney } from "@/components/RequestJourney";

const ORDER = ["tenant-feedback-portal", "chess-practice", "cyber-awareness", "world-scope"];

/**
 * Desktop: each sheet is sticky at the same top offset, so the next slides over
 * the previous one while the motion layer scales and dims the sheet behind. The
 * stack is pure CSS position: sticky — no pin spacers, no scroll-jacking, and
 * below 1024px the same markup is an ordinary vertical list.
 */
export function Projects() {
  const ordered = [...projects].sort((a, b) => ORDER.indexOf(a.slug) - ORDER.indexOf(b.slug));

  return (
    <Section id="projects" title="Projects" density="roomy">
      <div className="space-y-8 lg:space-y-10">
        {ordered.map((project, index) => (
          <div
            key={project.slug}
            className="scroll-mt-24 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]"
            style={{ zIndex: index + 1 }}
          >
            <ProjectPanel project={project} index={index} total={ordered.length} />
          </div>
        ))}
      </div>

      <div id="request-journey" className="mt-16 scroll-mt-28">
        <RequestJourney />
      </div>
    </Section>
  );
}
