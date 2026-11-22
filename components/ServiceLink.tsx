"use client";

export function ServiceLink({ title, children }: { title: string; children: React.ReactNode }) {
  return <a href="#contact" onClick={() => window.dispatchEvent(new CustomEvent("portfolio:service", { detail: { subject: `${title} enquiry` } }))} className="group/row flex min-h-14 items-center justify-between gap-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
    {children}
  </a>;
}
