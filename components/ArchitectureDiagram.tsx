// Typographic diagram of the multi-tenant portal. Every label comes from the
// project's own copy in data/projects.ts (overview, architecture, shortDescription):
// two Next.js frontends, an edge-only API gateway, five domain services that each
// own a Prisma schema, and RabbitMQ outbox/inbox relays between them.
//
// Motion hooks: the connectors are SVG lines (data-draw), drawn with DrawSVG when
// the diagram scrolls into view; the HTML boxes wipe in with a clip-path
// (data-diagram-box). data-diagram-order sequences the drawing top to bottom, and
// the small teal circles are a restrained signal travelling along the connectors.
// Without JavaScript or with reduced motion it is all simply there.
const SERVICES = ["identity", "tenant", "ticket", "feedback", "notification"];

const box = "min-w-0 rounded-ui border border-field px-3 py-2 [overflow-wrap:anywhere]";

function Connector({ order }: { order: number }) {
  return (
    <svg
      data-draw=""
      data-diagram-order={order}
      aria-hidden="true"
      width="5"
      height="16"
      viewBox="0 0 5 16"
      fill="none"
      className="mx-auto block text-field"
    >
      <line x1="2.5" y1="0" x2="2.5" y2="16" stroke="currentColor" strokeWidth="1" />
      <circle
        data-diagram-signal=""
        cx="2.5"
        cy="0"
        r="1.3"
        fill="currentColor"
        className="text-accent"
      />
    </svg>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure data-diagram="" className="mb-6 text-sm">
      <div className="space-y-2">
        <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2">
          <div data-diagram-box="" data-diagram-order="1" className={`${box} text-foreground`}>
            <span className="block font-medium">Tenant workspace</span>
            <span className="block text-xs text-muted">
              Next.js App Router portal, tickets, feedback, billing
            </span>
          </div>
          <div data-diagram-box="" data-diagram-order="1" className={`${box} text-foreground`}>
            <span className="block font-medium">Platform admin</span>
            <span className="block text-xs text-muted">
              Next.js App Router admin, tenants, plans, users, logs
            </span>
          </div>
        </div>

        <Connector order={2} />

        <div
          data-diagram-box=""
          data-diagram-order="3"
          className="rounded-ui border-2 border-accent px-3 py-2 text-foreground"
        >
          <span className="font-semibold">API gateway</span>
          <span className="text-muted">
            {" "}
            — edge-only, no database. Verifies JWT, rate-limits, derives tenant context.
          </span>
        </div>

        <Connector order={4} />

        <ul className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-5">
          {SERVICES.map((name) => (
            <li
              key={name}
              data-diagram-box=""
              data-diagram-order="5"
              className={`${box} text-foreground`}
            >
              <span className="block font-medium">{name}-service</span>
              <span className="block text-xs text-muted">own Prisma schema</span>
            </li>
          ))}
        </ul>

        <Connector order={6} />

        <div data-diagram-box="" data-diagram-order="7" className={`${box} break-words text-muted`}>
          <span className="font-medium text-foreground">RabbitMQ</span> — transactional outbox
          relays publish with confirms; consumers dedupe by inbox event ID.
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        The two Next.js applications and service boundaries, taken from the project
        repository. Not a full deployment diagram.
      </figcaption>
    </figure>
  );
}
