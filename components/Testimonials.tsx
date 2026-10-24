import { Section } from "@/components/ui/Section";
import { testimonials } from "@/data/testimonials";

/**
 * Hidden when there is nothing to show: with an empty list it renders no markup
 * at all, so there is no empty heading and no placeholder. Quotes are plain prose
 * with a source line, never cards, so this section stays visually distinct.
 */
export function Testimonials() {
  if (testimonials.length === 0) return null;

  return (
    <Section id="testimonials" title="Kind words">
      <ul className="space-y-10">
        {testimonials.map((t) => (
          <li key={`${t.name}-${t.organization}`} data-reveal="">
            <blockquote className="max-w-[60ch] text-lead text-foreground">{t.quote}</blockquote>
            <p className="mt-3 text-sm text-muted">
              {t.name}, {t.role}, {t.organization}
            </p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
