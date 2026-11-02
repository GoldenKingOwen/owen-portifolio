// "What I can help with": a ruled list, five rows at most. The wording is the
// site's original copy for these five lines, moved into data/. Edit here.
export interface Service {
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Web Development",
    description:
      "Responsive websites and web applications built with React, Next.js and Tailwind, from layout through deployment.",
  },
  {
    title: "Full-Stack Development",
    description:
      "APIs, relational databases and frontends designed together, with typed contracts and clear service boundaries.",
  },
  {
    title: "System Development",
    description:
      "Information management systems for real workflows: requirements, data models, and a maintainable implementation.",
  },
  {
    title: "Database Development",
    description:
      "Relational schemas, queries and migrations designed for data integrity and straightforward reporting.",
  },
  {
    title: "Technical Consulting",
    description:
      "Practical guidance on choosing tooling and shaping architecture, with security trade-offs made explicit.",
  },
];
