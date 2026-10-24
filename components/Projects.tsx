import { Section } from "@/components/ui/Section";
import { ProjectCard } from "@/components/ProjectCard";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { projects } from "@/data/projects";

export function Projects() {
  // The featured project leads at full width; the rest sit beneath it, side by side.
  const lead = projects.find((p) => p.featured) ?? projects[0];
  const others = projects.filter((p) => p !== lead);

  return (
    <Section id="projects" title="Projects" density="roomy">
      <div className="space-y-4 sm:space-y-6">
        <ProjectCard project={lead} lead>
          {lead.slug === "tenant-feedback-portal" && <ArchitectureDiagram />}
        </ProjectCard>
        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {others.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </Section>
  );
}
