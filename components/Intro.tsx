"use client";

import { useEffect } from "react";
import { isIntroPending, markIntroDone } from "@/lib/intro";

export function Intro() {
  useEffect(() => {
    if (!isIntroPending()) return;
    let cancelled = false;
    let timeline: { kill: () => void } | undefined;

    const finish = () => {
      if (!isIntroPending()) return;
      timeline?.kill();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
      markIntroDone();
    };
    const onKey = (event: KeyboardEvent) => {
      if (["Escape", "Enter", " "].includes(event.key)) finish();
    };
    const onClick = () => finish();
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClick, { once: true });

    void import("@/lib/motion").then(({ gsap }) => {
      if (cancelled || !isIntroPending()) return;
      const root = document.querySelector<HTMLElement>("[data-intro-root]");
      const lines = root?.querySelectorAll<HTMLElement>("[data-intro-line]");
      if (!root || !lines?.length) return finish();

      const tl = gsap.timeline({ onComplete: finish });
      timeline = tl;
      tl.fromTo(lines, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.24, stagger: 0.14, ease: "power3.out" })
        .to(root, { clipPath: "inset(0 0 100% 0)", duration: 0.42, ease: "power2.inOut" }, 0.82);
    }).catch(finish);

    return () => {
      cancelled = true;
      timeline?.kill();
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClick);
    };
  }, []);

  return null;
}
