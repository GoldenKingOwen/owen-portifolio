"use client";

import { useRef } from "react";
import { EASE, gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { setNavActive } from "@/lib/nav-active";

const NAV_IDS = ["about", "skills", "projects", "experience", "education", "contact"];
const MAX_SCRUB_WORDS = 120;

/** Final state, permanently: stop hiding it, drop GSAP's inline styles. */
function markRevealed(els: Element[]) {
  els.forEach((el) => el.setAttribute("data-revealed", ""));
  gsap.set(els, { clearProps: "opacity,visibility,transform,clipPath" });
}

/** Which cursor state the element under the pointer asks for. */
function cursorState(target: Element | null): "default" | "link" | "view" | "text" {
  if (!target) return "default";
  if (target.closest("input,textarea,select,[contenteditable]")) return "text";
  const interactive = target.closest("a,button,summary,[role='button']");
  // A project card's stretched title link covers the whole card: that is "view", not "link".
  if (interactive && !interactive.classList.contains("card-link")) return "link";
  if (target.closest('[data-cursor="view"]')) return "view";
  return interactive ? "link" : "default";
}

/**
 * Every animation on the site, in one place. Renders nothing. Server HTML is
 * untouched: content is already in the page, and this only eases it in.
 *
 * Contract with the CSS in globals.css:
 *  - An inline script sets html[data-motion="pending"] before paint, only when the
 *    visitor allows motion. CSS then pre-positions: hero blocks (a small transform
 *    offset, and a small clip-path inset on the portrait, so the LCP element is
 *    always painted) and below-the-fold items (opacity and transform).
 *  - This module flips it to "ready" (which cancels the CSS fail-safe), animates
 *    everything to its final state, then sets `data-revealed`.
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
      performance.measure("motion:spy", { start: t0, end: performance.now() });
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  // 2. Motion, only when the visitor allows it. No loops, no parallax; opacity,
  //    transform and paint-only clip-path / stroke drawing.
  useGSAP(
    () => {
      const t0 = performance.now();
      const root = document.documentElement;
      const arrivedFrom = previousPath.current;
      previousPath.current = pathname;
      if (!root.hasAttribute("data-motion")) return; // reduced motion or a low-end device: final states stay as rendered

      let cancelled = false;
      const mm = gsap.matchMedia();
      mm.add(
        {
          ok: "(prefers-reduced-motion: no-preference)",
          reduce: "(prefers-reduced-motion: reduce)",
          small: "(max-width: 768px)",
          fine: "(hover: hover) and (pointer: fine)",
        },
        (ctx) => {
          const { reduce, small, fine } = ctx.conditions as { reduce: boolean; small: boolean; fine: boolean };

          if (reduce) {
            // The preference changed mid-session: show everything now, stop hiding.
            root.removeAttribute("data-motion");
            markRevealed(
              gsap.utils.toArray<Element>(
                "[data-reveal],[data-hero],[data-rule],[data-node],[data-timeline-rail],[data-draw],[data-diagram-box]"
              )
            );
            return;
          }

          const qa = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);
          const cleanups: Array<() => void> = [];

          // ---- Scroll-driven triggers are created first, before any DOM write ----

          // About lead: words scrub from 25% to full opacity across the scroll range
          // (opacity only, at most 120 words, and not on small screens).
          if (!small) {
            qa('[data-split="words-scrub"]').forEach((el) => {
              const split = SplitText.create(el, { type: "words" });
              if (split.words.length > MAX_SCRUB_WORDS) {
                split.revert();
                return;
              }
              gsap.fromTo(
                split.words,
                { opacity: 0.4 },
                {
                  opacity: 1,
                  ease: "none",
                  stagger: 0.1,
                  scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: 0.5 },
                }
              );
            });
          }

          // Closing headline: lines rise out of a mask once, when it scrolls into view.
          qa('[data-split="lines-scroll"]').forEach((el) => {
            const split = SplitText.create(el, { type: "lines", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 105,
              duration: 0.8,
              ease: EASE,
              stagger: 0.1,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => split.revert(),
            });
          });

          // Ruled lists: hairlines draw in with scaleX, one batched group.
          const rules = qa("[data-rule]:not([data-revealed])");
          if (rules.length) {
            ScrollTrigger.batch(rules, {
              start: "top 92%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, { scaleX: 1, duration: 0.7, ease: EASE, stagger: 0.08, onComplete: () => markRevealed(batch) }),
            });
          }

          // Timeline: the rail draws with a scrubbed scaleY; nodes pop in as they are reached.
          qa("[data-timeline]").forEach((timeline) => {
            const rail = timeline.querySelector<HTMLElement>("[data-timeline-rail]");
            if (!rail) return;
            gsap.fromTo(
              rail,
              { scaleY: 0 },
              {
                scaleY: 1,
                ease: "none",
                scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
              }
            );
          });
          const nodes = qa("[data-node]:not([data-revealed])");
          if (nodes.length) {
            ScrollTrigger.batch(nodes, {
              start: "top 85%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, { opacity: 1, scale: 1, duration: 0.4, ease: EASE, stagger: 0.08, onComplete: () => markRevealed(batch) }),
            });
          }

          // Architecture diagram: connectors are SVG and are drawn with DrawSVG; the HTML
          // box outlines wipe in with a clip-path. Once, when the diagram enters view.
          qa("[data-diagram]").forEach((diagram) => {
            const boxes = Array.from(diagram.querySelectorAll<HTMLElement>("[data-diagram-box]"));
            const lines = Array.from(diagram.querySelectorAll<SVGElement>("[data-draw] line"));
            const connectors = Array.from(diagram.querySelectorAll<HTMLElement>("[data-draw]"));
            gsap
              .timeline({
                defaults: { ease: EASE },
                scrollTrigger: { trigger: diagram, start: "top 82%", once: true },
                onComplete: () => markRevealed([...boxes, ...connectors]),
              })
              .to(boxes, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, stagger: 0.12 }, 0)
              .set(connectors, { opacity: 1 }, 0)
              .fromTo(lines, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.5, stagger: 0.18 }, 0.1);
          });

          // Section reveals: one batched ScrollTrigger group, plays once. Cards, skill
          // groups, services rows and prose all carry [data-reveal].
          const items = qa("[data-reveal]:not([data-revealed])");
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

          // ---- Writes: flip the flag, route fade, hero timeline ----
          root.setAttribute("data-motion", "ready");

          // Route change (not the first load): a short fade and rise. Enter only; never delays navigation.
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

          // Hero: one timeline of at most 900ms. Everything is already painted; the name's
          // characters and the subtitle's lines rise out of masks, the other blocks rise
          // 14px, and the portrait opens from a small clip-path inset. Content stays visible
          // throughout: no opacity animation on the heading, bio or portrait.
          const runHero = () => {
            if (cancelled) return;
            const nameEl = document.querySelector<HTMLElement>('[data-hero-split="chars"]');
            const subEl = document.querySelector<HTMLElement>('[data-hero-split="lines"]');
            const blocks = qa('[data-hero]:not([data-hero="clip"]):not([data-revealed])');
            const portrait = qa('[data-hero="clip"]:not([data-revealed])');
            if (!nameEl && !blocks.length && !portrait.length) return;
            // A breakpoint change re-runs this callback; the name plays once per page.
            if (nameEl?.dataset.played) return;
            if (nameEl) nameEl.dataset.played = "1";

            const tl = gsap.timeline({
              defaults: { ease: EASE },
              onComplete: () => {
                markRevealed([...blocks, ...portrait]);
                nameSplit?.revert();
                subSplit?.revert();
              },
            });
            const nameSplit = nameEl ? SplitText.create(nameEl, { type: "chars,lines", mask: "lines" }) : null;
            const subSplit = subEl ? SplitText.create(subEl, { type: "lines", mask: "lines" }) : null;
            if (nameSplit) tl.from(nameSplit.chars, { yPercent: 105, duration: 0.55, stagger: 0.022 }, 0);
            if (subSplit) tl.from(subSplit.lines, { yPercent: 105, duration: 0.5, stagger: 0.08 }, 0.12);
            if (blocks.length) tl.to(blocks, { y: 0, duration: 0.5, stagger: 0.05 }, 0.2);
            if (portrait.length) tl.to(portrait, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7 }, 0.1);
          };
          // Split only once fonts have settled, so line breaks are final.
          if (document.fonts?.status === "loading") document.fonts.ready.then(runHero);
          else runHero();

          // ---- Pointer effects: ONE passive pointermove listener, fine pointers only ----
          if (fine) {
            const follower = document.querySelector<HTMLElement>("[data-cursor-follower]");
            const ring = follower?.querySelector<HTMLElement>("[data-cursor-ring]") ?? null;
            const label = follower?.querySelector<HTMLElement>("[data-cursor-label]") ?? null;
            const xTo = follower ? gsap.quickTo(follower, "x", { duration: 0.35, ease: EASE }) : null;
            const yTo = follower ? gsap.quickTo(follower, "y", { duration: 0.35, ease: EASE }) : null;
            if (follower) gsap.set(follower, { xPercent: -50, yPercent: -50 });

            // Magnetic elements: rects are cached (document coordinates), never read in pointermove.
            const magnets = qa("[data-magnetic]")
              .slice(0, 6)
              .map((outer) => {
                const inner = outer.querySelector<HTMLElement>("[data-magnetic-inner]");
                if (!inner) return null;
                return {
                  outer,
                  inner,
                  fixed: !!outer.closest("[data-site-header]"),
                  cx: 0,
                  cy: 0,
                  reach: 0,
                  active: false,
                  hidden: false,
                  xTo: gsap.quickTo(inner, "x", { duration: 0.4, ease: EASE }),
                  yTo: gsap.quickTo(inner, "y", { duration: 0.4, ease: EASE }),
                };
              })
              .filter((m): m is NonNullable<typeof m> => m !== null);

            const measure = () => {
              const scrollY = window.scrollY;
              for (const m of magnets) {
                const r = m.outer.getBoundingClientRect();
                m.hidden = r.width === 0;
                m.cx = r.left + r.width / 2;
                m.cy = r.top + r.height / 2 + (m.fixed ? 0 : scrollY);
                m.reach = 80 + Math.max(r.width, r.height) / 2;
              }
            };
            measure();
            ScrollTrigger.addEventListener("refresh", measure);

            const release = (m: (typeof magnets)[number]) => {
              m.active = false;
              gsap.to(m.inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true });
            };

            let visible = false;
            let lastTarget: Element | null = null;
            const showRing = (on: boolean) => {
              if (!follower || visible === on) return;
              visible = on;
              gsap.to(follower, { opacity: on ? 1 : 0, duration: 0.2, overwrite: "auto" });
            };

            const onMove = (e: PointerEvent) => {
              if (follower && xTo && yTo) {
                xTo(e.clientX);
                yTo(e.clientY);
                showRing(true);
                if (e.target !== lastTarget) {
                  lastTarget = e.target as Element | null;
                  const state = cursorState(lastTarget);
                  gsap.to(ring, {
                    scale: state === "link" ? 1.5 : state === "view" ? 2.2 : state === "text" ? 0.5 : 1,
                    opacity: state === "text" ? 0.35 : 1,
                    duration: 0.25,
                    ease: EASE,
                    overwrite: "auto",
                  });
                  gsap.to(label, { opacity: state === "view" ? 1 : 0, duration: 0.2, overwrite: "auto" });
                }
              }
              if (magnets.length) {
                const scrollY = window.scrollY;
                for (const m of magnets) {
                  if (m.hidden) continue;
                  const dx = e.clientX - m.cx;
                  const dy = e.clientY - (m.fixed ? m.cy : m.cy - scrollY);
                  if (Math.hypot(dx, dy) < m.reach) {
                    m.active = true;
                    m.xTo(dx * 0.25);
                    m.yTo(dy * 0.25);
                  } else if (m.active) {
                    release(m);
                  }
                }
              }
            };
            const onLeave = () => {
              showRing(false);
              lastTarget = null;
              for (const m of magnets) if (m.active) release(m);
            };

            const onOut = (e: PointerEvent) => {
              if (!e.relatedTarget) onLeave();
            };
            window.addEventListener("pointermove", onMove, { passive: true });
            document.addEventListener("pointerout", onOut);
            cleanups.push(() => {
              window.removeEventListener("pointermove", onMove);
              document.removeEventListener("pointerout", onOut);
              ScrollTrigger.removeEventListener("refresh", measure);
              gsap.set(magnets.map((m) => m.inner), { clearProps: "transform" });
            });
          }

          return () => cleanups.forEach((c) => c());
        }
      );

      performance.measure("motion:init", { start: t0, end: performance.now() });
      return () => {
        cancelled = true;
        mm.revert();
      };
    },
    { dependencies: [pathname], revertOnUpdate: true }
  );

  return null;
}
