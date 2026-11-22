"use client";

import { useEffect, useRef } from "react";

const SECTION_LINKS = [
  ["home", "Home"],
  ["about", "About"],
  ["skills", "Skills"],
  ["projects", "Projects"],
  ["experience", "Experience"],
  ["contact", "Contact"],
] as const;

export function GlobalAtmosphere() {
  const progress = useRef<HTMLSpanElement>(null);
  const cursor = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = document.documentElement.hasAttribute("data-save-data");
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let frame = 0;

    const updateProgress = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const percent = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progress.current?.style.setProperty("--scroll-progress", `${percent}%`);
      });
    };
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    const sectionNodes = SECTION_LINKS.map(([id]) => document.getElementById(id)).filter(
      (node): node is HTMLElement => node !== null,
    );
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            document.querySelectorAll<HTMLElement>("[data-section-dot]").forEach((dot) => {
              const active = dot.dataset.sectionDot === entry.target.id;
              dot.setAttribute("aria-current", active ? "location" : "false");
            });
          }
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );
    sectionNodes.forEach((node) => observer.observe(node));

    if (finePointer && !reduce && !saveData) {
      const move = (event: PointerEvent) => {
        const target = event.target instanceof Element ? event.target : null;
        const cursorType = target?.closest("[data-cursor=media]") ? "media"
          : target?.closest("a,button,[role=button]")
          ? target.closest("a")?.getAttribute("target") === "_blank" ? "external" : "link"
          : target?.closest("input,textarea,[contenteditable=true]") ? "text" : "default";
        cursor.current?.setAttribute("data-state", cursorType);
        cursor.current?.style.setProperty("--cursor-x", `${event.clientX}px`);
        cursor.current?.style.setProperty("--cursor-y", `${event.clientY}px`);
      };
      document.addEventListener("pointermove", move, { passive: true });
      return () => {
        document.removeEventListener("pointermove", move);
        observer.disconnect();
        window.removeEventListener("scroll", updateProgress);
        window.removeEventListener("resize", updateProgress);
        cancelAnimationFrame(frame);
      };
    }

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div className="global-atmosphere" aria-hidden="true">
        {/* TODO(owen): add the approved 128px grain tile; texture is omitted until the asset exists. */}
        <span className="global-atmosphere-grid" />
      </div>
      <div className="scroll-progress" aria-hidden="true"><span ref={progress} /></div>
      <nav className="section-dots" aria-label="Section navigation">
        {SECTION_LINKS.map(([id, label]) => (
          <a key={id} href={`#${id}`} data-section-dot={id} aria-label={label} title={label}>
            <span aria-hidden="true" />
          </a>
        ))}
      </nav>
      <span className="signal-cursor" data-state="default" aria-hidden="true" ref={cursor}>
        <i /><b />
      </span>
    </>
  );
}
