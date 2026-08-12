import { Experience } from "@/types";

export const experience: Experience[] = [
  {
    position: "Software Development Intern",
    organization: "Infi-Tech",
    location: "Malawi",
    startDate: "Aug 2026",
    endDate: "Present",
    description:
      "Three-month internship (BICT 4706, Mzuzu University) building a multi-tenant client feedback & support portal SaaS as the core assessment project — a NestJS microservices backend with two Next.js frontends.",
    technologies: [
      "NestJS",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Redis",
      "RabbitMQ",
      "Docker",
      "JWT",
      "Prisma",
    ],
    responsibilities: [
      "Designed and implemented subdomain-based multi-tenant routing",
      "Built domain services (identity, tenant, ticket, feedback, notification) behind an authenticated API gateway",
      "Implemented event-driven projections between services using RabbitMQ outbox/inbox patterns",
      "Applied JWT-based auth with tenant-scoped authorization and secure refresh-token handling",
      "Submitted weekly progress reports following the university's internship evaluation framework",
    ],
  },
  {
    position: "Temporary Data Entry Clerk",
    organization: "World Vision Malawi",
    location: "Malawi",
    startDate: "2023",
    endDate: "2023",
    description:
      "Supported project teams by digitizing and verifying field data for accuracy.",
    technologies: ["Microsoft Excel", "Data Cleaning"],
    responsibilities: [
      "Transferred data from paper formats into digital systems",
      "Conducted data cleaning and verification",
      "Supported project teams with accurate data management",
    ],
  },
  {
    position: "Temporary Data Entry Clerk",
    organization: "Malawi National Examinations Board (MANEB)",
    location: "Malawi",
    startDate: "2022",
    endDate: "2022",
    description:
      "Digitized examination records supplied directly by supervisors and examiners.",
    technologies: ["Microsoft Excel", "Data Entry"],
    responsibilities: [
      "Transferred examination data from paper formats into computer files",
      "Typed in data provided directly from supervisors and/or examiners",
      "Created spreadsheets handling large volumes of figures and data without errors",
    ],
  },
];