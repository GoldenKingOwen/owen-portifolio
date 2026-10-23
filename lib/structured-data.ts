import { siteConfig } from "@/data/site-config";
import { skills } from "@/data/skills";
import { absoluteUrl, siteUrl } from "@/lib/site";
import type { Project } from "@/types";

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
  return {
    "@context": "https://schema.org",
    "@type": github ? "SoftwareSourceCode" : "CreativeWork",
    name: project.name,
    url,
    description: project.shortDescription,
    author: { "@id": personId },
    ...(github
      ? { codeRepository: github, programmingLanguage: project.technologies }
      : { keywords: project.technologies.join(", ") }),
  };
}
