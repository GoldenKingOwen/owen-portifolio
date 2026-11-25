import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { HeroRoleLine } from "@/components/HeroRoleLine";
import { LocalTime } from "@/components/LocalTime";
import { siteConfig } from "@/data/site-config";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

const current = experience[0];
const studying = education.find((e) => e.endYear === "Jan 2027");

// Facts are derived from data/, so the first screen stays true as it changes.
const facts: { label: string; value: ReactNode }[] = [
  {
    label: "Based",
    value: (
      <>
        {siteConfig.location}
        <LocalTime />
      </>
    ),
  },
  { label: "Working with", value: current.technologies.slice(0, 6).join(", ") },
  ...(siteConfig.availableForOpportunities
    ? [
        {
          label: "Availability",
          value: (
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="relative flex h-1.5 w-1.5 shrink-0">
                <span className="availability-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              {siteConfig.availabilityLabel}
            </span>
          ),
        },
      ]
    : []),
];

const textLink =
  "inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent";

export function Hero() {
  return (
    <section
      id="home"
      aria-labelledby="hero-heading"
      data-section="home"
      className="relative isolate overflow-hidden pb-14 pt-28 sm:pb-20 sm:pt-36"
    >
      {/* SVG grade for the portrait window; hover reveals the original colour. */}
      <svg className="sr-only" aria-hidden="true" focusable="false">
        <filter id="portrait-duotone">
          <feColorMatrix type="matrix" values=".22 .62 .16 0 0 .22 .62 .16 0 0 .22 .62 .16 0 0 0 0 0 1 0" />
          <feComponentTransfer><feFuncR type="table" tableValues=".04 .95" /><feFuncG type="table" tableValues=".09 .72" /><feFuncB type="table" tableValues=".10 .45" /></feComponentTransfer>
        </filter>
      </svg>

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          {/* The text column sits above the portrait's faded margin, so the type
              and the photograph share the same space instead of neighbouring it. */}
          <div className="relative z-10">
            {/* The name is split into words and lines by the motion layer (and
                restored afterwards). The mask keeps the reveal clean at any width. */}
            <h1
              id="hero-heading"
              aria-label={siteConfig.name}
              className="font-semibold text-foreground"
            >
              <span data-hero-split="chars" className="hero-name-line block text-display">OWEN</span>
              <span data-hero-split="chars" className="hero-name-line block text-display">MATOLA</span>
              <span data-hero-split="lines" className="mt-4 block text-lead font-normal text-muted">
                Full-Stack Software Developer in Malawi
              </span>
            </h1>

            <HeroRoleLine />

            <p data-hero="" className="mt-6 max-w-[52ch] text-lead text-foreground [overflow-wrap:anywhere]">
              {siteConfig.tagline}
            </p>
            <p className="mt-4 max-w-[65ch] text-base leading-relaxed text-muted [overflow-wrap:anywhere]">
              {siteConfig.objective}
            </p>

            {/* The one decorative teal rule in the hero, drawn after the name. */}
            <span
              data-hero-accent=""
              aria-hidden="true"
              className="mt-6 block h-px w-24 bg-accent"
            />

            {/* One line, derived from data/: what I am doing now. */}
            <p
              data-hero=""
              className="mt-4 max-w-[56ch] text-base leading-relaxed text-foreground [overflow-wrap:anywhere]"
            >
              <span className="font-medium">Recent:</span>
              <span className="text-muted">
                {" "}
                {current.position} at <span className="whitespace-nowrap">{current.organization}</span>
                {studying ? ", studying for a BSc ICT at " + studying.institution : ""}.
              </span>
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
              <span data-hero-cta="" className="inline-flex">
                <Magnetic>
                  <a
                    href="#projects"
                    className="group inline-flex min-h-11 items-center gap-2 rounded-ui bg-accent px-5 text-sm font-medium text-accent-ink transition-[opacity,transform] duration-200 hover:opacity-90 active:scale-[0.98] active:opacity-80"
                  >
                    Explore my work
                    <ArrowRight
                      size={16}
                      aria-hidden="true"
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </a>
                </Magnetic>
              </span>
              <a
                data-hero-cta=""
                href="/cv/Owen-Matola-CV.pdf"
                download
                className="inline-flex min-h-11 items-center gap-2 rounded-ui border border-field px-5 text-sm font-medium text-foreground transition-[color,background-color,transform] duration-200 hover:bg-raised active:scale-[0.98] active:bg-raised-hover"
              >
                <ArrowDown size={16} aria-hidden="true" />
                Download CV
              </a>
              <span data-hero-cta="" className="inline-flex">
                <ExternalLink href={siteConfig.githubUrl} className={textLink}>
                  GitHub profile
                </ExternalLink>
              </span>
              <a data-hero-cta="" href="#contact" className={textLink}>
                Contact
              </a>
            </div>

            <dl data-hero="" className="mt-12 max-w-[56ch] border-t border-border text-sm lg:max-w-[38rem]">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="grid grid-cols-1 gap-1 border-b border-border py-3 sm:grid-cols-[7rem_1fr] sm:gap-4"
                >
                  <dt className="text-muted">{fact.label}</dt>
                  <dd className="text-foreground [overflow-wrap:anywhere]">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Portrait: large, bled slightly left into the text column, its left
              and bottom edges dissolving into the page. The offset hairline
              frame and the corner tick give it depth without a second box. */}
          <figure className="portrait-figure order-first m-0 lg:order-none lg:-ml-32 lg:w-[24rem]">
            <span data-hero-sun="" aria-hidden="true" className="hero-sun" />
            <div data-hero="clip" data-portrait-tilt="" data-cursor="media" className="portrait-window group relative aspect-[4/5] w-44 overflow-hidden rounded-t-[999px] border border-border sm:w-56 lg:w-full">
              <span
                aria-hidden="true"
                className="absolute -left-1 -top-1 hidden h-3 w-3 border-l-2 border-t-2 border-accent lg:block"
              />
              <div data-hero-portrait-inner="" className="relative h-full w-full">
                <Image
                  src="/images/owen.jpeg"
                  alt="Portrait of Owen Matola, full-stack software developer based in Malawi"
                  fill
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 224px, 176px"
                  priority
                  className="hero-plate hero-portrait-image portrait-duotone object-cover object-top"
                />
              </div>
            </div>
            <figcaption className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-3 font-mono text-[0.6875rem] uppercase tracking-[0.12em] text-muted">
              <span>Owen Matola</span>
              <span className="tabular">13.97°S 33.79°E</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
