"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Command, useCommandState } from "cmdk";
import { ArrowUpRight, Copy, Download, Moon, Sun } from "lucide-react";
import { projects } from "@/data/projects";
import { siteConfig } from "@/data/site-config";
import { useTheme } from "@/components/ThemeProvider";
import { getWhatsAppLink } from "@/lib/utils";
import { scrollToSection } from "@/lib/scroll";

const SECTIONS = ["home", "about", "skills", "projects", "services", "experience", "education", "testimonials", "contact"];

export function CommandPalette({ onClose, onToast }: { onClose: () => void; onToast: (message: string) => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const original = document.activeElement;
    return () => {
      if (original instanceof HTMLElement) original.focus();
    };
  }, []);

  function goToSection(id: string) {
    onClose();
    if (pathname !== "/") {
      router.push(`/#${id}`);
      return;
    }
    scrollToSection(`#${id}`);
  }

  function openExternal(url: string) {
    window.open(url, "_blank", "noopener,noreferrer");
    onClose();
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(siteConfig.email);
      onToast("Email copied to clipboard");
    } catch {
      onToast(`Email: ${siteConfig.email}`);
    }
    onClose();
  }

  const demos = projects.filter((project) => project.links.live);
  const sections = SECTIONS.filter((id) => document.getElementById(id));

  return (
    <Command.Dialog open onOpenChange={(open) => !open && onClose()} label="Portfolio command palette" shouldFilter overlayClassName="command-overlay" contentClassName="command-content">
      <div className="command-shell">
        <div className="command-search-row">
          <Command.Input autoFocus placeholder="Search sections, projects, and actions…" aria-label="Search commands" />
          <kbd>ESC</kbd>
        </div>
        <Command.List className="command-list">
          <CommandEmpty>No matching commands.</CommandEmpty>
          <CommandGroup heading="Navigate">
            {sections.map((id) => (
              <CommandItem key={id} value={`Go to ${id}`} onSelect={() => goToSection(id)}>
                <span>Go to {id === "home" ? "Home" : id[0].toUpperCase() + id.slice(1)}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Projects">
            {projects.map((project) => (
              <CommandItem key={project.slug} value={`Open ${project.name} case study`} onSelect={() => { onClose(); router.push(`/projects/${project.slug}`); }}>
                <span>Case study · {project.name}</span>
              </CommandItem>
            ))}
            {demos.map((project) => (
              <CommandItem key={`${project.slug}-live`} value={`Open ${project.name} live demo`} onSelect={() => openExternal(project.links.live!)}>
                <span>Open {project.status === "Planning" ? "preview" : "live demo"} · {project.name}</span>
                <ArrowUpRight size={15} aria-hidden="true" />
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Actions">
            <CommandItem value="Copy email address" onSelect={() => void copyEmail()}><Copy size={15} aria-hidden="true" /><span>Copy email address</span></CommandItem>
            <CommandItem value="Open WhatsApp" onSelect={() => openExternal(getWhatsAppLink(siteConfig.whatsapp))}><span>Open WhatsApp</span><ArrowUpRight size={15} aria-hidden="true" /></CommandItem>
            <CommandItem value="Download CV PDF" onSelect={() => { onClose(); const link = document.createElement("a"); link.href = "/cv/Owen-Matola-CV.pdf"; link.download = "Owen-Matola-CV.pdf"; link.click(); }}><Download size={15} aria-hidden="true" /><span>Download CV</span></CommandItem>
            <CommandItem value="Toggle theme" onSelect={() => { toggleTheme(); onClose(); }}>{theme === "dark" ? <Sun size={15} aria-hidden="true" /> : <Moon size={15} aria-hidden="true" />}<span>Toggle theme</span></CommandItem>
            <CommandItem value="View source code GitHub" onSelect={() => openExternal(`${siteConfig.githubUrl}/owen-portifolio`)}><span>View source</span><ArrowUpRight size={15} aria-hidden="true" /></CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandLiveCount />
        </Command.List>
      </div>
    </Command.Dialog>
  );
}

function CommandGroup({ children, heading }: { children: React.ReactNode; heading: string }) {
  return <Command.Group heading={heading}>{children}</Command.Group>;
}

function CommandItem({ children, ...props }: React.ComponentProps<typeof Command.Item>) {
  return <Command.Item {...props}>{children}</Command.Item>;
}

function CommandSeparator() {
  return <Command.Separator />;
}

function CommandEmpty({ children }: { children: React.ReactNode }) {
  return <Command.Empty>{children}</Command.Empty>;
}

function CommandLiveCount() {
  const count = useCommandState((state) => state.filtered.count);
  return <p className="sr-only" aria-live="polite">{count} commands available</p>;
}
