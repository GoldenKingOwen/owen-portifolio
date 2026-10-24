import { Section } from "@/components/ui/Section";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { skills } from "@/data/skills";
import type { SkillLevel } from "@/types";

const LEVEL_ORDER: SkillLevel[] = ["Comfortable", "Intermediate", "Familiar", "Learning"];

// Level is stated once per row and carried by weight: names step down in
// weight and tone with confidence. Typography only, never a chip.
const LEVEL_STYLE: Record<SkillLevel, string> = {
  Comfortable: "font-semibold text-foreground",
  Intermediate: "font-medium text-foreground",
  Familiar: "text-muted",
  Learning: "text-muted italic",
};

export function Skills() {
  return (
    <Section id="skills" title="Skills" density="tight">
      <p className="max-w-[60ch] text-sm text-muted">
        Self-rated, strongest first: Comfortable, Intermediate, Familiar, Learning.
      </p>
      {/* A row-major grid, so reading order is the data order. Cards keep their natural
          height (items-start): short groups never stretch into empty boxes. */}
      <div className="mt-6 grid items-start gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {skills.map((group) => (
          <Card key={group.category}>
            <CardHeader>
              <CardTitle className="text-base">{group.category}</CardTitle>
            </CardHeader>
            <CardBody>
              <dl className="divide-y divide-border">
                {LEVEL_ORDER.map((level) => {
                  const names = group.skills.filter((s) => s.level === level).map((s) => s.name);
                  if (names.length === 0) return null;
                  return (
                    <div key={level} className="py-3 first:pt-0 last:pb-0">
                      <dt className="font-mono text-xs text-muted">{level}</dt>
                      <dd className={`mt-1 text-sm leading-6 ${LEVEL_STYLE[level]}`}>
                        {names.join(", ")}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </CardBody>
          </Card>
        ))}
      </div>
    </Section>
  );
}
