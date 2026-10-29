// "What I can help with": a ruled list, five rows at most. The wording is the
// site's original copy for these five lines, moved into data/. Edit here.
export interface Service {
  title: string;
  description: string;
}

export const services: Service[] = [
  {
    title: "Web Development",
    description: "Building modern, responsive websites and web applications.",
  },
  {
    title: "Full-Stack Development",
    description: "Developing frontend and backend systems with APIs and databases.",
  },
  {
    title: "System Development",
    description: "Designing and implementing information management systems.",
  },
  {
    title: "Database Development",
    description: "Designing relational databases and integrating them with applications.",
  },
  {
    title: "Technical Consulting",
    description: "Helping organizations identify and implement appropriate technology solutions.",
  },
];
