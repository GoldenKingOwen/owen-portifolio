import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, useGSAP);
  ScrollTrigger.config({ ignoreMobileResize: true, autoRefreshEvents: "visibilitychange,resize" });
}

export const MOTION = {
  hero: { name: 0.9, headline: 0.6, portrait: 0.9, accent: 0.6, cta: 0.3, breath: 4.5 },
  section: { head: 0.6, rule: 0.6, reveal: 0.6, card: 0.6 },
  diagram: { box: 0.5, line: 0.45, step: 0.2, signal: 1.3 },
  overlay: { enter: 0.3, exit: 0.15 },
  duration: { instant: 0.15, quick: 0.3, standard: 0.6, long: 0.9, hero: 1.4 },
  ease: { enter: "power3.out", move: "power2.inOut", hero: "expo.out" },
  stagger: { min: 0.04, max: 0.08, heroWords: 0.035, heroHeadline: 0.06, heroCta: 0.05, card: 0.07, list: 0.06 },
} as const;
export const EASE = MOTION.ease.enter;

export type MotionConditions = { reduce: boolean; tablet: boolean; desktop: boolean };

export function createMotionContexts(
  callback: (conditions: MotionConditions) => void | (() => void),
  scope?: Element | string,
) {
  const media = gsap.matchMedia(scope);
  media.add({
    reduce: "(prefers-reduced-motion: reduce)",
    tablet: "(max-width: 1023px)",
    desktop: "(min-width: 1024px)",
  }, (context) => callback(context.conditions as MotionConditions));
  return media;
}

export function useMotion(callback: () => void | (() => void), scope?: Element | string) {
  return useGSAP(callback, { scope });
}

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, useGSAP };
