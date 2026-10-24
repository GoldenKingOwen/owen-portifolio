"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { renderPdfFirstPage } from "@/lib/pdf";
import { EASE, gsap, useGSAP } from "@/lib/gsap";
import { Certification } from "@/types";

interface CertificateModalProps {
  certification: Certification;
  onClose: () => void;
}

const MODAL_WIDTH_PX = 720;

/**
 * View-only certificate viewer — a deterrent, not a guarantee. Nothing here
 * stops a screenshot. It only removes the *easy* download paths: the PDF is
 * fetched as bytes and rasterized onto a <canvas> (never exposed as an
 * <img src> or <a href> that could be right-clicked or copied from
 * devtools), the context menu is blocked, and text/selection is disabled.
 */
export function CertificateModal({ certification, onClose }: CertificateModalProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  // Enter: the scrim fades in and the dialog rises into place (opacity and transform only).
  // Exit: the same, reversed, and only then is the modal unmounted. Reduced motion skips both.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(rootRef.current, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: EASE });
        gsap.fromTo(
          dialogRef.current,
          { y: 24, scale: 0.97 },
          { y: 0, scale: 1, duration: 0.25, ease: EASE }
        );
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;
    const root = rootRef.current;
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      onClose();
      return;
    }
    gsap.to(dialogRef.current, { y: 12, scale: 0.98, duration: 0.18, ease: "power2.in" });
    gsap.to(root, { opacity: 0, duration: 0.18, ease: "power2.in", onComplete: onClose });
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const controller = new AbortController();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        requestClose();
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    const canvas = canvasRef.current;
    if (canvas) {
      setStatus("loading");
      renderPdfFirstPage(
        `/certifications/${certification.file}`,
        canvas,
        MODAL_WIDTH_PX,
        controller.signal
      )
        .then(() => setStatus("ready"))
        .catch(() => {
          if (!controller.signal.aborted) setStatus("error");
        });
    }

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
      controller.abort();
    };
  }, [certification.file, requestClose]);

  const titleId = `certificate-modal-title-${certification.file}`;
  return (
    <div ref={rootRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop — plain div so it's not an extra focusable element */}
      <div
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-black/60"
      />

      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl select-none flex-col overflow-hidden rounded-ui border border-border bg-background"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2
              id={titleId}
              className="text-base font-semibold text-foreground sm:text-lg"
            >
              {certification.title}
            </h2>
            <p className="mt-0.5 text-xs text-muted">
              {certification.issuer} · {certification.date}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={requestClose}
            aria-label="Close certificate viewer"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-ui border border-border text-foreground transition-colors hover:bg-raised"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <div
          className="flex flex-1 items-center justify-center overflow-auto bg-background p-4 sm:p-6"
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className="relative w-full max-w-2xl">
            <canvas
              ref={canvasRef}
              draggable={false}
              className="block w-full select-none rounded-ui border border-border"
            />
            {status === "loading" && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span
                  className="h-6 w-6 animate-spin rounded-full border-2 border-muted border-t-transparent"
                  aria-hidden="true"
                />
              </div>
            )}
            {status === "error" && (
              <div className="absolute inset-0 flex items-center justify-center px-4 text-center text-sm text-muted">
                Couldn&apos;t load this certificate. Please try again later.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
