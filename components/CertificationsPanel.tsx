"use client";

import { useEffect, useRef, useState } from "react";
import { CertificateModal } from "@/components/CertificateModal";
import { certifications } from "@/data/certifications";
import { renderPdfFirstPage } from "@/lib/pdf";
import { useGsapReveal } from "@/lib/use-gsap-reveal";
import { Certification } from "@/types";

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
      data-thumb=""
      className="group flex flex-col gap-2 rounded-ui border border-border bg-raised p-2 text-left transition-colors duration-150 hover:border-field hover:bg-raised-hover"
    >
      <div
        className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-ui border border-border bg-raised"
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
          <div className="absolute inset-0 flex items-center justify-center px-2 text-center text-xs text-muted">
            Preview unavailable
          </div>
        )}
      </div>
      <span className="line-clamp-2 text-xs font-medium text-foreground group-hover:underline">
        {certification.title}
      </span>
    </button>
  );
}

/**
 * The expanded certificates: a thumbnail grid and the viewer modal. This file (and
 * with it pdf.js and GSAP) is not downloaded until the disclosure is opened.
 */
export default function CertificationsPanel() {
  const [selected, setSelected] = useState<Certification | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  // Thumbnails ease in one after another. Opacity and transform only: animating the
  // panel height would force layout on every frame, so the panel itself appears instantly.
  useGsapReveal(panelRef, "[data-thumb]", { stagger: 0.03 });

  return (
    <div ref={panelRef} className="mt-3">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {certifications.map((cert) => (
          <CertificateThumbnail
            key={cert.file}
            certification={cert}
            onOpen={() => setSelected(cert)}
          />
        ))}
      </div>

      {selected && (
        <CertificateModal certification={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
