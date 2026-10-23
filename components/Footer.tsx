import { siteConfig } from "@/data/site-config";
import { getWhatsAppLink } from "@/lib/utils";

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-foreground hover:underline";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="border-t border-border py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted">
          <span className="font-semibold text-foreground">{siteConfig.name}</span>
          <span aria-hidden="true"> · </span>© <span className="tabular">{year}</span>. Built with Next.js.
        </p>

        <nav aria-label="Elsewhere">
          <ul className="flex flex-wrap gap-x-5">
            <li>
              <a
                href={siteConfig.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                GitHub
              </a>
            </li>
            <li>
              <a href={`mailto:${siteConfig.email}`} className={linkClass}>
                Email
              </a>
            </li>
            <li>
              <a
                href={getWhatsAppLink(siteConfig.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                WhatsApp
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
