"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { certifications } from "@/data/certifications";
import { cn } from "@/lib/utils";

const PANEL_ID = "certifications-panel";

// The panel (thumbnails, pdf.js, the viewer modal, GSAP) is a separate chunk that is
// only requested when the disclosure is first opened.
const CertificationsPanel = dynamic(() => import("@/components/CertificationsPanel"), {
  ssr: false,
  loading: () => (
    <p role="status" className="mt-3 text-sm text-muted">
      Loading certificates…
    </p>
  ),
});

/**
 * Minor, optional disclosure tucked below the Education entries, not a peer
 * section. Collapsed on every page load; nothing behind it is downloaded
 * until the visitor expands it.
 */
export function Certifications() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-12 border-t border-border pt-4">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={PANEL_ID}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent"
      >
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", expanded && "rotate-180")}
          aria-hidden="true"
        />
        Certifications ({certifications.length})
      </button>

      <div id={PANEL_ID}>{expanded && <CertificationsPanel />}</div>
    </div>
  );
}
