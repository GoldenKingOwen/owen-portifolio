import { Section } from "@/components/ui/Section";
import { education } from "@/data/education";

const earliestStartYear = Math.min(...education.map((e) => Number(e.startYear)));
const currentProgram = education.find((e) => e.endYear === "In Progress");

export function About() {
  return (
    <Section id="about" title="About">
      <div className="max-w-[65ch] space-y-5 text-base leading-relaxed text-foreground">
        <p className="text-lead">
          I&apos;m an ICT student at <strong className="font-semibold">Mzuzu University</strong>,
          currently pursuing a Bachelor of Science in Information and Communication Technology.
          Before that, I completed diplomas in Computing and Information Systems (Levels 4 and 5)
          through the University of Malawi under ABMA.
        </p>
        <p>
          My academic and project work spans full-stack web development — building with React,
          Next.js, NestJS, and Laravel — alongside a growing interest in{" "}
          <strong className="font-semibold">cybersecurity</strong>, where I work through CTF
          challenges across cryptography and forensics to sharpen how I think about security at
          the system level, not just the application layer.
        </p>
        <p>
          I&apos;m currently interning as a software developer, building a multi-tenant feedback
          and support portal from the ground up — a NestJS microservices backend behind an
          authenticated API gateway, paired with Next.js frontends. It&apos;s given me hands-on
          experience with the kind of architecture decisions (tenant isolation, event-driven
          services, secure auth) that don&apos;t come up in coursework alone.
        </p>
        <p>
          I care about building software that&apos;s secure and maintainable by default, not as an
          afterthought — clear boundaries between services, data that&apos;s scoped correctly from
          the start, and code that the next person (often future me) can actually follow. Longer
          term, I want to keep deepening both sides of that: shipping full-stack products and
          understanding how to break and defend them.
        </p>
      </div>

      <dl className="mt-10 max-w-[65ch] border-t border-border text-sm">
        <div className="grid grid-cols-[11rem_1fr] gap-4 border-b border-border py-3">
          <dt className="text-muted">Studying computing since</dt>
          <dd className="tabular font-mono text-foreground">{earliestStartYear}</dd>
        </div>
        {currentProgram && (
          <div className="grid grid-cols-[11rem_1fr] gap-4 border-b border-border py-3">
            <dt className="text-muted">Current programme</dt>
            <dd className="text-foreground">BSc ICT, in progress</dd>
          </div>
        )}
      </dl>
    </Section>
  );
}
