import { setNavActive } from "@/lib/nav-active";

const NAV_IDS = ["about", "skills", "projects", "experience", "education", "contact"];

/**
 * The header border and the nav scroll-spy without any animation library, for
 * visitors who do not get motion (reduced-motion preference or a low-end
 * device). GSAP is never downloaded for them. IntersectionObserver reports
 * crossings off the main thread, so there is no scroll listener and no
 * per-scroll layout read. Returns a cleanup function.
 */
export function startNavSpy(): () => void {
  const header = document.querySelector<HTMLElement>("[data-site-header]");

  // Header border: a 1px sentinel 24px down the page; once it scrolls out of view, the page is scrolled.
  const sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:24px;left:0;width:1px;height:1px;pointer-events:none;";
  document.body.appendChild(sentinel);
  const scrolledObserver = new IntersectionObserver(([entry]) => {
    header?.setAttribute("data-scrolled", String(!entry.isIntersecting));
  });
  scrolledObserver.observe(sentinel);

  // Scroll-spy: a thin band 35% down the viewport; the section crossing it is current.
  const crossing = new Set<string>();
  const spyObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) crossing.add(entry.target.id);
        else crossing.delete(entry.target.id);
      }
      setNavActive(NAV_IDS.filter((id) => crossing.has(id)).pop() ?? "");
    },
    { rootMargin: "-35% 0px -64% 0px" }
  );
  let any = false;
  for (const id of NAV_IDS) {
    const section = document.getElementById(id);
    if (section) {
      spyObserver.observe(section);
      any = true;
    }
  }
  if (!any) setNavActive("");

  return () => {
    scrolledObserver.disconnect();
    spyObserver.disconnect();
    sentinel.remove();
  };
}
