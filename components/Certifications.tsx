"use client";

import { useEffect, useRef, useState } from "react";
import { renderPdfFirstPage } from "@/lib/pdf";
import { Certification } from "@/types";

const THUMBNAIL_WIDTH_PX = 200;

export function CertificateThumbnail({
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
