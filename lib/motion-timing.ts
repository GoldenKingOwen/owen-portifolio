/**
 * One timing vocabulary for every animation on the site. Keeping the numbers
 * here means the hero, section reveals, hover states and diagram all speak the
 * same rhythm, and a future tuning pass changes one file.
 *
 * Durations are seconds (GSAP). CSS hover values live in the class names and
 * are kept in the same ranges documented in DESIGN.md.
 */
export const MOTION = {
  hero: {
    name: 0.7,
    headline: 0.6,
    portrait: 0.9,
    accent: 0.7,
    cta: 0.5,
    breath: 4.5,
  },
  section: {
    head: 0.7,
    rule: 0.8,
    reveal: 0.7,
    card: 0.65,
  },
  diagram: {
    box: 0.5,
    line: 0.45,
    step: 0.2,
    signal: 1.3,
  },
  overlay: {
    enter: 0.28,
    exit: 0.18,
  },
  stagger: {
    heroWords: 0.07,
    heroHeadline: 0.08,
    heroCta: 0.08,
    card: 0.1,
    list: 0.08,
  },
} as const;
