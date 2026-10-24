import Link from "next/link";
import type { ElementType, HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The one card in this system. A flat surface one step off the page, a 1px
 * border, the single 3px radius. No shadow, no gradient, no blur.
 *
 * Variants
 *  - default: static content, no hover.
 *  - interactive: the title holds the card's single link, stretched over the
 *    whole card with ::after (so there are never nested links). Hover moves
 *    the border and surface only, in 150ms, with no transform.
 *  - featured (modifier): wider, more padding, a 2px teal top border. One lead
 *    card per section; combine it with interactive when the lead is a link.
 *
 * Never place a Card inside a Card.
 */
type CardProps = Omit<HTMLAttributes<HTMLElement>, "title"> & {
  as?: "article" | "div" | "li";
  variant?: "default" | "interactive";
  featured?: boolean;
  children: ReactNode;
};

export function Card({
  as: Tag = "article",
  variant = "default",
  featured = false,
  className,
  children,
  ...props
}: CardProps) {
  const interactive = variant === "interactive";
  return (
    <Tag
      // Stable hooks for the motion pass.
      data-card={featured ? `${variant}-featured` : variant}
      data-reveal=""
      className={cn(
        "group relative flex min-w-0 flex-col rounded-ui border border-border bg-raised",
        featured ? "border-t-2 border-t-accent p-6 sm:p-8" : "p-5 sm:p-6",
        interactive &&
          cn(
            "transition-colors duration-150",
            // A featured card keeps its teal top border on hover.
            featured ? "hover:border-x-field hover:border-b-field" : "hover:border-field",
            "hover:bg-raised-hover",
            // The focus ring belongs to the card, drawn when its title link has keyboard focus.
            "has-[.card-link:focus-visible]:outline-2 has-[.card-link:focus-visible]:outline-offset-4 has-[.card-link:focus-visible]:outline-accent"
          ),
        className
      )}
      {...(props as HTMLAttributes<HTMLElement>)}
    >
      {children}
    </Tag>
  );
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return <header className={cn("flex flex-col gap-1", className)}>{children}</header>;
}

/** The card's heading. With `href` it is the single, stretched link of an interactive card. */
export function CardTitle({
  as: Heading = "h3",
  href,
  featured = false,
  className,
  children,
}: {
  as?: ElementType;
  href?: string;
  featured?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const size = featured ? "text-2xl leading-tight tracking-tight sm:text-3xl" : "text-lg leading-snug";
  return (
    <Heading className={cn("font-semibold text-foreground", size, className)}>
      {href ? (
        <Link
          href={href}
          // Outline is drawn on the card (see Card); the ::after stretches the target.
          className="card-link underline decoration-border decoration-2 underline-offset-4 outline-none transition-[text-decoration-color] duration-150 after:absolute after:inset-0 after:content-[''] group-hover:decoration-accent"
        >
          {children}
        </Link>
      ) : (
        children
      )}
    </Heading>
  );
}

/** One mono, muted meta line under the title (status, date range, organisation). */
export function CardMeta({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={cn("font-mono text-xs text-muted", className)}>{children}</p>;
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mt-4 flex-1", className)}>{children}</div>;
}

/**
 * Links row. Sits above a stretched title link; the row itself ignores the
 * pointer so empty space still activates the card, while the links stay live.
 */
export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <footer
      className={cn(
        "pointer-events-none relative z-10 mt-5 flex flex-wrap gap-x-6 gap-y-2 [&_a]:pointer-events-auto",
        className
      )}
    >
      {children}
    </footer>
  );
}
