import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { projects } from "@/data/projects";
import { skills } from "@/data/skills";
import { education } from "@/data/education";
import { siteConfig } from "@/data/site-config";

interface Stat {
  label: string;
  value: string;
  /** Optional second line, rendered smaller below the value. */
  sub?: string;
}

// Derived from real data files rather than hand-typed numbers, so
// these stay accurate as projects/skills are added or removed.
const totalTechnologies = new Set(skills.flatMap((c) => c.skills.map((s) => s.name))).size;
const currentProgram = education.find((e) => e.endYear === "In Progress");

const stats: Stat[] = [
  { label: "Projects Completed", value: String(projects.length) },
  { label: "Technologies", value: `${totalTechnologies}+` },
  // TODO: replace with a real count once you know how long you've been building.
  { label: "Years Building", value: "—" },
  {
    label: "Current Academic Level",
    value: currentProgram ? "BSc ICT" : "—",
    sub: currentProgram ? "(In Progress)" : undefined,
  },
];

export function About() {
  return (
    <section id="about" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          path="about"
          title="About Me"
          description="A bit about my background, how I think about building software, and what I'm working toward."
        />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6 text-base leading-relaxed text-muted">
            <p>
              I&apos;m an ICT student at{" "}
              <span className="text-foreground">Mzuzu University</span>, currently pursuing a
              Bachelor of Science in Information and Communication Technology. Before that, I
              completed diplomas in Computing and Information Systems (Levels 4 and 5) through
              the University of Malawi under ABMA.
            </p>
            <p>
              My academic and project work spans full-stack web development — building with
              React, Next.js, NestJS, and Laravel — alongside a growing interest in{" "}
              <span className="text-foreground">cybersecurity</span>, where I work through CTF
              challenges across cryptography and forensics to sharpen how I think about security
              at the system level, not just the application layer.
            </p>
            <p>
              I&apos;m currently interning as a software developer, building a multi-tenant
              feedback and support portal from the ground up — a NestJS microservices backend
              behind an authenticated API gateway, paired with Next.js frontends. It&apos;s given
              me hands-on experience with the kind of architecture decisions (tenant isolation,
              event-driven services, secure auth) that don&apos;t come up in coursework alone.
            </p>
            <p>
              {/* TODO: personalize this paragraph — philosophy/goals are yours to define */}
              I care about building software that&apos;s secure and maintainable by default, not
              as an afterthought — clear boundaries between services, data that&apos;s scoped
              correctly from the start, and code that the next person (often future me) can
              actually follow. Longer term, I want to keep deepening both sides of that: shipping
              full-stack products and understanding how to break and defend them.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border">
              <Image
                src="/images/king.jpeg"
                alt={siteConfig.name}
                fill
                sizes="(min-width: 1024px) 400px, 100vw"
                className="object-cover"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="p-5">
                  <p className="break-words font-display text-2xl font-semibold leading-tight text-foreground sm:text-3xl">
                    {stat.value}
                  </p>
                  {stat.sub && (
                    <p className="mt-0.5 text-sm font-medium leading-tight text-foreground sm:text-lg">
                      {stat.sub}
                    </p>
                  )}
                  <p className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}