"use client";

import dynamic from "next/dynamic";

// The certificates disclosure pulls in framer-motion and pdf.js. Load it after
// the page is interactive so it never competes with the first paint.
const Certifications = dynamic(
  () => import("@/components/Certifications").then((m) => m.Certifications),
  { ssr: false }
);

export function CertificationsLazy() {
  return <Certifications />;
}
