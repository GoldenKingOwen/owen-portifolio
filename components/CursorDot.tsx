"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const LERP = 0.15;
const INTERACT_SCALE = 1.6;
const SCALE_LERP = 0.18;
const INTERACTIVE_SELECTOR = "a, button";

export function CursorDot() {
  const dotRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const runningRef = useRef(false);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const interactRef = useRef(false);
  const reducedRef = useRef(false);

  // Render gate: only paint on fine-pointer devices, and only after
  // hydration so window.matchMedia is safe (no SSR/hydration mismatch).
  const [ready, setReady] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || !dotRef.current) return;

    const reducedQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );
    reducedRef.current = reducedQuery.matches;
    const onReducedChange = () => {
      reducedRef.current = reducedQuery.matches;
    };
    reducedQuery.addEventListener("change", onReducedChange);

    const onMouseMove = (e: MouseEvent) => {
      targetX.current = e.clientX;
      targetY.current = e.clientY;
    };
    const onMouseOver = (e: MouseEvent) => {
      if (
        e.target instanceof Element &&
        e.target.closest(INTERACTIVE_SELECTOR)
      ) {
        interactRef.current = true;
      }
    };
    const onMouseOut = (e: MouseEvent) => {
      const related = e.relatedTarget as Element | null;
      if (related && related.closest(INTERACTIVE_SELECTOR)) return;
      interactRef.current = false;
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });

    // Start at the viewport center so the dot never flashes in the corner.
    currentX.current = window.innerWidth / 2;
    currentY.current = window.innerHeight / 2;
    let scale = 1;
    runningRef.current = true;

    function frame() {
      if (!runningRef.current) return;
      if (reducedRef.current) {
        currentX.current = targetX.current;
        currentY.current = targetY.current;
      } else {
        currentX.current += (targetX.current - currentX.current) * LERP;
        currentY.current += (targetY.current - currentY.current) * LERP;
      }
      const targetScale = interactRef.current ? INTERACT_SCALE : 1;
      if (reducedRef.current) {
        scale = targetScale;
      } else {
        scale += (targetScale - scale) * SCALE_LERP;
      }
      dotRef.current!.style.transform = `translate3d(${currentX.current - 4}px, ${currentY.current - 4}px, 0) scale(${scale})`;
      rafRef.current = requestAnimationFrame(frame);
    }
    rafRef.current = requestAnimationFrame(frame);

    return () => {
      runningRef.current = false;
      cancelAnimationFrame(rafRef.current);
      reducedQuery.removeEventListener("change", onReducedChange);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
    };
  }, [ready]);

  if (!ready) return null;
  return (
    <div
      ref={dotRef}
      className={cn(
        "fixed top-0 left-0 h-2 w-2 rounded-full bg-accent-violet",
        "shadow-[0_0_0_1px_var(--color-foreground),_0_0_6px_var(--color-accent-violet)]",
        "pointer-events-none z-[9999]"
      )}
      aria-hidden="true"
    />
  );
}
