// Typographic diagram of the multi-tenant portal. Every label comes from the
// project's own copy in data/projects.ts (overview, architecture, shortDescription):
// two Next.js frontends, an edge-only API gateway, five domain services that each
// own a Prisma schema, and RabbitMQ outbox/inbox relays between them.
//
// Motion hooks: the connectors are SVG lines (data-draw), drawn with DrawSVG when
// the diagram scrolls into view; the HTML boxes wipe in with a clip-path
// (data-diagram-box). Without JavaScript or with reduced motion it is all simply there.
const SERVICES = ["identity", "tenant", "ticket", "feedback", "notification"];

const box = "rounded-ui border border-field px-3 py-2";

function Connector() {
  return (
    <svg
      data-draw=""
      aria-hidden="true"
      width="1"
      height="16"
      viewBox="0 0 1 16"
      fill="none"
      className="mx-auto block text-field"
    >
      <line x1="0.5" y1="0" x2="0.5" y2="16" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function ArchitectureDiagram() {
  return (
    <figure data-diagram="" className="mb-6 text-sm">
      <div className="space-y-2">
        <div data-diagram-box="" className={`${box} text-foreground`}>
          Two Next.js frontends
        </div>

        <Connector />

        <div
          data-diagram-box=""
          className="rounded-ui border-2 border-accent px-3 py-2 text-foreground"
        >
          <span className="font-semibold">API gateway</span>
          <span className="text-muted">
            {" "}
            — edge-only, no database. Verifies JWT, rate-limits, derives tenant context.
          </span>
        </div>

        <Connector />

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SERVICES.map((name) => (
            <li key={name} data-diagram-box="" className={`${box} text-foreground`}>
              <span className="block font-medium">{name}-service</span>
              <span className="block text-xs text-muted">own Prisma schema</span>
            </li>
          ))}
        </ul>

        <Connector />

        <div data-diagram-box="" className={`${box} text-muted`}>
          <span className="font-medium text-foreground">RabbitMQ</span> — transactional outbox
          relays publish with confirms; consumers dedupe by inbox event ID.
        </div>
      </div>
      <figcaption className="mt-3 text-xs text-muted">
        Labels taken from the project notes; not a full deployment diagram.
      </figcaption>
    </figure>
  );
}
