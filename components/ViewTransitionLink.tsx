"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";

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

    const hrefString = typeof href === "string" ? href : href.toString();
    if (!hrefString.startsWith("/") || hrefString === window.location.pathname) return;

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

    // Prefetched routes commit quickly; the bounded wait keeps a failed or slow
    // navigation from trapping the old frame in front of the visitor.
    const waitForDestination = new Promise<void>((resolve) => {
      const started = performance.now();
      const check = () => {
        const marker = document.querySelector("[data-view-target]");
        const arrived = marker?.getAttribute("data-view-target") === hrefString.split("/").pop();
        if ((arrived && window.location.pathname === hrefString) || performance.now() - started > 900) {
          resolve();
          return;
        }
        requestAnimationFrame(check);
      };
      requestAnimationFrame(check);
    });

    try {
      const transition = document.startViewTransition(async () => {
        router.push(hrefString);
        await waitForDestination;
      });

      // Tell the GSAP route fade that the browser is already animating this
      // navigation, so one element is never animated by two libraries.
      document.documentElement.setAttribute("data-vt", "active");
      transition.finished.then(
        () => document.documentElement.removeAttribute("data-vt"),
        () => document.documentElement.removeAttribute("data-vt"),
      );
    } catch {
      // The API can refuse a transition while another one is active. Navigation
      // must still happen: fall back to the router and the GSAP fade.
      document.documentElement.removeAttribute("data-vt");
      router.push(hrefString);
    }
  }

  return <Link href={href} onClick={handleClick} {...props} />;
}
