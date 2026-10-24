import { Children } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * A link that leaves the site. The arrow is only used here, so an arrow always
 * means "this goes elsewhere"; internal links never carry one.
 *
 * The last word of the label and the arrow share a no-wrap span, so when a
 * long label wraps the arrow can never strand on a line of its own.
 */
export function ExternalLink({
  children,
  ...props
}: { children: ReactNode } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel">) {
  const nodes = Children.toArray(children);
  const last = nodes[nodes.length - 1];

  let head: ReactNode[] = nodes;
  let tail: ReactNode = null;
  if (typeof last === "string") {
    const cut = last.trimEnd().lastIndexOf(" ");
    head = [...nodes.slice(0, -1), cut >= 0 ? last.slice(0, cut + 1) : ""];
    tail = cut >= 0 ? last.slice(cut + 1) : last;
  }

  return (
    <a target="_blank" rel="noopener noreferrer" {...props}>
      <span>
        {head}
        <span className="whitespace-nowrap">
          {tail}
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="ml-1 inline-block align-[-0.125em]"
          />
        </span>
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
