"use client";

import { useRef, type ReactNode } from "react";
import { gsap } from "@/lib/motion";

/**
 * A commit in the experience graph. Native <details> keeps it keyboard
 * operable and understandable without JavaScript; when motion is allowed the
 * disclosure animates its own height instead of snapping open.
 */
export function GitCommit({
  hash,
  title,
  meta,
  lane,
  children,
}: {
  hash: string;
  title: string;
  meta: string;
  lane: "work" | "study";
  children: ReactNode;
}) {
  const details = useRef<HTMLDetailsElement>(null);
  const body = useRef<HTMLDivElement>(null);

  function animate(event: React.MouseEvent<HTMLElement>) {
    if (!document.documentElement.hasAttribute("data-motion")) return;
    const element = details.current;
    const content = body.current;
    if (!element || !content) return;

    event.preventDefault();
    gsap.killTweensOf(content);

    if (element.open) {
      gsap.to(content, {
        height: 0,
        opacity: 0,
        duration: 0.22,
        ease: "power2.in",
        onComplete: () => {
          element.open = false;
          gsap.set(content, { clearProps: "height,opacity" });
        },
      });
      return;
    }

    element.open = true;
    gsap.fromTo(
      content,
      { height: 0, opacity: 0 },
      {
        height: "auto",
        opacity: 1,
        duration: 0.34,
        ease: "power2.out",
        onComplete: () => gsap.set(content, { clearProps: "height,opacity" }),
      },
    );
  }

  return (
    <details ref={details} className="git-commit group/commit" data-lane={lane}>
      <summary
        onClick={animate}
        className="git-commit-summary flex cursor-pointer list-none items-start gap-3 py-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
      >
        <span
          aria-hidden="true"
          className="git-node mt-[0.45rem] shrink-0"
        />
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span aria-hidden="true" className="font-mono text-[0.625rem] text-muted">
              {hash}
            </span>
            <span className="text-sm font-medium leading-snug text-foreground">{title}</span>
          </span>
          <span className="mt-0.5 block font-mono text-[0.6875rem] tabular text-muted">{meta}</span>
        </span>
        <span
          aria-hidden="true"
          className="git-chev mt-1 font-mono text-xs text-muted transition-transform duration-200"
        >
          ›
        </span>
      </summary>
      <div ref={body} className="git-commit-body overflow-hidden">
        <div className="pb-4 pl-6 text-sm leading-relaxed text-muted">{children}</div>
      </div>
    </details>
  );
}
