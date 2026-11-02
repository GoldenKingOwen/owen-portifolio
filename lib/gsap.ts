import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { useGSAP } from "@gsap/react";

// Plugins are registered once, in the browser only. Only what is used is imported:
// core, ScrollTrigger, SplitText (hero, lead paragraph, closing headline) and
// DrawSVG (the architecture diagram connectors).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP);
  ScrollTrigger.config({
    // A mobile URL bar showing or hiding changes the viewport height; that must
    // not trigger a full ScrollTrigger refresh (it causes jank while scrolling).
    ignoreMobileResize: true,
    // The motion chunk loads after the page has loaded, so refreshing on DOMContentLoaded and
    // load would only repeat work already done at creation. Keep tab-visibility and resize.
    autoRefreshEvents: "visibilitychange,resize",
  });
}

/** The one ease for entrances: fast start, soft landing. Scrubbed rules use "none". */
export const EASE = "power3.out";

export { gsap, ScrollTrigger, SplitText, useGSAP };
