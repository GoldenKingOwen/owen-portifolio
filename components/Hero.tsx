import type { ReactNode } from "react";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { GlitchImage } from "@/components/motion/GlitchImage";
import { LocalTime } from "@/components/LocalTime";
import { siteConfig } from "@/data/site-config";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

const current = experience.find((job) => job.endDate === "Present") ?? experience[0];
const studying = education.find((e) => e.endYear === "In Progress");

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
                <span className="availability-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Open to opportunities
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
      {/* A restrained technical motif: a slow grid and a small connected-node
          constellation. Decorative only; GSAP pauses it when the hero leaves view. */}
      <div
        data-hero-ambient=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div data-hero-ambient-grid="" className="hero-ambient-grid absolute -inset-[20%]" />
        <svg
          className="absolute inset-0 h-full w-full text-border"
          viewBox="0 0 600 500"
          preserveAspectRatio="xMidYMid slice"
          fill="none"
        >
          <g stroke="currentColor" strokeWidth="0.6" opacity="0.5">
            <path d="M80 120 L210 90 L340 150 L470 110" />
            <path d="M120 300 L260 260 L400 320 L520 270" />
            <path d="M210 90 L260 260" />
            <path d="M340 150 L400 320" />
            <path d="M470 110 L520 270" />
          </g>
          <g fill="currentColor" className="text-accent">
            <circle className="hero-node" cx="210" cy="90" r="2.2" />
            <circle className="hero-node" cx="340" cy="150" r="1.6" />
            <circle className="hero-node" cx="260" cy="260" r="2" />
            <circle className="hero-node" cx="400" cy="320" r="1.6" />
          </g>
        </svg>
      </div>

      {/* A single pool of light behind the portrait, so the photograph reads as
          lit from the page rather than pasted onto it. */}
      <div aria-hidden="true" className="hero-pool pointer-events-none absolute inset-0 -z-10" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          {/* The text column sits above the portrait's faded margin, so the type
              and the photograph share the same space instead of neighbouring it. */}
          <div className="relative z-10">
            {/* The name is split into words and lines by the motion layer (and
                restored afterwards). The mask keeps the reveal clean at any width. */}
            <h1
              id="hero-heading"
              aria-label={`${siteConfig.name}, Full-Stack Software Developer in Malawi`}
              className="font-semibold text-foreground"
            >
              <span data-hero-split="words" className="block text-display">
                {siteConfig.name}
              </span>
              <span data-hero-split="lines" className="mt-4 block text-lead font-normal text-muted">
                Full-Stack Software Developer in Malawi
              </span>
            </h1>

            <p data-hero="" className="mt-6 max-w-[52ch] text-lead text-foreground [overflow-wrap:anywhere]">
              {siteConfig.tagline}
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
              <span className="font-medium">Now:</span>
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
                href="/cv/OwenCV.pdf"
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
          <figure className="order-first m-0 lg:order-none lg:-ml-32 lg:w-[24rem]">
            <div data-hero="clip" className="relative">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 hidden translate-x-3 translate-y-3 rounded-ui border border-border lg:block"
              />
              <span
                aria-hidden="true"
                className="absolute -left-1 -top-1 hidden h-3 w-3 border-l-2 border-t-2 border-accent lg:block"
              />
              <div data-hero-portrait-inner="" className="relative">
                <GlitchImage
                  src="/images/owen.jpeg"
                  alt="Portrait of Owen Matola, full-stack software developer based in Malawi"
                  sizes="(min-width: 1024px) 384px, (min-width: 640px) 224px, 176px"
                  priority
                  className="hero-plate plate-fade aspect-[4/5] w-44 border border-border sm:w-56 lg:w-full"
                />
              </div>
            </div>
            <figcaption className="mt-4 hidden items-center justify-between gap-4 border-t border-border pt-3 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-muted lg:flex">
              <span>Owen Matola</span>
              <span className="tabular">13.97°S / 33.79°E</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
