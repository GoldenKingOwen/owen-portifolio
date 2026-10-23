import { Section } from "@/components/ui/Section";
import { skills } from "@/data/skills";
import type { SkillLevel } from "@/types";

// Level is typography, not a chip: weight and tone step down with confidence,
// and the word itself is always printed.
const LEVEL_STYLE: Record<SkillLevel, string> = {
  Comfortable: "font-semibold text-foreground",
  Intermediate: "font-medium text-foreground",
  Familiar: "text-muted",
  Learning: "text-muted italic",
};

export function Skills() {
  return (
    <Section id="skills" title="Skills" className="py-12 sm:py-16">
      <p className="max-w-[60ch] text-sm text-muted">
        Self-rated: Comfortable, Intermediate, Familiar, Learning.
      </p>
      <div className="mt-6 space-y-8">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-semibold text-foreground">{group.category}</h3>
            <dl className="mt-2 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
              {group.skills.map((skill) => (
                <div
                  key={skill.name}
                  className="flex items-baseline justify-between gap-4 border-b border-border py-2 text-sm"
                >
                  <dt className={LEVEL_STYLE[skill.level]}>{skill.name}</dt>
                  <dd className="font-mono text-xs text-muted">{skill.level}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
