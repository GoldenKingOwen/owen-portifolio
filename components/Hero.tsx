import type { ReactNode } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Magnetic } from "@/components/motion/Magnetic";
import { LocalTime } from "@/components/LocalTime";
import { siteConfig } from "@/data/site-config";
import { experience } from "@/data/experience";
import { education } from "@/data/education";

const current = experience[0];
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
    ? [{ label: "Availability", value: "Open to opportunities" }]
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
      className="pb-14 pt-28 sm:pb-20 sm:pt-36"
    >
      <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:gap-16">
        <div>
          {/* The name stays the largest type on the page. The two spans are split into
              characters and lines by the motion layer (and restored afterwards). */}
          <h1 id="hero-heading" aria-label={`${siteConfig.name}, Full-Stack Software Developer in Malawi`} className="font-semibold text-foreground">
            <span data-hero-split="chars" className="block text-display">
              {siteConfig.name}
            </span>
            <span data-hero-split="lines" className="mt-4 block text-lead font-normal text-muted">
              Full-Stack Software Developer in Malawi
            </span>
          </h1>

          {/* One line, derived from data/: what I am doing now. */}
          <p data-hero="" className="mt-6 max-w-[60ch] text-base leading-relaxed text-foreground">
            <span className="font-medium">Now:</span>
            <span className="text-muted">
              {" "}
              {current.position} at <span className="whitespace-nowrap">{current.organization}</span>
              {studying ? ", studying for a BSc ICT at " + studying.institution : ""}.
            </span>
          </p>

          <p data-hero="" className="mt-4 max-w-[60ch] text-base leading-relaxed text-foreground sm:text-lg">
            {siteConfig.shortBio}
          </p>

          <div data-hero="" className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <Magnetic>
              <a
                href="/cv/OwenCV.pdf"
                download
                className="inline-flex min-h-11 items-center gap-2 rounded-ui bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90"
              >
                <ArrowDown size={16} aria-hidden="true" />
                Download CV
              </a>
            </Magnetic>
            <ExternalLink href={siteConfig.githubUrl} className={textLink}>
              GitHub profile
            </ExternalLink>
            <a href="#contact" className={textLink}>
              Contact
            </a>
          </div>

          <dl data-hero="" className="mt-12 max-w-[60ch] border-t border-border text-sm">
            {facts.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[7rem_1fr] gap-4 border-b border-border py-3"
              >
                <dt className="text-muted">{fact.label}</dt>
                <dd className="text-foreground">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="order-first lg:order-none">
          <div
            data-hero="clip"
            className="relative aspect-[4/5] w-40 overflow-hidden rounded-ui border border-border bg-raised sm:w-56 lg:w-full"
          >
            <Image
              src="/images/owen.jpeg"
              alt="Portrait of Owen Matola, full-stack software developer from Mzuzu, Malawi"
              fill
              priority
              quality={75}
              sizes="(min-width: 1024px) 256px, (min-width: 640px) 224px, 160px"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
