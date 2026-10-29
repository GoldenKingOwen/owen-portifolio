"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { CursorFollower } from "@/components/motion/CursorFollower";

// GSAP lives in its own async chunk. It is not requested until the page has
// hydrated and the browser is idle, so it never competes with first paint.
const MotionEffects = dynamic(() => import("@/components/motion/MotionEffects"), { ssr: false });

type Mode = "pending" | "motion" | "basic";

const noop = () => () => {};

export function MotionLoader() {
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  // The inline script in layout.tsx sets html[data-motion] only for visitors who
  // get motion. Everyone else is "basic": no GSAP at all, just the lightweight spy.
  // Read through useSyncExternalStore: "pending" on the server and first render,
  // the real value right after hydration, with no setState in an effect.
  const mode = useSyncExternalStore<Mode>(
    noop,
    () => (document.documentElement.hasAttribute("data-motion") ? "motion" : "basic"),
    () => "pending"
  );

  // Motion visitors: load the GSAP chunk once the browser is idle.
  useEffect(() => {
    if (mode !== "motion") return;
    const start = () => setReady(true);
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(start, { timeout: 700 });
      return () => window.cancelIdleCallback(id);
    }
    const timer = window.setTimeout(start, 200);
    return () => window.clearTimeout(timer);
  }, [mode]);

  // Basic visitors: header border and nav highlight without any animation library.
  useEffect(() => {
    if (mode !== "basic") return;
    let stop: (() => void) | undefined;
    let cancelled = false;
    import("@/lib/nav-spy").then((m) => {
      if (!cancelled) stop = m.startNavSpy();
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [mode, pathname]);

  if (mode !== "motion") return null;
  return (
    <>
      <CursorFollower />
      {ready && <MotionEffects pathname={pathname} />}
    </>
  );
}
