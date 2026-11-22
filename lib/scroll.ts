export function scrollToSection(href: string, offset = 64) {
  const element = document.querySelector<HTMLElement>(href);
  if (!element) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = window.__portfolioLenis;
  if (lenis && !reduce) {
    lenis.scrollTo(element, { offset: -offset, immediate: false });
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: reduce ? "instant" : "smooth" });
}
