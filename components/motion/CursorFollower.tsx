"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * The markup for the cursor ring: one 36px ring with an accent border (no blend
 * mode, no blur, no glow) and a "View" label. It renders nothing unless the device
 * has a fine, hover-capable pointer, the visitor allows motion, and motion is on
 * for this device. The native cursor is never hidden. The ring is aria-hidden, can
 * never take focus, and ignores the pointer. It starts invisible; the single
 * pointermove listener in the lazy motion module positions and shows it.
 */
export function CursorFollower() {
  const enabled = useSyncExternalStore(
    noop,
    () =>
      document.documentElement.hasAttribute("data-motion") &&
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      window.matchMedia("(prefers-reduced-motion: no-preference)").matches,
    () => false
  );

  if (!enabled) return null;

  return (
    <div
      data-cursor-follower=""
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[60] opacity-0"
    >
      <div data-cursor-ring="" className="h-9 w-9 rounded-full border-[1.5px] border-accent" />
      <span
        data-cursor-label=""
        className="absolute inset-0 flex items-center justify-center text-xs font-medium text-accent opacity-0"
      >
        View
      </span>
    </div>
  );
}
