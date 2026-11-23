"use client";

import { useEffect, useRef } from "react";
import { ArrowUp } from "lucide-react";

const RADIUS = 17;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Back-to-top with a reading-progress ring. The ring is scroll-linked, not
 * animated on a timer, so it never loops or competes with the page.
 */
export function BackToTop() {
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
        ring.current?.style.setProperty(
          "stroke-dashoffset",
          String(CIRCUMFERENCE * (1 - progress)),
        );
      });
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (window.__portfolioLenis && !reduce) {
      window.__portfolioLenis.scrollTo(0);
      return;
    }
    window.scrollTo({ top: 0, behavior: reduce ? "instant" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Back to top"
      className="back-to-top group relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      <svg viewBox="0 0 40 40" className="absolute h-11 w-11" aria-hidden="true" fill="none">
        <circle cx="20" cy="20" r={RADIUS} className="stroke-border" strokeWidth="1.5" />
        <circle
          ref={ring}
          cx="20"
          cy="20"
          r={RADIUS}
          className="stroke-sun"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={CIRCUMFERENCE}
          transform="rotate(-90 20 20)"
        />
      </svg>
      <ArrowUp
        size={15}
        aria-hidden="true"
        className="relative transition-transform duration-200 group-hover:-translate-y-0.5"
      />
    </button>
  );
}
