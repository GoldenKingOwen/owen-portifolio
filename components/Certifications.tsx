"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { CertificateModal } from "@/components/CertificateModal";
import { certifications } from "@/data/certifications";
import { renderPdfFirstPage } from "@/lib/pdf";
import { cn } from "@/lib/utils";
import { Certification } from "@/types";

const PANEL_ID = "certifications-panel";
const THUMBNAIL_WIDTH_PX = 200;

function CertificateThumbnail({
  certification,
  onOpen,
}: {
  certification: Certification;
  onOpen: () => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = new AbortController();
    setStatus("loading");
    renderPdfFirstPage(
      `/certifications/${certification.file}`,
      canvas,
      THUMBNAIL_WIDTH_PX,
      controller.signal
    )
      .then(() => setStatus("ready"))
      .catch(() => {
        if (!controller.signal.aborted) setStatus("error");
      });
    return () => controller.abort();
  }, [certification.file]);

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex flex-col gap-2 rounded-lg border border-border bg-surface p-2 text-left transition-colors hover:border-accent-violet/40"
    >
      <div
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-md border border-border bg-background-secondary"
        onContextMenu={(e) => e.preventDefault()}
      >
        <canvas
          ref={canvasRef}
          draggable={false}
          className="absolute inset-0 h-full w-full select-none object-contain"
          aria-hidden="true"
        />
        {status === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-muted border-t-transparent"
              aria-hidden="true"
            />
          </div>
        )}
        {status === "error" && (
          <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-[10px] text-muted">
            Preview unavailable
          </div>
        )}
      </div>
      <span className="line-clamp-2 text-xs font-medium text-foreground group-hover:text-accent-violet">
        {certification.title}
      </span>
    </button>
  );
}

/**
 * Minor, optional disclosure tucked below the Education timeline — not a
 * peer section. Collapsed on every page load; the thumbnail grid (and the
 * PDFs behind it) only loads once the user expands it.
 */
export function Certifications() {
  const [expanded, setExpanded] = useState(false);
  const [selected, setSelected] = useState<Certification | null>(null);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="mt-10">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        aria-controls={PANEL_ID}
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
      >
        <ChevronDown
          size={14}
          className={cn("transition-transform duration-200", expanded && "rotate-180")}
          aria-hidden="true"
        />
        Certifications ({certifications.length})
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            id={PANEL_ID}
            key="panel"
            initial={prefersReducedMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={prefersReducedMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: prefersReducedMotion ? 0 : 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <Card className="mt-3 p-4">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {certifications.map((cert) => (
                  <CertificateThumbnail
                    key={cert.file}
                    certification={cert}
                    onOpen={() => setSelected(cert)}
                  />
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selected && (
          <CertificateModal certification={selected} onClose={() => setSelected(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
