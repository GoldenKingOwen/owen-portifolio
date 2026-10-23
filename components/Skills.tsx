import { Section } from "@/components/ui/Section";
import { skills } from "@/data/skills";
import type { SkillLevel } from "@/types";

const LEVEL_ORDER: SkillLevel[] = ["Comfortable", "Intermediate", "Familiar", "Learning"];

// Level is stated once per group and carried by weight: names step down in
// weight and tone with confidence, so the page does not repeat a label per row.
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
        Self-rated, strongest first: Comfortable, Intermediate, Familiar, Learning.
      </p>
      <div className="mt-6 space-y-8">
        {skills.map((group) => (
          <div key={group.category}>
            <h3 className="text-sm font-semibold text-foreground">{group.category}</h3>
            <dl className="mt-2 border-t border-border">
              {LEVEL_ORDER.map((level) => {
                const names = group.skills.filter((s) => s.level === level).map((s) => s.name);
                if (names.length === 0) return null;
                return (
                  <div
                    key={level}
                    className="grid grid-cols-[6.5rem_1fr] gap-4 border-b border-border py-2.5 text-sm"
                  >
                    <dt className="font-mono text-xs leading-6 text-muted">{level}</dt>
                    <dd className={`leading-6 ${LEVEL_STYLE[level]}`}>{names.join(", ")}</dd>
                  </div>
                );
              })}
            </dl>
          </div>
        ))}
      </div>
    </Section>
  );
}
