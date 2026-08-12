"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Card } from "@/components/ui/Card";
import { siteConfig } from "@/data/site-config";
import { Mail } from "lucide-react";
import { GithubIcon } from "@/components/icons/GithubIcon";

// Formspree form endpoint — submissions are sent straight from the
// browser (no server route or API key needed). Uses the AJAX protocol:
// POST JSON with an `Accept: application/json` header.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpzkegj";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage(null);
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          // `_subject` sets the email subject in Formspree.
          _subject: formData.subject,
          message: formData.message,
          // Honeypot — Formspree drops submissions that fill it in.
          _gotcha: "",
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        // Surface Formspree's real reason (spam filter, validation, ...)
        // instead of a generic failure message.
        const firstError =
          Array.isArray(data?.errors) && data.errors.length > 0
            ? typeof data.errors[0] === "string"
              ? data.errors[0]
              : (data.errors[0]?.message ?? null)
            : typeof data?.error === "string"
              ? data.error
              : null;
        setErrorMessage(firstError || "Failed to send message. Please try again.");
        setStatus("error");
      }
    } catch {
      setErrorMessage("Network error — please check your connection and try again.");
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="relative py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          path="contact"
          title="Get In Touch"
          description="Have a project in mind or want to collaborate? I'd love to hear from you."
        />

        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent-violet focus:outline-none"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent-violet focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-foreground">Subject</label>
              <input
                id="subject"
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent-violet focus:outline-none"
                placeholder="What's this about?"
              />
            </div>
            <div>
              <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
              <textarea
                id="message"
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:border-accent-violet focus:outline-none"
                placeholder="Tell me about your project..."
              />
            </div>
            <button
              type="submit"
              disabled={status === "loading"}
              className="rounded-lg bg-accent-violet px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-violet/90 disabled:opacity-50"
            >
              {status === "loading" ? "Sending..." : "Send Message"}
            </button>
            {status === "success" && <p className="text-sm text-green-600">Message sent successfully!</p>}
            {status === "error" && errorMessage && (
              <p className="text-sm text-red-600">{errorMessage}</p>
            )}
          </form>
        </Card>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <a href={`mailto:${siteConfig.email}`} className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <Mail size={16} aria-hidden="true" />
            {siteConfig.email}
          </a>
          <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-muted hover:text-foreground">
            <GithubIcon size={16} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </div>
    </section>
  );
}
