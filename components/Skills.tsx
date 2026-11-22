import { Section } from "@/components/ui/Section";
import { skills } from "@/data/skills";
import { projects } from "@/data/projects";
import { SkillConstellation } from "@/components/SkillConstellation";

export function Skills() {
  return (
    <Section id="skills" title="Skills" density="tight">
      <SkillConstellation skills={skills} projects={projects} />
    </Section>
  );
}
