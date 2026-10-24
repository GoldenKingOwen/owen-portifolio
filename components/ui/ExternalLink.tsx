import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * A link that leaves the site. The arrow is only used here, so an arrow always
 * means "this goes elsewhere"; internal links never carry one.
 *
 * Text and arrow share one inline span so that when a long label wraps, the
 * arrow stays attached to the last word instead of stranding at the link edge.
 */
export function ExternalLink({
  children,
  ...props
}: { children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">) {
  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      <span>
        {children}
        <ArrowUpRight
          size={14}
          aria-hidden="true"
          className="ml-1 inline-block align-[-0.125em]"
        />
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
