import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown, ArrowRight } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Magnetic } from "@/components/motion/Magnetic";
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

      <div className="relative z-10 mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div>
          {/* The name is split into words and lines by the motion layer (and
              restored afterwards). The mask keeps the reveal clean at any width. */}
          <h1 id="hero-heading" aria-label={`${siteConfig.name}, Full-Stack Software Developer in Malawi`} className="font-semibold text-foreground">
            <span data-hero-split="words" className="block text-display">
              {siteConfig.name}
            </span>
            <span data-hero-split="lines" className="mt-4 block text-lead font-normal text-muted">
              Full-Stack Software Developer in Malawi
            </span>
          </h1>

          <p data-hero="" className="mt-6 max-w-[58ch] text-lead text-foreground [overflow-wrap:anywhere]">
            {siteConfig.tagline}
          </p>

          {/* The one decorative teal rule in the hero, drawn after the name. */}
          <span
            data-hero-accent=""
            aria-hidden="true"
            className="mt-6 block h-px w-24 bg-accent"
          />

          {/* One line, derived from data/: what I am doing now. */}
          <p data-hero="" className="mt-4 max-w-[60ch] text-base leading-relaxed text-foreground [overflow-wrap:anywhere]">
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

          <dl data-hero="" className="mt-12 max-w-[60ch] border-t border-border text-sm">
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

        <div className="order-first lg:order-none">
          <div
            data-hero="clip"
            className="relative aspect-[4/5] w-40 overflow-hidden rounded-ui border border-border bg-raised sm:w-56 lg:w-full"
          >
            <div data-hero-portrait-inner="" className="absolute inset-0">
              <Image
                src="/images/owen.jpeg"
                alt="Portrait of Owen Matola, full-stack software developer based in Malawi"
                fill
                priority
                quality={75}
                sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 160px"
                className="object-cover group-hover:after:opacity-100 group-hover:after:transition-opacity duration-300"
              />
              {/* Subtle glitch effect on hover: RGB channel offset using pseudo-element */}
              <div className="absolute inset-0 pointer-events-none after:content-[''] after:absolute after:inset-0 after:blur-x after:after:filter-[hue-rotate(18deg)] after:after:transform-[translateX(2px)] after:after:transition-all after:duration-300 after:group-hover:transform-[translateX(-2px)] after:after:transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
