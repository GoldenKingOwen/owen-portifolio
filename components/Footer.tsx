import { Mail, MessageCircle } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { siteConfig } from "@/data/site-config";
import { getWhatsAppLink } from "@/lib/utils";

const FOOTER_NAV = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 sm:px-6 md:flex-row md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-display text-base font-semibold text-foreground">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-sm text-muted">{siteConfig.title}</p>
        </div>

        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap items-center justify-center gap-5">
            {FOOTER_NAV.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="text-sm text-muted hover:text-foreground">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={siteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-foreground"
          >
            <GithubIcon size={16} aria-hidden="true" />
          </a>
          <a
            href={`mailto:${siteConfig.email}`}
            aria-label="Send an email"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-foreground"
          >
            <Mail size={16} aria-hidden="true" />
          </a>
          <a
            href={getWhatsAppLink(siteConfig.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Message on WhatsApp"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-surface text-muted hover:text-foreground"
          >
            <MessageCircle size={16} aria-hidden="true" />
          </a>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-border px-4 pt-6 text-center sm:px-6">
        <p className="text-xs text-muted">
          © {year} {siteConfig.name}. Built with Next.js.
        </p>
      </div>
    </footer>
  );
}