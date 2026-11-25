"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { waitForRouteCommit } from "@/lib/view-transition";

type LinkProps = ComponentProps<typeof Link>;

/**
 * A Next.js link that hands navigation to the browser's View Transitions API
 * when the visitor allows it, so the shared project media can morph from the
 * home stack into the case-study hero.
 *
 * Next.js 16.4 removed `experimental.viewTransition`, and the installed React
 * 19.2 does not export `<ViewTransition>` yet, so this uses the same native API
 * directly. The destination page must carry a matching `view-transition-name`.
 *
 * If the API is missing, motion is reduced, the connection is slow, or the
 * visitor opens a new tab, this is an ordinary `next/link`: no interception,
 * no waiting. Route changes without it still get the GSAP fade in
 * MotionEffects, and reduced-motion visitors get no transition at all.
 */
export function ViewTransitionLink({ href, onClick, ...props }: LinkProps) {
  const router = useRouter();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Let the browser handle new tabs, new windows, downloads and modified clicks.
    if (
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      props.target === "_blank" ||
      props.download != null
    ) {
      return;
    }

    const hrefString = typeof href === "string" ? href : null;
    if (!hrefString || !hrefString.startsWith("/") || hrefString === window.location.pathname) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (
      navigator as Navigator & {
        connection?: { saveData?: boolean; effectiveType?: string };
      }
    ).connection;
    const slow =
      connection?.saveData === true || /^(slow-2g|2g)$/.test(connection?.effectiveType ?? "");

    if (reduce || slow || typeof document.startViewTransition !== "function") return;

    event.preventDefault();

    // Prefetched routes commit quickly. The signal comes from MotionLoader's
    // pathname effect rather than requestAnimationFrame: rendering is paused
    // while the browser holds the old snapshot, so rAF would never fire.
    const committed = waitForRouteCommit();

    // Mark the navigation before the new page commits: MotionEffects reads and
    // consumes this in its setup, so the GSAP route fade never runs on top of
    // the browser's snapshot. One element, one library.
    document.documentElement.setAttribute("data-vt", "active");

    try {
      const transition = document.startViewTransition(async () => {
        router.push(hrefString);
        await committed;
      });

      // If the motion chunk never loads, the marker must not leak into a later
      // navigation; clear it once the transition has finished or been skipped.
      const clearMarker = () =>
        window.setTimeout(() => {
          if (document.documentElement.getAttribute("data-vt") === "active") {
            document.documentElement.removeAttribute("data-vt");
          }
        }, 4000);
      transition.finished.then(clearMarker, clearMarker);
    } catch {
      // The API can refuse a transition while another one is active. Navigation
      // must still happen: fall back to the router and the GSAP fade.
      document.documentElement.removeAttribute("data-vt");
      router.push(hrefString);
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
