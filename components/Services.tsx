import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { services } from "@/data/services";
import { ServiceLink } from "@/components/ServiceLink";

/**
 * "What I can help with": editorial rows, not cards. Each row is one link to the
 * contact form, numbered like a plate, with the description expanding when the
 * row is hovered or focused. On touch layouts the description is simply open.
 * The hairlines are drawn in by the motion layer (`data-rule`).
 */
export function Services() {
  return (
    <Section id="services" title="What I can help with" density="tight">
      <ul>
        {services.map((service, index) => (
          <li key={service.title} data-reveal="" className="service-row group/row relative">
            <span
              data-rule=""
              aria-hidden="true"
              className="absolute inset-x-0 top-0 block h-px bg-border"
            />
            <ServiceLink title={service.title}>
              <span className="grid w-full grid-cols-[2rem_minmax(0,1fr)_auto] items-start gap-3 py-5 sm:gap-6 sm:py-6">
                <span aria-hidden="true" className="tabular pt-1.5 font-mono text-xs text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="min-w-0">
                  <span className="block font-display text-[clamp(1.5rem,3.2vw,2.5rem)] font-semibold leading-[1.1] tracking-tight text-foreground transition-transform duration-300 ease-out group-hover/row:translate-x-1">
                    {service.title}
                  </span>
                  <span className="service-desc">
                    <span>
                      <span className="block max-w-[60ch] pt-2 text-sm leading-relaxed text-muted">
                        {service.description}
                      </span>
                    </span>
                  </span>
                  <span className="sr-only">, get in touch</span>
                </span>
                <span
                  aria-hidden="true"
                  className="service-arrow mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border text-foreground"
                >
                  <ArrowRight size={15} />
                </span>
              </span>
            </ServiceLink>
          </li>
        ))}
      </ul>
      <span data-rule="" aria-hidden="true" className="block h-px bg-border" />
    </Section>
  );
}
