"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    __portfolioLenis?: Lenis;
  }
}

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = window.matchMedia("(pointer: coarse)").matches;
    const slow = Boolean(connection?.saveData || /^(slow-2g|2g)$/.test(connection?.effectiveType ?? ""));
    if (reduce || touch || slow) return;

    let cancelled = false;
    let lenis: Lenis | undefined;
    let tick: ((time: number) => void) | undefined;
    let stopScroll: (() => void) | undefined;

    void import("@/lib/motion").then(({ gsap, ScrollTrigger }) => {
      if (cancelled) return;
      lenis = new Lenis({ duration: 1.1, smoothWheel: true, anchors: { offset: -64 } });
      window.__portfolioLenis = lenis;
      stopScroll = lenis.on("scroll", ScrollTrigger.update);
      tick = (time) => lenis?.raf(time * 1000);
      gsap.ticker.add(tick);
    });

    return () => {
      cancelled = true;
      stopScroll?.();
      if (tick) void import("@/lib/motion").then(({ gsap }) => gsap.ticker.remove(tick!));
      lenis?.destroy();
      delete window.__portfolioLenis;
    };
  }, []);

  return children;
}
