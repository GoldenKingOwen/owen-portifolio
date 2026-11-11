import { siteConfig } from "@/data/site-config";

/**
 * The opening screen, server-rendered so the name is painted by the browser
 * before any JavaScript arrives. It is hidden unless the pre-paint script in
 * layout.tsx sets html[data-intro]; components/Intro.tsx animates the letters
 * out of their masks and then uncovers the page.
 *
 * Decorative (aria-hidden): the same name and role are in the hero <h1>, and AT
 * users should never have to sit through a duplicate announcement.
 */
export function IntroOverlay() {
  // One span per letter, each inside its own overflow-hidden mask. Splitting on
  // the server keeps the animation independent of SplitText and of font load.
  const words = siteConfig.name.split(" ");

  return (
    <div
      data-intro-root=""
      aria-hidden="true"
      className="fixed inset-0 z-[60] grid place-items-center overflow-hidden bg-background"
    >
      <div className="hero-pool pointer-events-none absolute inset-0 opacity-80" />

      {/* A slow hairline grid ties the opening screen to the hero's ambient motif. */}
      <div
        className="hero-ambient-grid pointer-events-none absolute -inset-[20%] opacity-40"
        style={{ animation: "ambient-drift 40s ease-in-out infinite" }}
      />

      <div className="relative mx-auto w-full max-w-5xl px-4 sm:px-6">
        <p
          data-intro-meta=""
          className="font-mono text-[0.6875rem] uppercase tracking-[0.28em] text-muted"
        >
          Portfolio
        </p>

        <p className="mt-5 text-display font-semibold tracking-tight text-foreground">
          {words.map((word, wordIndex) => (
            <span key={word} className="inline-block whitespace-nowrap">
              {Array.from(word).map((letter, letterIndex) => (
                <span
                  key={`${letter}-${letterIndex}`}
                  className="inline-block overflow-hidden pb-[0.1em] align-bottom"
                >
                  <span data-intro-letter="" className="inline-block">
                    {letter}
                  </span>
                </span>
              ))}
              {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
            </span>
          ))}
        </p>

        <span
          data-intro-rule=""
          className="mt-7 block h-px w-full max-w-[22rem] bg-accent"
        />

        <p data-intro-sub="" className="mt-5 max-w-[42ch] text-lead text-muted">
          Full-Stack Software Developer in Malawi
        </p>
      </div>
    </div>
  );
}
