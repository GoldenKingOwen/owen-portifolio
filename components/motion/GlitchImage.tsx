"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { whenIntroDone } from "@/lib/intro";

/**
 * The one glitch treatment on the site, for the hero photograph.
 *
 * It is a short, deliberate burst — RGB channel separation, two clipped
 * horizontal bands and one scan line — never a loop. The clean image is the
 * base layer; the effects are copies that stay invisible except during a burst.
 *
 * Triggers: once when the hero has settled after the opening sequence, and on
 * pointer hover for fine pointers. Off entirely for reduced motion and touch,
 * and the copy layers are aria-hidden and non-interactive.
 */
export function GlitchImage({
  src,
  alt,
  sizes,
  priority = false,
  quality = 80,
  className,
  imageClassName,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  quality?: number;
  className?: string;
  imageClassName?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<number | null>(null);
  const canAnimate = useRef(false);

  const burst = useCallback(() => {
    const el = root.current;
    if (!el || !canAnimate.current) return;

    // Restart the CSS animations even if a burst is already running.
    el.removeAttribute("data-glitch");
    void el.offsetWidth;
    el.setAttribute("data-glitch", "burst");

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      el.setAttribute("data-glitch", "idle");
    }, 480);
  }, []);

  useEffect(() => {
    canAnimate.current =
      document.documentElement.hasAttribute("data-motion") &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches;

    if (!canAnimate.current) return;

    // One accent burst as the hero settles, after the opening screen is gone.
    let cancelled = false;
    const stop = whenIntroDone(() => {
      if (cancelled) return;
      window.setTimeout(() => {
        if (!cancelled) burst();
      }, 900);
    });

    return () => {
      cancelled = true;
      stop();
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [burst]);

  const layerStyle = { backgroundImage: `url(${src})` };

  return (
    <div
      ref={root}
      data-glitch="idle"
      className={cn("glitch relative overflow-hidden rounded-ui bg-panel", className)}
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") burst();
      }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        quality={quality}
        sizes={sizes}
        className={cn("object-cover object-top", imageClassName)}
      />

      {/* Channel copies: red and cyan, offset in opposite directions. */}
      <div aria-hidden="true" className="glitch-layer glitch-layer--red" style={layerStyle} />
      <div aria-hidden="true" className="glitch-layer glitch-layer--cyan" style={layerStyle} />

      {/* Clipped horizontal bands: short horizontal displacement bursts. */}
      <div aria-hidden="true" className="glitch-band glitch-band--a" style={layerStyle} />
      <div aria-hidden="true" className="glitch-band glitch-band--b" style={layerStyle} />
      <div aria-hidden="true" className="glitch-scan" />

      {/* The grade sits on top so the clean and glitched states share one tone. */}
      <div aria-hidden="true" className="plate-tint absolute inset-0" />
      <div aria-hidden="true" className="plate-grade absolute inset-0" />
    </div>
  );
}
