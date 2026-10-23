import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { LevelBadge } from "@/components/ui/Badge";
import { skills } from "@/data/skills";

export function Skills() {
  return (
    <section id="skills" aria-labelledby="skills-heading" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          path="skills"
          title="Technical Skills"
          description="Organized by area, with an honest level next to each — not proficiency bars pretending to be precise."
        />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((category) => (
            <Card key={category.category} className="p-6">
              <h3 className="font-display text-base font-semibold text-foreground">
                {category.category}
              </h3>
              <ul className="mt-4 space-y-3">
                {category.skills.map((skill) => (
                  <li
                    key={skill.name}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-muted">{skill.name}</span>
                    <LevelBadge level={skill.level} />
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}