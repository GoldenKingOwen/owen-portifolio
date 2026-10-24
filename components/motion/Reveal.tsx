import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Marks content as revealable. This is a server component with no GSAP in it:
 * the HTML is rendered and crawlable as usual, and the single batched
 * ScrollTrigger in MotionEffects finds `[data-reveal]` after hydration and
 * eases it in. Use it around prose or any block that is not already a Card
 * (Cards carry the hook themselves).
 */
export function Reveal({
  as: Tag = "div",
  children,
  ...props
}: { as?: ElementType; children: ReactNode } & HTMLAttributes<HTMLElement>) {
  return (
    <Tag data-reveal="" {...props}>
      {children}
    </Tag>
  );
}
