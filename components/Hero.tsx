"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Download, Mail } from "lucide-react";
import { siteConfig } from "@/data/site-config";
import { GlowOrb } from "@/components/ui/GlowOrb";

const FADE_UP = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Hero() {
  const prefersReducedMotion = useReducedMotion();

  const transition = (delay: number) =>
    prefersReducedMotion
      ? { duration: 0 }
      : { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const };

  function scrollTo(id: string) {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden pt-16"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <GlowOrb color="violet" size={480} className="-left-40 -top-20" />
        <GlowOrb color="blue" size={420} className="-bottom-32 -right-24" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-foreground) 1px, transparent 1px), linear-gradient(to bottom, var(--color-foreground) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            transition={transition(0)}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <span className="font-mono text-xs text-slate-300">
              {siteConfig.availableForOpportunities
                ? "Available for opportunities"
                : "Not currently available"}
            </span>
          </motion.div>

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            transition={transition(0.1)}
            className="font-display text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            {siteConfig.name}
          </motion.h1>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            transition={transition(0.2)}
            className="mt-3 font-mono text-sm text-accent-violet sm:text-base"
          >
            {siteConfig.title}
          </motion.p>

          <motion.p
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            transition={transition(0.3)}
            className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg"
          >
            {siteConfig.shortBio}
          </motion.p>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={FADE_UP}
            transition={transition(0.4)}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={() => scrollTo("#projects")}
              className="group inline-flex items-center gap-2 rounded-lg bg-accent-violet px-5 py-2.5 text-sm font-medium text-white transition-transform hover:-translate-y-0.5"
            >
              View My Projects
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </button>
            <button
              onClick={() => scrollTo("#contact")}
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent-violet/40"
            >
              <Mail size={16} aria-hidden="true" />
              Contact Me
            </button>
            <a
              href="/cv/OwenCV.pdf"
              download
              className="inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-muted transition-colors hover:text-foreground"
            >
              <Download size={16} aria-hidden="true" />
              Download CV
            </a>
          </motion.div>
        </div>

        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={transition(0.3)}
          className="relative mx-auto h-56 w-56 overflow-hidden rounded-full border border-border bg-surface backdrop-blur-sm sm:h-72 sm:w-72"
        >
          <Image
            src="/images/owen.jpeg"
            alt={siteConfig.name}
            fill
            priority
            sizes="(min-width: 640px) 288px, 224px"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 rounded-full bg-gradient-to-t from-accent-violet/10 to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}