import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for does not exist.",
  robots: { index: false, follow: true },
};

const primary =
  "inline-flex min-h-11 items-center gap-2 rounded-ui bg-accent px-5 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:opacity-80";
const secondary =
  "inline-flex min-h-11 items-center gap-2 rounded-ui border border-field px-5 text-sm font-medium text-foreground transition-colors hover:bg-raised active:bg-raised-hover";

export default function NotFound() {
  return (
    <section className="pb-24 pt-28 sm:pt-36">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p className="font-mono text-xs text-muted">404</p>
        <h1 className="mt-3 max-w-[20ch] text-4xl font-semibold leading-none tracking-tight text-foreground sm:text-5xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-[55ch] text-base leading-relaxed text-muted">
          The URL may be mistyped, or the page may have moved. Everything on the
          site is reachable from the home page.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link href="/" className={primary}>
            <ArrowLeft size={16} aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/#projects" className={secondary}>
            Browse projects
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
