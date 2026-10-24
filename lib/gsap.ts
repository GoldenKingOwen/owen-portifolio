import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Plugins are registered once, in the browser only. Only gsap core and
// ScrollTrigger are imported; nothing else from the library is bundled.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // A mobile URL bar showing or hiding changes the viewport height; that must
  // not trigger a full ScrollTrigger refresh (it causes jank while scrolling).
  ScrollTrigger.config({
    ignoreMobileResize: true,
    // The motion chunk loads after the page has loaded, so refreshing on DOMContentLoaded and
    // load would only repeat work already done at creation. Keep tab-visibility and resize.
    autoRefreshEvents: "visibilitychange,resize",
  });
}

/** The one ease for entrances: fast start, soft landing. */
export const EASE = "power3.out";

export { gsap, ScrollTrigger, useGSAP };
