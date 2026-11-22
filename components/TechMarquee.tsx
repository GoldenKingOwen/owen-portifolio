"use client";

import { useEffect, useRef, useState } from "react";

const technologies = ["NestJS", "Next.js", "TypeScript", "PostgreSQL", "RabbitMQ", "Docker", "Linux"];

export function TechMarquee() {
  const ref = useRef<HTMLDivElement>(null);
  const [motionAllowed, setMotionAllowed] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const small = window.matchMedia("(max-width: 767px)");
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const update = () => setMotionAllowed(!reduced.matches && !small.matches && !saveData);
    update();
    reduced.addEventListener("change", update);
    small.addEventListener("change", update);
    return () => {
      reduced.removeEventListener("change", update);
      small.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!motionAllowed || !ref.current) return;
    let previousY = window.scrollY;
    let previousTime = performance.now();
    let raf = 0;
    let velocity = 0;
    let direction = -1;
    const update = (time: number) => {
      const y = window.scrollY;
      const dt = Math.max(16, time - previousTime);
      direction = y >= previousY ? -1 : 1;
      velocity += (Math.min(1.8, Math.abs(y - previousY) / dt * 12) - velocity) * 0.12;
      ref.current?.style.setProperty("--marquee-speed", `${Math.max(24, 70 - velocity * 25)}s`);
      ref.current?.style.setProperty("--marquee-direction", String(direction));
      previousY = y;
      previousTime = time;
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [motionAllowed]);

  return (
    <div className="border-y border-border bg-panel py-4" aria-label="Technologies">
      {motionAllowed ? (
        <div ref={ref} className="tech-marquee-track mx-auto flex w-max gap-6 font-mono text-xs uppercase tracking-[0.16em] text-muted" aria-hidden="true">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-6">
              {technologies.map((technology) => <span key={technology}>{technology}<span className="ml-6 text-accent">✦</span></span>)}
            </span>
          ))}
        </div>
      ) : (
        <ul className="mx-auto flex max-w-5xl flex-wrap justify-center gap-x-5 gap-y-3 px-4 font-mono text-xs uppercase tracking-[0.16em] text-muted">
          {technologies.map((technology) => <li key={technology}>{technology}</li>)}
        </ul>
      )}
      <span className="sr-only">{technologies.join(", ")}</span>
    </div>
  );
}
