/**
 * Marks which navbar link is current. Pure DOM, no animation library, so the
 * navbar can call it on click without pulling GSAP into the first-load bundle.
 * The scroll-spy in MotionEffects calls it as sections pass the probe line.
 * Pass "" to clear. Styling lives in CSS (`data-[active=true]` on the links).
 */
let current = "";

function apply(link: HTMLElement) {
  if (link.dataset.navLink === current) {
    link.setAttribute("aria-current", "location");
    link.dataset.active = "true";
  } else {
    link.removeAttribute("aria-current");
    delete link.dataset.active;
  }
}

export function setNavActive(id: string) {
  current = id;
  document.querySelectorAll<HTMLElement>("[data-nav-link]").forEach(apply);
}

/** Ref callback for links that mount later (the mobile menu), so they start in the right state. */
export function syncNavLink(link: HTMLElement | null) {
  if (link) apply(link);
}
