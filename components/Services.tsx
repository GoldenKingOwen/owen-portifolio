import { Code2, Layers, Server, Database, Lightbulb } from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";

const SERVICES = [
  {
    icon: Code2,
    title: "Web Development",
    description: "Building modern, responsive websites and web applications.",
  },
  {
    icon: Layers,
    title: "Full-Stack Development",
    description: "Developing frontend and backend systems with APIs and databases.",
  },
  {
    icon: Server,
    title: "System Development",
    description: "Designing and implementing information management systems.",
  },
  {
    icon: Database,
    title: "Database Development",
    description: "Designing relational databases and integrating them with applications.",
  },
  {
    icon: Lightbulb,
    title: "Technical Consulting",
    description: "Helping organizations identify and implement appropriate technology solutions.",
  },
];

export function Services() {
  return (
    <section id="services" aria-labelledby="services-heading" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading path="services" title="What I Can Help With" />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-accent-violet/30 bg-accent-violet/10">
                <Icon size={18} className="text-accent-violet" aria-hidden="true" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold text-foreground">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}