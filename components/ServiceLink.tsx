"use client";

export function ServiceLink({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <a
      href="#contact"
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent("portfolio:service", { detail: { subject: `${title} enquiry` } }),
        )
      }
      className="group/row block min-h-14 py-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </a>
  );
}
