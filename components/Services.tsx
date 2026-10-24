import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";

/**
 * "What I can help with": a ruled list, deliberately not cards. A title and one
 * line per row, no icons. Each row leads to the contact form, so it is a link;
 * on hover a short rule slides in and the text shifts 4px (CSS, pointer devices only).
 * The hairlines are drawn in with scaleX by the motion layer (`data-rule`).
 */
export function Services() {
  return (
    <Section id="services" title="What I can help with" density="tight">
      <ul>
        {services.map((service) => (
          <li key={service.title} data-reveal="" className="relative">
            <span
              data-rule=""
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-px bg-border"
            />
            <a
              href="#contact"
              className="group/row flex min-h-14 items-center justify-between gap-6 py-5"
            >
              <span className="block transition-transform duration-200 ease-out group-hover/row:translate-x-1">
                <span className="block text-lg font-semibold leading-snug text-foreground">
                  {service.title}
                </span>
                <span className="mt-1 block max-w-[60ch] text-sm leading-relaxed text-muted">
                  {service.description}
                </span>
                <span className="sr-only">, get in touch</span>
              </span>
              <span
                aria-hidden="true"
                className="block h-px w-8 shrink-0 origin-right scale-x-0 bg-accent transition-transform duration-300 ease-out group-hover/row:scale-x-100"
              />
            </a>
          </li>
        ))}
      </ul>
      <span data-rule="" aria-hidden="true" className="block h-px bg-border" />
    </Section>
  );
}
