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
  duration: { instant: 0.15, quick: 0.3, standard: 0.6, long: 0.9, hero: 1.4 },
  ease: { enter: "power3.out", move: "power2.inOut", hero: "expo.out" },
  stagger: { min: 0.04, max: 0.08 },
} as const;
export const EASE = MOTION.ease.enter;

export function createMotionContexts(scope: Element | string) {
  const media = gsap.matchMedia(scope);
  media.add({
    reduce: "(prefers-reduced-motion: reduce)",
    tablet: "(max-width: 1023px)",
    desktop: "(min-width: 1024px)",
  }, (context) => {
    const conditions = context.conditions as { reduce: boolean; tablet: boolean; desktop: boolean };
    if (conditions.reduce) return;
    return () => {};
  });
  return media;
}

export { gsap, ScrollTrigger, SplitText, MotionPathPlugin, DrawSVGPlugin, useGSAP };
