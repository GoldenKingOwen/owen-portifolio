"use client";

import { useRef } from "react";
import { EASE, gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { setNavActive } from "@/lib/nav-active";

const NAV_IDS = ["about", "skills", "projects", "experience", "education", "contact"];

/** Final state, permanently: stop hiding it, drop GSAP's inline styles. */
function markRevealed(els: Element[]) {
  els.forEach((el) => el.setAttribute("data-revealed", ""));
  gsap.set(els, { clearProps: "opacity,visibility,transform" });
}

/**
 * Every animation on the site, in one place. Renders nothing. Server HTML is
 * untouched: content is already in the page, and this only eases it in.
 *
 * Contract with the CSS in globals.css:
 *  - An inline script sets html[data-motion="pending"] before paint, only when
 *    the visitor allows motion. CSS then pre-offsets hero blocks (transform
 *    only, so the LCP element is always painted) and pre-hides below-the-fold
 *    `[data-reveal]` items (opacity + transform).
 *  - This module flips it to "ready" (which cancels the CSS fail-safe) and
 *    animates everything to its final state, then sets `data-revealed`.
 *  - If this module never loads, a CSS fail-safe shows everything after 2.5s.
 */
export default function MotionEffects({ pathname }: { pathname: string }) {
  const previousPath = useRef<string | null>(null);

  // 1. Functional and always on, not decorative: header border state and the
  //    nav scroll-spy. One ScrollTrigger each, no scroll listeners.
  useGSAP(
    () => {
      const t0 = performance.now();
      const header = document.querySelector<HTMLElement>("[data-site-header]");
      ScrollTrigger.create({
        start: 24,
        end: "max",
        onToggle: (self) => header?.setAttribute("data-scrolled", String(self.isActive)),
      });

      let hasSections = false;
      NAV_IDS.forEach((id, i) => {
        const section = document.getElementById(id);
        if (!section) return;
        hasSections = true;
        ScrollTrigger.create({
          trigger: section,
          start: "top 35%",
          end: "bottom 35%",
          onToggle: (self) => {
            if (self.isActive) setNavActive(id);
          },
          onLeaveBack: i === 0 ? () => setNavActive("") : undefined,
        });
      });
      if (!hasSections) setNavActive("");

      // Fonts can change line breaks and so section positions; refresh once they settle.
      if (document.fonts?.status === "loading") document.fonts.ready.then(() => ScrollTrigger.refresh());
      // User Timing marks: visible in DevTools' Performance panel under Timings.
      performance.measure("motion:spy", { start: t0, end: performance.now() });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  // 2. Motion, only when the visitor allows it. No loops, no parallax; opacity
  //    and transform only.
  useGSAP(
    () => {
      const t0 = performance.now();
      const root = document.documentElement;
      const arrivedFrom = previousPath.current;
      previousPath.current = pathname;
      if (!root.hasAttribute("data-motion")) return; // reduced motion or a low-end device: final states stay as rendered

      const mm = gsap.matchMedia();
      mm.add(
        {
          ok: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          small: "(max-width: 768px)",
        },
        (ctx) => {
          const { reduce, small } = ctx.conditions as { reduce: boolean; small: boolean };

          if (reduce) {
            // The preference changed mid-session: show everything now, stop hiding.
            root.removeAttribute("data-motion");
            markRevealed(gsap.utils.toArray<Element>("[data-reveal],[data-hero]"));
            return;
          }

          root.setAttribute("data-motion", "ready");

          // Route change (not the first load): a short fade and slide. Never delays navigation.
          if (arrivedFrom !== null && arrivedFrom !== pathname) {
            const main = document.querySelector("main");
            if (main) {
              gsap.fromTo(
                main,
                { opacity: 0, y: 10 },
                { opacity: 1, y: 0, duration: 0.26, ease: EASE, clearProps: "opacity,transform" }
              );
            }
          }

          // Hero: one timeline. Everything is already painted; these blocks only rise 14px
          // into place (transform only), so the LCP element is never hidden or delayed.
          const hero = gsap.utils.toArray<HTMLElement>('[data-hero]:not([data-revealed])');
          if (hero.length) {
            gsap
              .timeline({ defaults: { ease: EASE }, onComplete: () => markRevealed(hero) })
              .to(hero, { y: 0, duration: 0.6, stagger: 0.06 }, 0);
          }

          // Section reveals: one batched ScrollTrigger group, plays once. Cards, skill
          // groups and experience/education entries all carry [data-reveal].
          const items = gsap.utils.toArray<HTMLElement>("[data-reveal]:not([data-revealed])");
          if (items.length) {
            ScrollTrigger.batch(items, {
              start: small ? "top 92%" : "top 88%",
              once: true,
              batchMax: 6,
              onEnter: (batch) => {
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: small ? 0.45 : 0.6,
                  ease: EASE,
                  stagger: small ? 0.04 : 0.06,
                  overwrite: "auto",
                  onComplete: () => markRevealed(batch),
                });
              },
            });
          }
        }
      );

      performance.measure("motion:init", { start: t0, end: performance.now() });
      return () => mm.revert();
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
