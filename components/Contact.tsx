"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { siteConfig } from "@/data/site-config";

// Formspree form endpoint — submissions are sent straight from the
// browser (no server route or API key needed). Uses the AJAX protocol:
// POST JSON with an `Accept: application/json` header.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpzkegj";

const fieldClass =
  "block w-full rounded-ui border border-field bg-background px-3 py-3 text-base text-foreground focus-visible:outline-offset-1";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
const textLink =
  "inline-flex min-h-11 items-center text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent";

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
    <Section id="contact" title="Contact" density="roomy" emphasis>
      <p className="max-w-[60ch] text-base leading-relaxed text-foreground sm:text-lg">
        Have a project in mind or want to collaborate? Write to me directly, or use the form.
      </p>

      <div className="mt-4 flex flex-wrap gap-x-6">
        <a href={`mailto:${siteConfig.email}`} className={textLink}>
          {siteConfig.email}
        </a>
        <a href={siteConfig.githubUrl} target="_blank" rel="noopener noreferrer" className={textLink}>
          GitHub profile
        </a>
      </div>

      <form onSubmit={handleSubmit} className="mt-10 max-w-xl space-y-5">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className={labelClass}>
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={fieldClass}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={fieldClass}
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className={labelClass}>
            Subject
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className={fieldClass}
          />
        </div>
        <div>
          <label htmlFor="message" className={labelClass}>
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="inline-flex min-h-11 items-center rounded-ui bg-accent px-6 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-60"
          >
            {status === "loading" ? "Sending…" : "Send message"}
          </button>

          {/* Live region stays mounted so screen readers announce the result. */}
          <p role="status" aria-live="polite" className="text-sm font-medium text-success">
            {status === "success" ? "Message sent. I will reply to the email you gave." : ""}
          </p>
        </div>
        {status === "error" && errorMessage && (
          <p role="alert" className="text-sm font-medium text-danger">
            {errorMessage}
          </p>
        )}
      </form>
    </Section>
  );
}
