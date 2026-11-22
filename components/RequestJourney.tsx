"use client";

import { useState } from "react";

type Action = "Login" | "Create ticket" | "Submit feedback";

const steps: Record<Action, string[]> = {
  Login: ["browser: request sent from tenant subdomain", "gateway: authenticated request routed", "identity-service: identity flow represented"],
  "Create ticket": ["browser: ticket request sent", "gateway: tenant context checked", "ticket-service: ticket mutation represented", "outbox: event published to RabbitMQ", "notification-service: event consumed"],
  "Submit feedback": ["browser: feedback request sent", "gateway: tenant context checked", "feedback-service: feedback mutation represented", "outbox: event published to RabbitMQ"],
};

export function RequestJourney() {
  const [tenant, setTenant] = useState("Acme");
  const [log, setLog] = useState<string[]>([]);
  const run = (action: Action) => setLog((current) => [...current, ...steps[action].map((line) => `${tenant.toLowerCase()}: ${line}`)]);
  return <section className="mt-6 rounded-ui border border-border bg-panel p-5 sm:p-6" aria-labelledby="journey-title">
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div><p className="font-mono text-xs uppercase tracking-[0.16em] text-accent">Interactive system sketch</p><h3 id="journey-title" className="mt-2 text-xl font-semibold text-foreground">Request Journey</h3><p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">A simplified view of how requests cross the gateway and domain services. Simulation, illustrative only.</p></div>
      <label className="text-sm text-muted">Illustrative tenant <select value={tenant} onChange={(event) => setTenant(event.target.value)} className="ml-2 min-h-10 rounded-ui border border-field bg-background px-2 text-foreground"><option>Acme</option><option>Globex</option></select></label>
    </div>
    <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Illustrated architecture">
      {["Next.js frontends", "API gateway", "Identity · Tenant · Ticket · Feedback · Notification", "RabbitMQ · PostgreSQL · Redis"].map((node, index) => <div key={node} className="rounded-ui border border-field p-3 text-sm text-foreground"><span className="mb-1 block font-mono text-xs text-muted">0{index + 1}</span>{node}</div>)}
    </div>
    <div className="mt-5 flex flex-wrap gap-2">{(["Login", "Create ticket", "Submit feedback"] as Action[]).map((action) => <button type="button" key={action} onClick={() => run(action)} className="min-h-10 rounded-ui border border-field px-3 text-sm text-foreground hover:border-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">{action}</button>)}<button type="button" onClick={() => setLog([])} className="min-h-10 px-3 text-sm text-muted underline underline-offset-4">Clear log</button></div>
    <ol aria-live="polite" aria-label="Illustrative request log" className="mt-4 max-h-40 space-y-1 overflow-auto rounded-ui bg-background p-3 font-mono text-xs text-muted">{log.length ? log.map((line, index) => <li key={`${index}-${line}`}>{line}</li>) : <li>Choose an action to step through an illustrative request.</li>}</ol>
    <p className="mt-3 text-xs text-muted">Tenant B&apos;s data is not shown here; this sketch does not connect to a live service.</p>
  </section>;
}
