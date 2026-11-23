"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/motion";

type Action = "Login" | "Create ticket" | "Submit feedback";
type Tenant = "Acme" | "Globex";

type Journey = {
  route: string[];
  logs: string[];
};

// Nodes follow the documented service ownership: an edge-only gateway, five
// domain services, PostgreSQL per service, RabbitMQ as the outbox/inbox relay.
// TODO(owen): confirm Redis's exact role in the portal (throttling store or
// cache) and the literal event type names; the labels below stay generic until
// then.
const POINTS: Record<string, { label: string; x: number; y: number; kind: "edge" | "service" | "store" }> = {
  browser: { label: "Browser", x: 82, y: 210, kind: "edge" },
  gateway: { label: "API gateway", x: 258, y: 210, kind: "edge" },
  identity: { label: "identity-service", x: 432, y: 68, kind: "service" },
  tenant: { label: "tenant-service", x: 432, y: 158, kind: "service" },
  ticket: { label: "ticket-service", x: 432, y: 248, kind: "service" },
  feedback: { label: "feedback-service", x: 432, y: 338, kind: "service" },
  postgres: { label: "PostgreSQL", x: 636, y: 262, kind: "store" },
  rabbit: { label: "RabbitMQ", x: 636, y: 142, kind: "store" },
  notification: { label: "notification-service", x: 812, y: 68, kind: "service" },
  redis: { label: "Redis", x: 258, y: 356, kind: "store" },
};

const CONNECTIONS: Array<[string, string, boolean?]> = [
  ["browser", "gateway"],
  ["gateway", "identity"],
  ["gateway", "tenant"],
  ["gateway", "ticket"],
  ["gateway", "feedback"],
  ["ticket", "postgres"],
  ["feedback", "postgres"],
  ["postgres", "rabbit"],
  ["rabbit", "notification"],
  ["gateway", "redis", true],
];

const JOURNEYS: Record<Action, Journey> = {
  Login: {
    route: ["browser", "gateway", "identity"],
    logs: [
      "browser: POST /auth/login from the tenant subdomain",
      "gateway: JWT verified, tenant resolved",
      "identity-service: session issued in tenant scope",
    ],
  },
  "Create ticket": {
    route: ["browser", "gateway", "ticket", "postgres", "rabbit", "notification"],
    logs: [
      "browser: POST /tickets",
      "gateway: JWT verified, tenant resolved",
      "ticket-service: ticket written in tenant scope",
      "outbox: ticket.created committed with the mutation",
      "rabbitmq: event published with confirms",
      "notification-service: consumed once via inbox id",
    ],
  },
  "Submit feedback": {
    route: ["browser", "gateway", "feedback", "postgres", "rabbit"],
    logs: [
      "browser: POST /feedback",
      "gateway: JWT verified, tenant resolved",
      "feedback-service: response stored in tenant scope",
      "outbox: feedback.created committed with the mutation",
      "rabbitmq: published for local projections",
    ],
  },
};

const TICKETS: Record<Tenant, Array<{ id: string; title: string; state: string }>> = {
  Acme: [{ id: "TKT-1042", title: "Login loop on mobile Safari", state: "open" }],
  Globex: [],
};

function useJourneyMotion() {
  const timeline = useRef<gsap.core.Timeline | null>(null);
  useEffect(
    () => () => {
      timeline.current?.kill();
    },
    [],
  );
  return timeline;
}

export function RequestJourney() {
  const [tenant, setTenant] = useState<Tenant>("Acme");
  const [running, setRunning] = useState<Action | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const packetRef = useRef<SVGCircleElement>(null);
  const timeline = useJourneyMotion();

  useEffect(() => {
    timeline.current?.kill();
    setRunning(null);
    setLog([]);
  }, [tenant, timeline]);

  function run(action: Action) {
    if (running) return;
    const journey = JOURNEYS[action];
    const prefersReduced = !document.documentElement.hasAttribute("data-motion");
    const prefix = `${tenant.toLowerCase()}: `;
    setLog([]);

    if (prefersReduced || !packetRef.current) {
      setLog(journey.logs.map((line) => prefix + line));
      return;
    }

    const packet = packetRef.current;
    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(packet, { opacity: 0 });
        setRunning(null);
      },
    });
    timeline.current = tl;
    setRunning(action);

    const start = POINTS[journey.route[0]];
    tl.set(packet, { attr: { cx: start.x, cy: start.y }, opacity: 1 });

    journey.route.slice(1).forEach((node, index) => {
      const from = POINTS[journey.route[index]];
      const to = POINTS[node];
      tl.to(
        packet,
        {
          motionPath: { path: `M${from.x} ${from.y} L${to.x} ${to.y}` },
          duration: 0.6,
          ease: "power2.inOut",
        },
        index * 0.62,
      );
      tl.call(
        () => setLog((current) => [...current, prefix + journey.logs[index]]),
        undefined,
        index * 0.62 + 0.55,
      );
    });
  }

  const tickets = TICKETS[tenant];

  return (
    <section
      className="journey mt-6 rounded-ui border border-border bg-panel p-5 sm:p-6"
      data-tenant={tenant}
      aria-labelledby="journey-title"
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.16em] journey-accent">
            Interactive system sketch
          </p>
          <h3 id="journey-title" className="mt-2 text-xl font-semibold text-foreground">
            Request Journey
          </h3>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">
            A simplified view of how a request crosses the edge-only gateway and the domain
            services it owns. Simulation, illustrative only.
          </p>
        </div>

        <div
          className="inline-flex rounded-ui border border-border p-1"
          role="group"
          aria-label="Illustrative tenant"
        >
          {(["Acme", "Globex"] as Tenant[]).map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={tenant === value}
              onClick={() => setTenant(value)}
              className="min-h-9 rounded-ui px-3 font-mono text-xs uppercase tracking-wider text-foreground hover:bg-raised aria-pressed:bg-raised aria-pressed:text-foreground"
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 overflow-x-auto rounded-ui border border-border bg-background">
        <svg
          viewBox="0 0 900 424"
          role="img"
          aria-label="Architecture: browser to API gateway, then identity, tenant, ticket and feedback services, PostgreSQL, RabbitMQ and notification-service, with Redis at the edge."
          className="h-auto w-full min-w-[42rem]"
        >
          <g aria-hidden="true">
            {CONNECTIONS.map(([from, to, dashed]) => {
              const a = POINTS[from];
              const b = POINTS[to];
              if (!a || !b) return null;
              return (
                <line
                  key={`${from}-${to}`}
                  x1={a.x}
                  y1={a.y}
                  x2={b.x}
                  y2={b.y}
                  strokeWidth="1"
                  strokeDasharray={dashed ? "4 5" : undefined}
                  className="stroke-field"
                  opacity={dashed ? 0.45 : 0.35}
                />
              );
            })}

            {Object.entries(POINTS).map(([id, point]) => {
              const width = id === "notification" ? 156 : 140;
              return (
                <g key={id} className="journey-node" data-kind={point.kind}>
                  <rect
                    x={point.x - width / 2}
                    y={point.y - 21}
                    width={width}
                    height="42"
                    rx="3"
                    className="fill-panel stroke-field"
                    strokeWidth="1"
                  />
                  <text
                    x={point.x}
                    y={point.y + 4}
                    textAnchor="middle"
                    className="fill-foreground font-mono text-[10px]"
                    letterSpacing="0.04em"
                  >
                    {point.label}
                  </text>
                </g>
              );
            })}

            <circle
              ref={packetRef}
              r="4.5"
              cx={POINTS.browser.x}
              cy={POINTS.browser.y}
              className="journey-packet"
              opacity="0"
            />
          </g>
        </svg>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        {(Object.keys(JOURNEYS) as Action[]).map((action) => (
          <button
            type="button"
            key={action}
            onClick={() => run(action)}
            disabled={running !== null}
            className="min-h-10 rounded-ui border border-field px-3 text-sm text-foreground transition-colors hover:border-accent disabled:cursor-progress disabled:opacity-60 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            {action}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            timeline.current?.kill();
            setRunning(null);
            setLog([]);
            if (packetRef.current) gsap.set(packetRef.current, { opacity: 0 });
          }}
          className="min-h-10 px-3 text-sm text-muted underline underline-offset-4"
        >
          Clear log
        </button>
        <span className="ml-auto font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
          {running ? "running…" : "idle"}
        </span>
      </div>

      <ol
        aria-live="polite"
        aria-label="Illustrative request log"
        aria-busy={running !== null}
        className="mt-4 max-h-44 space-y-1 overflow-auto rounded-ui bg-background p-3 font-mono text-xs text-muted"
      >
        {log.length ? (
          log.map((line, index) => (
            <li key={`${index}-${line}`}>
              <span aria-hidden="true" className="journey-accent">
                ›{" "}
              </span>
              {line}
            </li>
          ))
        ) : (
          <li>Choose an action to step through an illustrative request.</li>
        )}
      </ol>

      <div className="mt-4 grid gap-3 rounded-ui border border-border p-3 text-sm sm:grid-cols-[9rem_minmax(0,1fr)]">
        <p className="font-mono text-[0.625rem] uppercase tracking-[0.12em] text-muted">
          {tenant} tickets
        </p>
        {tickets.length ? (
          <ul className="space-y-1 text-foreground">
            {tickets.map((ticket) => (
              <li key={ticket.id} className="tabular">
                <span className="text-muted">{ticket.id}</span> {ticket.title}{" "}
                <span className="text-muted">({ticket.state})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted">No tickets in this tenant. The other tenant&apos;s list stays separate.</p>
        )}
      </div>

      <p className="mt-3 text-xs text-muted">
        Tenant B&apos;s data is not shown here; this sketch does not connect to a live service.
      </p>
    </section>
  );
}
