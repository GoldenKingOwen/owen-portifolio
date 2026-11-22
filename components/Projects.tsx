import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { projects } from "@/data/projects";
import { RequestJourney } from "@/components/RequestJourney";

export function Projects() {
  const order = ["tenant-feedback-portal", "chess-practice", "cyber-awareness", "world-scope"];
  const ordered = [...projects].sort((a, b) => order.indexOf(a.slug) - order.indexOf(b.slug));
  return (
    <Section id="projects" title="Projects" density="roomy">
      <div className="space-y-8 lg:space-y-12">
        {ordered.map((project, index) => <div key={project.slug} data-project-panel="" className="scroll-mt-24">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.18em] text-muted">{String(index + 1).padStart(2, "0")} / {String(ordered.length).padStart(2, "0")}</p>
          <ProjectCard project={project} lead={index === 0} />
          {index === 0 && <RequestJourney />}
        </div>)}
      </div>
    </Section>
  );
}
