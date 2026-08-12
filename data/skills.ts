import { SkillCategory } from "@/types";

// NOTE: Levels below are a reasonable starting point based on what's been
// discussed (active NestJS/Next.js/Postgres/Docker use in a current
// internship project). Adjust freely — you know your own comfort level
// better than any default here.

export const skills: SkillCategory[] = [
  {
    category: "Programming Languages",
    skills: [
      { name: "JavaScript", level: "Comfortable" },
      { name: "TypeScript", level: "Comfortable" },
      { name: "PHP", level: "Comfortable" },
      { name: "Python", level: "Intermediate" },
      { name: "Java", level: "Intermediate" },
      { name: "SQL", level: "Comfortable" },
      { name: "C++", level: "Familiar" },
      { name: "C", level: "Familiar" },
    ],
  },
  {
    category: "Frontend",
    skills: [
      { name: "React", level: "Comfortable" },
      { name: "Next.js", level: "Comfortable" },
      { name: "Tailwind CSS", level: "Comfortable" },
      { name: "HTML", level: "Comfortable" },
      { name: "CSS", level: "Comfortable" },
    ],
  },
  {
    category: "Backend",
    skills: [
      { name: "NestJS", level: "Comfortable" },
      { name: "Node.js", level: "Comfortable" },
      { name: "Laravel", level: "Intermediate" },
      { name: "PHP", level: "Comfortable" },
      { name: "REST APIs", level: "Comfortable" },
    ],
  },
  {
    category: "Mobile Development",
    skills: [
      { name: "React Native", level: "Learning" },
      { name: "Expo", level: "Learning" },
    ],
  },
  {
    category: "Database",
    skills: [
      { name: "PostgreSQL", level: "Comfortable" },
      { name: "MySQL", level: "Comfortable" },
      { name: "MariaDB", level: "Familiar" },
    ],
  },
  {
    category: "Tools & Technologies",
    skills: [
      { name: "Git", level: "Comfortable" },
      { name: "GitHub", level: "Comfortable" },
      { name: "Docker", level: "Intermediate" },
      { name: "Linux", level: "Intermediate" },
    ],
  },
];