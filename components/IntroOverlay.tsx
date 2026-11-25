import { siteConfig } from "@/data/site-config";

/** First-visit console. Its strings are decorative; the hero heading below is the accessible LCP content. */
export function IntroOverlay() {
  return (
    <div data-intro-root="" aria-hidden="true" className="intro-overlay">
      <div className="intro-console">
        {siteConfig.introLines.map((line) => <p key={line} data-intro-line="">{line}</p>)}
      </div>
    </div>
  );
}
