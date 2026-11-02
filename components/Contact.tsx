"use client";

import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { ExternalLink } from "@/components/ui/ExternalLink";
import { Card } from "@/components/ui/Card";
import { Magnetic } from "@/components/motion/Magnetic";
import { siteConfig } from "@/data/site-config";
import { getWhatsAppLink } from "@/lib/utils";

// Formspree form endpoint — submissions are sent straight from the
// browser (no server route or API key needed). Uses the AJAX protocol:
// POST JSON with an `Accept: application/json` header.
const FORMSPREE_ENDPOINT = "https://formspree.io/f/mrpzkegj";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FieldName = "name" | "email" | "subject" | "message";
type FieldErrors = Partial<Record<FieldName, string>>;

function validate(values: Record<FieldName, string>): FieldErrors {
  const errors: FieldErrors = {};
  const name = values.name.trim();
  const email = values.email.trim();
  const subject = values.subject.trim();
  const message = values.message.trim();

  if (!name) errors.name = "Please enter your name.";
  else if (name.length > 80) errors.name = "Please use 80 characters or fewer.";

  if (!email) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(email)) errors.email = "Please enter a valid email address.";

  if (!subject) errors.subject = "Please add a subject.";
  else if (subject.length > 120) errors.subject = "Please use 120 characters or fewer.";

  if (!message) errors.message = "Please add a message.";
  else if (message.length < 10) errors.message = "Please add at least 10 characters.";
  else if (message.length > 5000) errors.message = "Please keep the message under 5,000 characters.";

  return errors;
}

const fieldClass =
  "block w-full rounded-ui border border-field bg-background px-3 py-3 text-base text-foreground focus-visible:outline-offset-1 aria-[invalid=true]:border-danger";
const labelClass = "mb-1.5 block text-sm font-medium text-foreground";
const errorClass = "mt-1.5 text-sm font-medium text-danger";
const channelLink =
  "inline-flex min-h-11 min-w-0 [overflow-wrap:anywhere] items-center gap-1 text-sm font-medium text-foreground underline decoration-border decoration-2 underline-offset-4 hover:decoration-accent";

export function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  function updateField(field: FieldName, value: string) {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    if (status === "error" || status === "success") setStatus("idle");
    if (errorMessage) setErrorMessage(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (status === "loading") return;

    const nextErrors = validate(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setErrorMessage(null);
      setStatus("idle");
      const firstInvalid = (["name", "email", "subject", "message"] as const).find(
        (field) => nextErrors[field]
      );
      if (firstInvalid) document.getElementById(firstInvalid)?.focus();
      return;
    }

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
          name: formData.name.trim(),
          email: formData.email.trim(),
          // `_subject` sets the email subject in Formspree.
          _subject: formData.subject.trim(),
          message: formData.message.trim(),
          // Honeypot — Formspree drops submissions that fill it in.
          _gotcha: honeypot,
        }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        setHoneypot("");
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
      {/* Closing headline: the existing sentence, set large. Its lines rise out of a mask
          as it scrolls into view (motion layer); it is plain text without JavaScript. */}
      <p
        data-split="lines-scroll"
        className="max-w-[20ch] text-3xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-5xl"
      >
        Have a project in mind or want to collaborate?
      </p>
      <p className="mt-4 max-w-[60ch] text-base text-muted sm:text-lg">
        Write to me directly, or use the form.
      </p>

      <div className="mt-8">
        <Magnetic>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-flex min-h-11 items-center text-xl font-semibold tracking-tight text-foreground [overflow-wrap:anywhere] underline decoration-border decoration-2 underline-offset-8 hover:decoration-accent sm:text-4xl"
          >
            {siteConfig.email}
          </a>
        </Magnetic>
      </div>

      {/* A plain list of channels. */}
      <ul className="mt-10 max-w-[34rem] border-t border-border text-sm">
        <li className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-border">
          <span className="text-muted">Email</span>
          <a href={`mailto:${siteConfig.email}`} className={channelLink}>
            {siteConfig.email}
          </a>
        </li>
        <li className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-border">
          <span className="text-muted">GitHub</span>
          <ExternalLink href={siteConfig.githubUrl} className={channelLink}>
            {siteConfig.githubUsername}
          </ExternalLink>
        </li>
        <li className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-border">
          <span className="text-muted">WhatsApp</span>
          <ExternalLink href={getWhatsAppLink(siteConfig.whatsapp)} className={channelLink}>
            {siteConfig.whatsapp}
          </ExternalLink>
        </li>
        <li className="grid grid-cols-[7rem_1fr] items-center gap-4 border-b border-border">
          <span className="text-muted">CV</span>
          <a href="/cv/OwenCV.pdf" download className={channelLink}>
            Download CV (PDF)
          </a>
        </li>
      </ul>

      <Card as="div" className="mt-12 max-w-xl">
        <form onSubmit={handleSubmit} noValidate aria-busy={status === "loading"} className="space-y-5">
          {/* Honeypot: hidden from people, filled by basic spam bots. Formspree drops it. */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="company-website">Company website</label>
            <input
              id="company-website"
              name="_gotcha"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <p role="alert" className="text-sm font-medium text-danger">
              Please check the highlighted fields and try again.
            </p>
          )}

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
                maxLength={80}
                required
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? "name-error" : undefined}
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className={fieldClass}
              />
              {errors.name && (
                <p id="name-error" className={errorClass}>
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="email" className={labelClass}>
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                maxLength={254}
                required
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={errors.email ? "email-error" : undefined}
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className={fieldClass}
              />
              {errors.email && (
                <p id="email-error" className={errorClass}>
                  {errors.email}
                </p>
              )}
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
              maxLength={120}
              required
              aria-invalid={errors.subject ? true : undefined}
              aria-describedby={errors.subject ? "subject-error" : undefined}
              value={formData.subject}
              onChange={(e) => updateField("subject", e.target.value)}
              className={fieldClass}
            />
            {errors.subject && (
              <p id="subject-error" className={errorClass}>
                {errors.subject}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="message" className={labelClass}>
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              maxLength={5000}
              required
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={errors.message ? "message-error" : undefined}
              value={formData.message}
              onChange={(e) => updateField("message", e.target.value)}
              className={fieldClass}
            />
            {errors.message && (
              <p id="message-error" className={errorClass}>
                {errors.message}
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Magnetic>
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex min-h-11 items-center rounded-ui bg-accent px-6 text-sm font-medium text-accent-ink transition-opacity hover:opacity-90 active:opacity-80 disabled:cursor-wait disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send message"}
              </button>
            </Magnetic>

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
      </Card>
    </Section>
  );
}
