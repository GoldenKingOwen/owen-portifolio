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
      Loading certificates...
    </p>
  ),
});

/**
 * Minor, optional disclosure tucked below the Education entries, not a peer
 * section. Collapsed on every page load; nothing behind it is downloaded
 * until the visitor expands it.
 *
 * Open/close is a grid-row transition (0fr to 1fr), so it animates without a
 * height measurement and still works while the lazy panel is loading. The
 * collapsed panel is inert, so its links and buttons leave the tab order.
 */
export function Certifications() {
  const [expanded, setExpanded] = useState(false);
  const [mounted, setMounted] = useState(false);

  function toggle() {
    if (!expanded) setMounted(true);
    setExpanded((value) => !value);
  }

  return (
    <div className="mt-12 border-t border-border pt-4">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        aria-controls={PANEL_ID}
        className="inline-flex min-h-11 items-center gap-1.5 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 transition-colors hover:decoration-accent active:opacity-80"
      >
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-300", expanded && "rotate-180")}
          aria-hidden="true"
        />
        Certifications ({certifications.length})
      </button>

      <div
        id={PANEL_ID}
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        )}
        inert={!expanded}
        aria-hidden={!expanded}
      >
        <div className="min-h-0 overflow-hidden">{mounted && <CertificationsPanel />}</div>
      </div>
    </div>
  );
}
