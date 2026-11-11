"use client";

import { useRef } from "react";
import { EASE, gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";
import { setNavActive } from "@/lib/nav-active";
import { MOTION } from "@/lib/motion-timing";
import { whenIntroDone } from "@/lib/intro";

const NAV_IDS = ["about", "skills", "projects", "experience", "education", "contact"];

/** Content direction per section: related blocks arrive from the same side. */
const SECTION_REVEAL: Record<string, { x: number; y: number; stagger: number }> = {
  about: { x: -18, y: 0, stagger: 0.08 },
  skills: { x: 0, y: 24, stagger: 0.09 },
  projects: { x: 18, y: 0, stagger: 0.1 },
  services: { x: 0, y: 18, stagger: 0.08 },
  experience: { x: 24, y: 0, stagger: 0.1 },
  education: { x: -18, y: 0, stagger: 0.08 },
  testimonials: { x: 0, y: 18, stagger: 0.1 },
  contact: { x: 0, y: 18, stagger: 0.08 },
};

/** Headings alternate direction so no two adjacent sections arrive the same way. */
const SECTION_HEAD: Record<string, { x: number; y: number }> = {
  about: { x: -24, y: 0 },
  skills: { x: 24, y: 0 },
  projects: { x: -24, y: 0 },
  services: { x: 24, y: 0 },
  experience: { x: -24, y: 0 },
  education: { x: 24, y: 0 },
  testimonials: { x: -24, y: 0 },
  contact: { x: 0, y: 20 },
};

const REVEALED_SELECTOR = [
  "[data-hero]",
  "[data-hero-cta]",
  "[data-hero-accent]",
  "[data-hero-portrait-inner]",
  "[data-section-head]",
  "[data-section-rule]",
  "[data-reveal]",
  "[data-reveal-soft]",
  "[data-about-lead]",
  "[data-about-portrait]",
  "[data-skill-group]",
  "[data-skill-rule]",
  "[data-project-lead]",
  "[data-rule]",
  "[data-timeline-rail]",
  "[data-node]",
  "[data-node-ring]",
  "[data-diagram-box]",
  "[data-draw]",
  "[data-contact-form]",
  "[data-footer-item]",
  "[data-page-head]",
].join(",");

/** Final state, permanently: stop hiding it, drop GSAP's inline styles. */
function markRevealed(els: Element[]) {
  els.forEach((el) => el.setAttribute("data-revealed", ""));
  gsap.set(els, { clearProps: "opacity,visibility,transform,clipPath" });
}

/**
 * Every animation on the site, in one place. Renders nothing. Server HTML is
 * untouched: content is already in the page, and this only eases it in.
 *
 * Contract with the CSS in globals.css:
 *  - An inline script sets html[data-motion="pending"] before paint, only when the
 *    visitor allows motion. CSS then pre-positions the hooks: hero blocks (a small
 *    transform offset, and a bottom wipe on the portrait, so the LCP element is
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

  // 2. Motion, only when the visitor allows it. Transform, opacity and paint-only
  //    clip-path / stroke drawing. Ambient loops are limited to the hero motif,
  //    the portrait breathing, the availability dot and the diagram signal.
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
            markRevealed(gsap.utils.toArray<Element>(REVEALED_SELECTOR));
            return;
          }

          // The CSS fail-safe reveals everything at 2.5s if the motion chunk is
          // slow. If we arrive after that, keep whatever is already on screen
          // visible and skip the hero entrance, but still set up the scroll
          // reveals below the fold so a slow first load is not a dead page.
          const late = performance.now() > 2200;
          if (late) {
            root.setAttribute("data-motion", "ready");
            const triggerLine = window.innerHeight * 0.9;
            gsap.utils
              .toArray<Element>(REVEALED_SELECTOR)
              .forEach((el) => {
                if (el.getBoundingClientRect().top < triggerLine) {
                  el.setAttribute("data-revealed", "");
                }
              });
          }

          const qa = <T extends Element = HTMLElement>(sel: string) => gsap.utils.toArray<T>(sel);
          const cleanups: Array<() => void> = [];

          // Every element that already has a trigger, so the fallback pass at the
          // bottom only picks up content with no section (project pages).
          const handled = new Set<Element>();
          function track<T extends Element>(els: T[]): T[] {
            els.forEach((el) => handled.add(el));
            return els;
          }

          // ---- Scroll-driven triggers are created first, before any DOM write ----

          // Closing headline: lines rise out of a mask once, when it scrolls into view.
          qa('[data-split="lines-scroll"]').forEach((el) => {
            if (late && el.getBoundingClientRect().top < window.innerHeight) return;
            const split = SplitText.create(el, { type: "lines", mask: "lines" });
            gsap.from(split.lines, {
              yPercent: 105,
              duration: MOTION.section.head,
              ease: EASE,
              stagger: MOTION.stagger.list,
              scrollTrigger: { trigger: el, start: "top 88%", once: true },
              onComplete: () => split.revert(),
            });
          });

          // Section chrome: the top rule draws across, then the heading arrives
          // from its section-specific direction.
          qa("[data-section]").forEach((section) => {
            const head = section.querySelector<HTMLElement>("[data-section-head]");
            const rule = section.querySelector<HTMLElement>("[data-section-rule]");
            const headTarget = head && !head.hasAttribute("data-revealed") ? head : null;
            const ruleTarget = rule && !rule.hasAttribute("data-revealed") ? rule : null;
            if (!headTarget && !ruleTarget) return;
            const id = section.id;
            const headFrom = SECTION_HEAD[id] ?? { x: 0, y: 14 };
            const targets = track([...(headTarget ? [headTarget] : []), ...(ruleTarget ? [ruleTarget] : [])]);

            const tl = gsap.timeline({
              defaults: { ease: EASE },
              scrollTrigger: { trigger: section, start: "top 86%", once: true },
              onComplete: () => markRevealed(targets),
            });
            if (ruleTarget) tl.to(ruleTarget, { scaleX: 1, duration: MOTION.section.rule }, 0);
            if (headTarget) {
              tl.fromTo(
                headTarget,
                { opacity: 0, x: headFrom.x, y: headFrom.y },
                { opacity: 1, x: 0, y: 0, duration: MOTION.section.head },
                0.08
              );
            }
          });

          // Section content: one batch per section, with its own direction and
          // stagger. Elements with a more specific choreography are excluded.
          qa("[data-section]").forEach((section) => {
            const cfg = SECTION_REVEAL[section.id] ?? { x: 0, y: 20, stagger: MOTION.stagger.card };
            const items = track(
              Array.from(section.querySelectorAll<HTMLElement>("[data-reveal]:not([data-revealed])")).filter(
                (el) =>
                  !el.hasAttribute("data-skill-group") &&
                  !el.hasAttribute("data-project-lead") &&
                  !el.hasAttribute("data-contact-form") &&
                  !el.hasAttribute("data-entry") &&
                  !el.closest("[data-timeline]")
              )
            );
            if (!items.length) return;

            ScrollTrigger.batch(items, {
              start: small ? "top 92%" : "top 88%",
              once: true,
              batchMax: 8,
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { opacity: 0, x: cfg.x, y: cfg.y },
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: small ? 0.5 : MOTION.section.reveal,
                    ease: EASE,
                    stagger: small ? 0.05 : cfg.stagger,
                    overwrite: "auto",
                    onComplete: () => markRevealed(batch),
                  }
                ),
            });
          });

          // About: the portrait opens from the right while the prose slides in
          // from the left. The lead paragraph moves a little further. Prose never
          // drops below full opacity.
          const aboutPortrait = track(qa("[data-about-portrait]:not([data-revealed])"));
          if (aboutPortrait.length) {
            gsap.fromTo(
              aboutPortrait,
              { clipPath: "inset(0 0 100% 0)", x: 18, scale: 1.04 },
              {
                clipPath: "inset(0 0 0% 0)",
                x: 0,
                scale: 1,
                duration: 1,
                ease: EASE,
                scrollTrigger: { trigger: aboutPortrait[0], start: "top 86%", once: true },
                onComplete: () => markRevealed(aboutPortrait),
              }
            );
          }

          const aboutSoft = track(qa('[data-section="about"] [data-reveal-soft]:not([data-revealed])'));
          if (aboutSoft.length) {
            ScrollTrigger.batch(aboutSoft, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  x: 0,
                  duration: MOTION.section.reveal,
                  ease: EASE,
                  stagger: MOTION.stagger.list,
                  onComplete: () => markRevealed(batch),
                }),
            });
          }

          const aboutLead = track(qa("[data-about-lead]:not([data-revealed])"));
          if (aboutLead.length) {
            gsap.to(aboutLead, {
              x: 0,
              duration: 0.8,
              ease: EASE,
              scrollTrigger: { trigger: aboutLead[0], start: "top 86%", once: true },
              onComplete: () => markRevealed(aboutLead),
            });
          }

          // Skills: categories rise in a short stagger; their category rules
          // draw after the cards have landed.
          const skillGroups = track(qa('[data-section="skills"] [data-skill-group]:not([data-revealed])'));
          if (skillGroups.length) {
            ScrollTrigger.batch(skillGroups, {
              start: small ? "top 92%" : "top 88%",
              once: true,
              batchMax: 3,
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { opacity: 0, y: 26 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: MOTION.section.card,
                    ease: EASE,
                    stagger: small ? 0.05 : 0.09,
                    onComplete: () => markRevealed(batch),
                  }
                ),
            });
          }

          const skillRules = track(qa("[data-skill-rule]:not([data-revealed])"));
          if (skillRules.length) {
            ScrollTrigger.batch(skillRules, {
              start: "top 92%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  scaleX: 1,
                  duration: 0.6,
                  ease: EASE,
                  stagger: 0.06,
                  onComplete: () => markRevealed(batch),
                }),
            });
          }

          // Projects: the featured card leads with a slightly larger entrance;
          // supporting cards follow through the section batch.
          const projectLead = track(qa("[data-project-lead]:not([data-revealed])"));
          if (projectLead.length) {
            gsap.fromTo(
              projectLead,
              { opacity: 0, y: 30, scale: 0.985 },
              {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 0.85,
                ease: EASE,
                scrollTrigger: { trigger: projectLead[0], start: "top 85%", once: true },
                onComplete: () => markRevealed(projectLead),
              }
            );
          }

          // Architecture diagram: boxes and connectors draw in sequence from the
          // top down; after the drawing, a restrained teal signal travels the
          // connectors while the diagram is on screen.
          qa("[data-diagram]").forEach((diagram) => {
            const items = Array.from(
              diagram.querySelectorAll<HTMLElement>("[data-diagram-box],[data-draw]")
            ).filter((el) => !el.hasAttribute("data-revealed"));
            if (!items.length) return;

            const boxes = track(items.filter((el) => el.hasAttribute("data-diagram-box")));
            const connectors = track(items.filter((el) => el.hasAttribute("data-draw")));
            const signals = Array.from(diagram.querySelectorAll<SVGElement>("[data-diagram-signal]"));

            const groups = new Map<number, HTMLElement[]>();
            items.forEach((el) => {
              const order = Number(el.dataset.diagramOrder ?? 0);
              const group = groups.get(order) ?? [];
              group.push(el);
              groups.set(order, group);
            });

            const tl = gsap.timeline({
              defaults: { ease: EASE },
              scrollTrigger: { trigger: diagram, start: "top 82%", once: true },
              onComplete: () => markRevealed([...boxes, ...connectors]),
            });

            tl.set(connectors, { opacity: 1 }, 0);
            if (signals.length) tl.set(signals, { opacity: 0 }, 0);

            let pos = 0;
            [...groups.entries()]
              .sort((a, b) => a[0] - b[0])
              .forEach(([, group]) => {
                group.forEach((el, i) => {
                  const at = pos + i * 0.07;
                  if (el.hasAttribute("data-draw")) {
                    const line = el.querySelector<SVGElement>("line");
                    if (line) {
                      tl.fromTo(
                        line,
                        { drawSVG: "0%" },
                        { drawSVG: "100%", duration: MOTION.diagram.line },
                        at
                      );
                    }
                  } else {
                    tl.to(
                      el,
                      { clipPath: "inset(0% 0% 0% 0%)", duration: MOTION.diagram.box },
                      at
                    );
                  }
                });
                pos += MOTION.diagram.step;
              });

            if (signals.length) {
              const signalTl = gsap.timeline({ repeat: -1, repeatDelay: 1.6, paused: true });
              signalTl
                .fromTo(
                  signals,
                  { attr: { cy: 0 }, opacity: 0 },
                  {
                    attr: { cy: 16 },
                    opacity: 1,
                    duration: MOTION.diagram.signal,
                    ease: "none",
                    stagger: 0.35,
                  }
                )
                .to(signals, { opacity: 0, duration: 0.2 }, "-=0.2");

              tl.add(() => signalTl.play(), 1.2);
              ScrollTrigger.create({
                trigger: diagram,
                start: "top bottom",
                end: "bottom top",
                onToggle: (self) => (self.isActive ? signalTl.play() : signalTl.pause()),
              });
            }
          });

          // Timeline: the rail draws with a scrubbed scaleY; nodes pop in as they
          // are reached, and the entries slide in from the section's direction.
          qa("[data-timeline]").forEach((timeline) => {
            const rail = timeline.querySelector<HTMLElement>("[data-timeline-rail]");
            if (rail && !rail.hasAttribute("data-revealed")) {
              track([rail]);
              gsap.fromTo(
                rail,
                { scaleY: 0 },
                {
                  scaleY: 1,
                  ease: "none",
                  scrollTrigger: { trigger: timeline, start: "top 70%", end: "bottom 60%", scrub: 0.5 },
                }
              );
            }

            const isEducation = Boolean(timeline.closest('[data-section="education"]'));
            const entries = track(
              Array.from(timeline.querySelectorAll<HTMLElement>("[data-entry]:not([data-revealed])"))
            );
            if (entries.length) {
              ScrollTrigger.batch(entries, {
                start: small ? "top 92%" : "top 86%",
                once: true,
                batchMax: 4,
                onEnter: (batch) =>
                  gsap.fromTo(
                    batch,
                    { opacity: 0, x: isEducation ? -18 : 18 },
                    {
                      opacity: 1,
                      x: 0,
                      duration: MOTION.section.card,
                      ease: EASE,
                      stagger: small ? 0.05 : MOTION.stagger.card,
                      onComplete: () => markRevealed(batch),
                    }
                  ),
              });
            }

            const nodes = track(
              Array.from(timeline.querySelectorAll<HTMLElement>("[data-node]:not([data-revealed])"))
            );
            if (nodes.length) {
              ScrollTrigger.batch(nodes, {
                start: "top 85%",
                once: true,
                onEnter: (batch) =>
                  gsap.to(batch, {
                    opacity: 1,
                    scale: 1,
                    duration: 0.45,
                    ease: EASE,
                    stagger: 0.08,
                    onComplete: () => markRevealed(batch),
                  }),
              });
            }

            // The current role gets one expanding ring, then the node stays teal.
            const rings = Array.from(timeline.querySelectorAll<HTMLElement>("[data-node-ring]"));
            if (rings.length) {
              gsap.fromTo(
                rings,
                { scale: 0.7, opacity: 0.7 },
                {
                  scale: 2.1,
                  opacity: 0,
                  duration: 0.9,
                  ease: EASE,
                  scrollTrigger: { trigger: timeline, start: "top 80%", once: true },
                }
              );
            }
          });

          // Contact: the form is its own beat, separate from the introduction.
          const contactForm = track(qa("[data-contact-form]:not([data-revealed])"));
          if (contactForm.length) {
            gsap.fromTo(
              contactForm,
              { opacity: 0, y: 24 },
              {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: EASE,
                scrollTrigger: { trigger: contactForm[0], start: "top 85%", once: true },
                onComplete: () => markRevealed(contactForm),
              }
            );
          }

          // Footer: a quiet upward entrance.
          const footerItems = track(qa("[data-footer-item]:not([data-revealed])"));
          if (footerItems.length) {
            ScrollTrigger.batch(footerItems, {
              start: "top 95%",
              once: true,
              onEnter: (batch) =>
                gsap.to(batch, {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  ease: EASE,
                  stagger: 0.06,
                  onComplete: () => markRevealed(batch),
                }),
            });
          }

          // Project-page header: a short entrance on load, independent of scroll.
          const pageHead = track(qa("[data-page-head]:not([data-revealed])"));
          if (pageHead.length) {
            gsap.fromTo(
              pageHead,
              { opacity: 0, y: 14 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: EASE,
                onComplete: () => markRevealed(pageHead),
              }
            );
          }

          // Anything left outside a section (project-page prose) still reveals.
          const remaining = qa(
            "[data-reveal]:not([data-revealed]), [data-reveal-soft]:not([data-revealed])"
          ).filter((el) => !handled.has(el) && !el.closest("[data-section]"));
          if (remaining.length) {
            ScrollTrigger.batch(remaining, {
              start: "top 88%",
              once: true,
              onEnter: (batch) =>
                gsap.fromTo(
                  batch,
                  { opacity: 0, y: 20 },
                  {
                    opacity: 1,
                    y: 0,
                    duration: MOTION.section.reveal,
                    ease: EASE,
                    stagger: MOTION.stagger.card,
                    onComplete: () => markRevealed(batch),
                  }
                ),
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
                { opacity: 1, y: 0, duration: 0.3, ease: EASE, clearProps: "opacity,transform" }
              );
            }
          }

          // Hero: one coordinated timeline of roughly 1.3s. Everything is already
          // painted; the name's words and the subtitle's lines rise out of masks,
          // the portrait opens from a bottom wipe and settles from a small scale,
          // the teal rule draws, and the CTAs follow with a short stagger.
          const portraitInner = qa("[data-hero-portrait-inner]");
          const startBreath = () => {
            if (!portraitInner[0]) return;
            const breath = gsap.to(portraitInner[0], {
              y: -4,
              duration: MOTION.hero.breath,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
              paused: true,
            });
            ScrollTrigger.create({
              trigger: portraitInner[0],
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => (self.isActive ? breath.play() : breath.pause()),
            });
            breath.play();
          };

          const runHero = () => {
            if (cancelled) return;
            const nameEl = document.querySelector<HTMLElement>('[data-hero-split="words"]');
            const subEl = document.querySelector<HTMLElement>('[data-hero-split="lines"]');
            const blocks = qa('[data-hero]:not([data-hero="clip"]):not([data-revealed])');
            const portrait = qa('[data-hero="clip"]:not([data-revealed])');
            const accent = qa("[data-hero-accent]:not([data-revealed])");
            const ctas = qa("[data-hero-cta]:not([data-revealed])");
            if (!nameEl && !blocks.length && !portrait.length && !accent.length && !ctas.length) return;
            // A breakpoint change re-runs this callback; the name plays once per page.
            if (nameEl?.dataset.played) return;
            if (nameEl) nameEl.dataset.played = "1";

            const nameSplit = nameEl
              ? SplitText.create(nameEl, { type: "words,lines", mask: "lines" })
              : null;
            const subSplit = subEl ? SplitText.create(subEl, { type: "lines", mask: "lines" }) : null;

            const tl = gsap.timeline({
              defaults: { ease: EASE },
              onComplete: () => {
                markRevealed([...blocks, ...portrait, ...accent, ...ctas, ...portraitInner]);
                nameSplit?.revert();
                subSplit?.revert();
                startBreath();
              },
            });

            if (nameSplit) {
              tl.from(
                nameSplit.words,
                { yPercent: 110, duration: MOTION.hero.name, stagger: MOTION.stagger.heroWords },
                0
              );
            }
            if (subSplit) {
              tl.from(
                subSplit.lines,
                {
                  yPercent: 110,
                  duration: MOTION.hero.headline,
                  stagger: MOTION.stagger.heroHeadline,
                },
                0.16
              );
            }
            if (portrait.length) {
              tl.fromTo(
                portrait,
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0% 0% 0% 0%)", duration: MOTION.hero.portrait },
                0.05
              );
            }
            if (portraitInner.length) {
              tl.fromTo(
                portraitInner,
                { scale: 1.05 },
                { scale: 1, duration: MOTION.hero.portrait },
                0.05
              );
            }
            if (accent.length) {
              tl.to(accent, { scaleX: 1, duration: MOTION.hero.accent }, 0.35);
            }
            if (blocks.length) {
              tl.to(blocks, { y: 0, duration: 0.6, stagger: 0.06 }, 0.3);
            }
            if (ctas.length) {
              tl.to(
                ctas,
                { opacity: 1, y: 0, duration: MOTION.hero.cta, stagger: MOTION.stagger.heroCta },
                0.45
              );
            }
          };
          // Start immediately: the hero is the first thing seen, and a split with
          // fallback metrics is better than a visible name that jumps into masks.
          // On a late load the hero is already on screen, so only the breath runs.
          // On a fresh visit the opening overlay covers the page, so the hero
          // entrance waits for it to clear (fail-safe after 2.8s via whenIntroDone).
          if (late) startBreath();
          else cleanups.push(whenIntroDone(runHero));

          // The hero's ambient grid, nodes and availability halo are CSS loops;
          // pause them when the hero is off-screen.
          const ambientLoops = qa(
            "[data-hero-ambient-grid], .hero-node, .availability-ping"
          );
          if (ambientLoops.length) {
            ScrollTrigger.create({
              trigger: "[data-hero-ambient]",
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => {
                ambientLoops.forEach((el) => {
                  el.style.animationPlayState = self.isActive ? "running" : "paused";
                });
              },
            });
          }

          // ---- Pointer effects: ONE passive pointermove listener, fine pointers only.
          // The native cursor is untouched. Magnets are limited to two primary links;
          // the outer hit target never moves, and keyboard focus is unaffected.
          if (fine) {
            const magnets = qa("[data-magnetic]")
              .slice(0, 2)
              .map((outer) => {
                const inner = outer.querySelector<HTMLElement>("[data-magnetic-inner]");
                if (!inner) return null;
                return {
                  outer,
                  inner,
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
                m.cy = r.top + r.height / 2 + scrollY;
                m.reach = 80 + Math.max(r.width, r.height) / 2;
              }
            };
            measure();
            ScrollTrigger.addEventListener("refresh", measure);

            const release = (m: (typeof magnets)[number]) => {
              m.active = false;
              gsap.to(m.inner, { x: 0, y: 0, duration: 0.5, ease: EASE, overwrite: true });
            };

            const onMove = (e: PointerEvent) => {
              for (const m of magnets) {
                if (m.hidden) continue;
                const dx = e.clientX - m.cx;
                const dy = e.clientY - (m.cy - window.scrollY);
                if (Math.hypot(dx, dy) < m.reach) {
                  m.active = true;
                  m.xTo(dx * 0.2);
                  m.yTo(dy * 0.2);
                } else if (m.active) {
                  release(m);
                }
              }
            };
            const onLeave = () => {
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
