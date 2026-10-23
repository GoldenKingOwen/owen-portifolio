import { projects } from "@/data/projects";
import { renderOg, ogSize } from "@/lib/og";

export const alt = "Project by Owen Matola";
export const size = ogSize;
export const contentType = "image/png";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  return renderOg({
    eyebrow: "Project · Owen Matola",
    title: project?.name ?? "Project",
    subtitle: project?.technologies.slice(0, 5).join(" · ") ?? "",
  });
}
