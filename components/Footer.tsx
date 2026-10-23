import { siteConfig } from "@/data/site-config";
import { getWhatsAppLink } from "@/lib/utils";

const FOOTER_NAV = [
  { label: "About", href: "/#about" },
  { label: "Skills", href: "/#skills" },
  { label: "Projects", href: "/#projects" },
  { label: "Experience", href: "/#experience" },
  { label: "Contact", href: "/#contact" },
];

const linkClass =
  "inline-flex min-h-11 items-center text-sm text-muted underline-offset-4 hover:text-foreground hover:underline";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="border-t border-border py-10">
      <div className="mx-auto grid max-w-5xl gap-8 px-4 sm:px-6 md:grid-cols-[minmax(0,1fr)_auto_auto] md:gap-12">
        <div>
          <p className="text-base font-semibold text-foreground">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-muted">{siteConfig.title}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul>
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={linkClass}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ul aria-label="Elsewhere">
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
      </div>

      <div className="mx-auto mt-8 max-w-5xl border-t border-border px-4 pt-6 sm:px-6">
        <p className="text-xs text-muted">
          © <span className="tabular">{year}</span> {siteConfig.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}
