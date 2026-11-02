import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Marks an element as magnetic: on fine-pointer devices the INNER span drifts
 * toward the pointer (25% of the offset, within about 80px) and springs back on
 * leave. The OUTER span never moves, so the hit target and the layout stay put,
 * and keyboard focus is unaffected. Server component: it only renders the
 * markup; the behaviour lives in the lazy motion module (data-magnetic). Use it
 * on six elements at most.
 */
export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span data-magnetic="" className={cn("inline-flex", className)}>
      <span data-magnetic-inner="" className="inline-flex">
        {children}
      </span>
    </span>
  );
}
