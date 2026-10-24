"use client";

import type { RefObject } from "react";
import { EASE, gsap, useGSAP } from "@/lib/gsap";

/**
 * Staggers children of a client component in when `when` becomes true.
 * Scoped to `scope` (selectors resolve inside it), and every tween is reverted
 * automatically on unmount or when the dependencies change. Opacity and
 * transform only, and nothing runs when the visitor prefers reduced motion.
 */
export function useGsapReveal(
  scope: RefObject<HTMLElement | null>,
  selector: string,
  { when = true, stagger = 0.04, y = 8 }: { when?: boolean; stagger?: number; y?: number } = {}
) {
  useGSAP(
    () => {
      if (!when) return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(selector, {
          opacity: 0,
          y,
          duration: 0.3,
          ease: EASE,
          stagger,
          clearProps: "opacity,transform",
        });
      });
      return () => mm.revert();
    },
    { scope, dependencies: [when] }
  );
}
