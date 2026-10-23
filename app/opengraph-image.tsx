import { renderOg, ogSize } from "@/lib/og";

export const alt = "Owen Matola — Full-Stack Software Developer in Malawi";
export const size = ogSize;
export const contentType = "image/png";

export default function Image() {
  return renderOg({
    eyebrow: "owen-portifolio.vercel.app",
    title: "Owen Matola",
    subtitle: "Full-Stack Software Developer · Cybersecurity · Mzuzu, Malawi",
  });
}
