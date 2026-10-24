// Typographic diagram of the multi-tenant portal. Every label comes from the
// project's own copy in data/projects.ts (overview, architecture, shortDescription):
// two Next.js frontends, an edge-only API gateway, five domain services that each
// own a Prisma schema, and RabbitMQ outbox/inbox relays between them.
const SERVICES = ["identity", "tenant", "ticket", "feedback", "notification"];

const box = "rounded-ui border border-field px-3 py-2";

export function ArchitectureDiagram() {
  return (
    <figure data-diagram className="mb-6 text-sm">
      <div className="space-y-2">
        <div className={`${box} text-foreground`}>Two Next.js frontends</div>

        <div className="mx-auto h-4 w-px bg-field" aria-hidden="true" />

        <div className="rounded-ui border-2 border-accent px-3 py-2 text-foreground">
          <span className="font-semibold">API gateway</span>
          <span className="text-muted"> — edge-only, no database. Verifies JWT, rate-limits, derives tenant context.</span>
        </div>

        <div className="mx-auto h-4 w-px bg-field" aria-hidden="true" />

        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {SERVICES.map((name) => (
            <li key={name} className={`${box} text-foreground`}>
              <span className="block font-medium">{name}-service</span>
              <span className="block text-xs text-muted">own Prisma schema</span>
            </li>
          ))}
        </ul>

        <div className="mx-auto h-4 w-px bg-field" aria-hidden="true" />

        <div className={`${box} text-muted`}>
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
