import { Children } from "react";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";

/**
 * A link that leaves the site. The arrow is only used here, so an arrow always
 * means "this goes elsewhere"; internal links never carry one.
 *
 * The last word of the label and the arrow share a no-wrap span, so when a long
 * label wraps the arrow can never strand on a line of its own. On hover devices an
 * accent underline slides in over the hairline one and the arrow nudges up and
 * right (CSS transforms only).
 */
export function ExternalLink({
  children,
  className,
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
    <a
      target="_blank"
      rel="noopener noreferrer"
      className={`group/ext ${className ?? ""}`}
      {...props}
    >
      <span className="relative after:absolute after:inset-x-0 after:-bottom-[3px] after:h-0.5 after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 group-hover/ext:after:scale-x-100">
        {head}
        <span className="whitespace-nowrap">
          {tail}
          <ArrowUpRight
            size={14}
            aria-hidden="true"
            className="ml-1 inline-block align-[-0.125em] transition-transform duration-200 group-hover/ext:-translate-y-0.5 group-hover/ext:translate-x-0.5"
          />
        </span>
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
