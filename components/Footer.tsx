import { siteConfig } from "@/data/site-config";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { getWhatsAppLink } from "@/lib/utils";
import { LocalTime } from "@/components/LocalTime";
import { BackToTop } from "@/components/BackToTop";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-foreground hover:underline";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="border-t border-border">
      <div className="flag-rule" aria-hidden="true">
        <span /><span /><span />
      </div>
      <div className="py-8">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <p data-footer-wordmark="" aria-hidden="true" className="footer-wordmark mb-8 text-center font-display text-[clamp(2.5rem,11vw,8rem)] leading-none tracking-tight">OWEN MATOLA</p>
      </div>
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p data-footer-item="" className="text-sm text-muted">
          <span className="font-semibold text-foreground">{siteConfig.name}</span>
          <span aria-hidden="true"> · </span>© <span className="tabular">{year}</span>. Built with Next.js and GSAP.
          <span className="ml-2"><LocalTime /></span>
        </p>

        <div data-footer-item="" className="flex items-center gap-5">
        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <ExternalLink href={siteConfig.githubUrl} className={`${linkClass} gap-1`}>
                GitHub
              </ExternalLink>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                Email
              </a>
            </li>
            <li>
              <ExternalLink
                href={getWhatsAppLink(siteConfig.whatsapp)}
                className={`${linkClass} gap-1`}
              >
                WhatsApp
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={`${siteConfig.githubUrl}/owen-portifolio`} className={`${linkClass} gap-1`}>
                Website source
              </ExternalLink>
            </li>
          </ul>
        </nav>
        <BackToTop />
        </div>
      </div>
      </div>
    </footer>
  );
}
