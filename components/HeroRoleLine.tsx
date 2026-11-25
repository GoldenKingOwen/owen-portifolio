"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/data/site-config";

const ROLES = siteConfig.roles;

export function HeroRoleLine() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (paused || reduced) return;
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % ROLES.length), 2800);
    return () => window.clearInterval(timer);
  }, [paused, reduced]);

  return (
    <div className="hero-role" tabIndex={0} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <span className="sr-only">{ROLES.join(". ")}</span>
      <span aria-hidden="true" className="hero-role-visible" key={reduced ? "reduced" : index}>
        {ROLES[reduced ? 0 : index]}
      </span>
    </div>
  );
}
