import type { SkillCategory, SkillLevel } from "@/types";

const LEVELS: SkillLevel[] = ["Comfortable", "Intermediate", "Familiar", "Learning"];

/**
 * The readable skills inventory. Always in the server HTML; when the graph view
 * is shown this block stays in the document for assistive technology (the
 * client wrapper hides it visually, not from the accessibility tree).
 */
export function SkillsList({ skills }: { skills: SkillCategory[] }) {
  return (
    <div>
      <div className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((group) => (
          <section key={group.category} className="rounded-ui border border-border bg-panel p-5">
            <h3 className="font-semibold text-foreground">{group.category}</h3>
            <dl className="mt-3 divide-y divide-border">
              {LEVELS.map((level) => {
                const names = group.skills
                  .filter((skill) => skill.level === level)
                  .map((skill) => skill.name);
                return names.length ? (
                  <div key={level} className="py-3 first:pt-0 last:pb-0">
                    <dt className="font-mono text-xs text-muted">{level}</dt>
                    <dd className="mt-1 text-sm leading-6 text-foreground">{names.join(", ")}</dd>
                  </div>
                ) : null;
              })}
            </dl>
          </section>
        ))}
        <p className="text-sm text-muted sm:col-span-2 lg:col-span-3">
          Security practice: CTF challenges in cryptography and forensics.
        </p>
      </div>
    </div>
  );
}
