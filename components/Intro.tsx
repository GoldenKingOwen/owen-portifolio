"use client";

import { useEffect, useRef } from "react";
import { isIntroPending, markIntroDone } from "@/lib/intro";

/**
 * Animates the server-rendered introduction overlay (components/IntroOverlay).
 *
 * Sequence, roughly 2s in total:
 *   0.00  the name's letters rise out of their masks, one after another
 *   0.35  the accent rule draws across, the role line follows
 *   1.50  the overlay wipes upward off the screen as one deliberate move
 *   1.95  done: html[data-intro] is removed, the hero timeline starts
 *
 * GSAP is loaded dynamically so it stays out of the first chunk; MotionLoader
 * then shares the same cached chunk. If it never loads, the CSS fail-safe in
 * globals.css uncovers the page regardless.
 */
export function Intro() {
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    let cancelled = false;
    let tl: { kill: () => void } | null = null;

    async function play() {
      if (!isIntroPending()) return;

      let gsap: typeof import("@/lib/gsap").gsap;
      let EASE: string;
      try {
        const mod = await import("@/lib/gsap");
        gsap = mod.gsap;
        EASE = mod.EASE;
      } catch {
        markIntroDone();
        return;
      }
      if (cancelled) {
        markIntroDone();
        return;
      }

      const root = document.querySelector<HTMLElement>("[data-intro-root]");
      if (!root) {
        markIntroDone();
        return;
      }

      const letters = Array.from(root.querySelectorAll<HTMLElement>("[data-intro-letter]"));
      const sub = root.querySelector<HTMLElement>("[data-intro-sub]");
      const meta = root.querySelector<HTMLElement>("[data-intro-meta]");
      const rule = root.querySelector<HTMLElement>("[data-intro-rule]");

      gsap.set(letters, { yPercent: 112 });
      gsap.set([sub, meta].filter(Boolean), { opacity: 0 });
      gsap.set(rule, { scaleX: 0, transformOrigin: "left center" });

      const timeline = gsap.timeline({
        defaults: { ease: EASE },
        onComplete: () => {
          markIntroDone();
        },
      });
      tl = timeline;

      timeline
        .to(meta, { opacity: 1, duration: 0.45 }, 0)
        .to(
          letters,
          {
            yPercent: 0,
            duration: 0.85,
            stagger: 0.042,
          },
          0.08
        )
        .to(rule, { scaleX: 1, duration: 0.65 }, 0.42)
        .to(sub, { opacity: 1, y: 0, duration: 0.5 }, 0.5)
        // The whole screen becomes the transition: one upward wipe, no spinner.
        .to(
          root,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.5,
            ease: "power2.inOut",
          },
          1.5
        )
        .to(letters, { yPercent: -40, duration: 0.5, stagger: 0.012 }, 1.5)
        .to(sub, { opacity: 0, duration: 0.3 }, 1.52)
        .to(rule, { opacity: 0, duration: 0.3 }, 1.52)
        .to(meta, { opacity: 0, duration: 0.3 }, 1.52);
    }

    play();

    return () => {
      cancelled = true;
      tl?.kill();
      // A route change mid-sequence must never leave the page covered.
      if (isIntroPending()) markIntroDone();
    };
  }, []);

  return null;
}
