"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { Certification } from "@/types";

interface CertificateModalProps {
  certification: Certification;
  onClose: () => void;
}

export function CertificateModal({ certification, onClose }: CertificateModalProps) {
  const prefersReducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
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

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      previouslyFocused?.focus();
    };
  }, [onClose]);

  const titleId = `certificate-modal-title-${certification.file}`;
  const motionProps = prefersReducedMotion
    ? {}
    : { transition: { duration: 0.25, ease: [0.22, 1, 0.36, 1] as const } };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
      initial={prefersReducedMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={prefersReducedMotion ? undefined : { opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.2 }}
    >
      {/* Backdrop — plain div so it's not an extra focusable element */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        initial={prefersReducedMotion ? false : { opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={prefersReducedMotion ? undefined : { opacity: 0, y: 16, scale: 0.98 }}
        {...motionProps}
        className="relative z-10 flex max-h-[90vh] w-full max-w-3xl select-none flex-col overflow-hidden rounded-2xl border border-border bg-background-secondary shadow-2xl"
      >
        <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-4">
          <div>
            <h2
              id={titleId}
              className="font-display text-base font-semibold text-foreground sm:text-lg"
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
            onClick={onClose}
            aria-label="Close certificate viewer"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-surface text-muted transition-colors hover:text-foreground"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
