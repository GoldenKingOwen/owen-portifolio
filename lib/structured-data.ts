import { siteConfig } from "@/data/site-config";
import { skills } from "@/data/skills";
import { absoluteUrl, siteUrl } from "@/lib/site";
import type { Project } from "@/types";

// Real programming languages only. Frameworks, databases, infrastructure and
// markup go to `keywords`, so programmingLanguage never lists "Docker".
const PROGRAMMING_LANGUAGES = new Set([
  "JavaScript",
  "TypeScript",
  "PHP",
  "Python",
  "Java",
  "C",
  "C++",
  "SQL",
]);

export const personId = `${siteUrl}/#person`;
const websiteId = `${siteUrl}/#website`;

export function homeJsonLd() {
  return [
    {
      "@context": "https://schema.org",
      "@type": "Person",
      "@id": personId,
      name: siteConfig.name,
      url: siteUrl,
      image: absoluteUrl("/images/owen.jpeg"),
      jobTitle: "Software Development Intern",
      description: siteConfig.shortBio,
      email: siteConfig.email,
      worksFor: { "@type": "Organization", name: "Infi-Tech" },
      alumniOf: { "@type": "CollegeOrUniversity", name: "Mzuzu University" },
      address: {
        "@type": "PostalAddress",
        addressLocality: "Mzuzu",
        addressCountry: "MW",
      },
      knowsAbout: skills.flatMap((c) => c.skills.map((s) => s.name)),
      sameAs: [siteConfig.githubUrl],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": websiteId,
      name: `${siteConfig.name} — Portfolio`,
      url: siteUrl,
      inLanguage: "en",
      author: { "@id": personId },
      publisher: { "@id": personId },
    },
  ];
}

export function projectJsonLd(project: Project) {
  const url = absoluteUrl(`/projects/${project.slug}`);
  const github = project.links.github;
  const languages = project.technologies.filter((t) => PROGRAMMING_LANGUAGES.has(t));
  const tools = project.technologies.filter((t) => !PROGRAMMING_LANGUAGES.has(t));
  return {
    "@context": "https://schema.org",
    "@type": github ? "SoftwareSourceCode" : "CreativeWork",
    name: project.name,
    url,
    description: project.shortDescription,
    author: { "@id": personId },
    ...(github
      ? {
          codeRepository: github,
          ...(languages.length > 0 ? { programmingLanguage: languages } : {}),
        }
      : {}),
    // Without a repository there is no code to describe, so every technology is a keyword.
    ...((github ? tools : project.technologies).length > 0
      ? { keywords: (github ? tools : project.technologies).join(", ") }
      : {}),
  };
}
