import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types";

/**
 * Media plate for a project panel: a browser frame around a real screenshot, or
 * original blueprint art built from the project's own architecture when no
 * screenshot exists. Nothing here pretends to be a live interface.
 */
export function ProjectMedia({ project }: { project: Project }) {
  const liveHost = project.links.live
    ? project.links.live.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : project.status === "Planning"
      ? "preview build"
      : "internal preview";

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="media"
      aria-label={`View the ${project.name} case study`}
      className="group/media block rounded-ui focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
    >
      <div className="project-media-frame">
        <div className="project-media-bar" aria-hidden="true">
          <span className="project-media-dots">
            <i /><i /><i />
          </span>
          <span className="project-media-url">{liveHost}</span>
        </div>
        <div className="relative aspect-[16/10] overflow-hidden border-t border-border bg-panel">
          {project.image ? (
            <Image
              src={project.image}
              alt={project.imageAlt ?? ""}
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover object-top transition-transform duration-500 ease-out group-hover/media:scale-[1.02]"
            />
          ) : (
            <Blueprint slug={project.slug} />
          )}
          <span aria-hidden="true" className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/10" />
        </div>
      </div>
      {project.previewNote && (
        <span className="mt-2 block font-mono text-[0.625rem] uppercase tracking-[0.14em] text-muted">
          {project.previewNote}
        </span>
      )}
    </Link>
  );
}

/** Original generated art, one composition per project without a screenshot. */
function Blueprint({ slug }: { slug: string }) {
  return (
    <div className="absolute inset-0 text-panel-ink" aria-hidden="true">
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage: "radial-gradient(130% 110% at 20% 100%, #000 30%, transparent 78%)",
          WebkitMaskImage: "radial-gradient(130% 110% at 20% 100%, #000 30%, transparent 78%)",
        }}
      />
      <svg
        viewBox="0 0 640 400"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0 h-full w-full p-6"
        fill="none"
      >
        {slug === "tenant-feedback-portal" && <TenantBlueprint />}
        {slug === "cyber-awareness" && <ShieldBlueprint />}
        {slug === "world-scope" && <GlobeBlueprint />}
        {slug === "chess-practice" && <ChessBlueprint />}
      </svg>
    </div>
  );
}

function TenantBlueprint() {
  return (
    <g stroke="currentColor" strokeWidth="1">
      {[0, 1, 2].map((layer) => {
        const inset = layer * 26;
        return (
          <g key={layer} opacity={0.26 + layer * 0.16}>
            <rect
              x={72 + inset}
              y={64 + inset}
              width={496 - inset * 2}
              height={272 - inset * 2}
              rx="6"
            />
            <line x1={72 + inset} y1={96 + inset} x2={568 - inset} y2={96 + inset} />
            <circle cx={90 + inset} cy={80 + inset} r="3" fill="currentColor" stroke="none" />
            <text
              x={104 + inset}
              y={84 + inset}
              fontSize="9"
              letterSpacing="2"
              fill="currentColor"
              stroke="none"
            >
              TENANT {String.fromCharCode(65 + layer)}
            </text>
          </g>
        );
      })}
      <g className="text-lake" stroke="currentColor" opacity="0.9">
        <rect x={228} y={176} width={184} height={52} rx="3" />
        <text x={320} y={198} textAnchor="middle" fontSize="9" letterSpacing="2" fill="currentColor" stroke="none">
          ISOLATED SCOPE
        </text>
        <text x={320} y={212} textAnchor="middle" fontSize="8" fill="currentColor" stroke="none" opacity="0.7">
          org_id enforced on every query
        </text>
      </g>
      <path d="M320 148v28M320 228v32" strokeDasharray="3 4" opacity="0.5" className="text-lake" stroke="currentColor" />
    </g>
  );
}

function ShieldBlueprint() {
  return (
    <g stroke="currentColor" strokeWidth="1">
      <path d="M320 62l112 40v92c0 74-50 120-112 144-62-24-112-70-112-144V102z" opacity="0.55" />
      <path d="M320 90l86 31v72c0 56-38 93-86 112-48-19-86-56-86-112v-72z" opacity="0.3" strokeDasharray="4 5" />
      <g className="text-lake" stroke="currentColor" opacity="0.85">
        <circle cx="320" cy="182" r="26" />
        <path d="M320 162v-12M320 214v-6M286 182h-12M354 182h-12" />
      </g>
      {[
        [110, 116],
        [536, 126],
        [128, 322],
        [520, 330],
      ].map(([x, y], index) => (
        <g key={index} opacity="0.55">
          <rect x={x - 34} y={y - 14} width="68" height="28" rx="3" />
          <text x={x} y={y + 3} textAnchor="middle" fontSize="7" letterSpacing="1.5" fill="currentColor" stroke="none">
            MODULE 0{index + 1}
          </text>
        </g>
      ))}
      <path d="M196 182h64M380 182h62M320 250v48" strokeDasharray="3 4" opacity="0.4" />
    </g>
  );
}

function GlobeBlueprint() {
  return (
    <g stroke="currentColor" strokeWidth="1" opacity="0.6">
      <circle cx="320" cy="200" r="132" />
      {[0.28, 0.56, 0.82].map((scale) => (
        <ellipse key={scale} cx="320" cy="200" rx={132 * scale} ry="132" />
      ))}
      <line x1="188" y1="200" x2="452" y2="200" />
      <line x1="320" y1="68" x2="320" y2="332" />
      <path d="M196 140h248M196 260h248" opacity="0.5" />
      <g className="text-lake" stroke="currentColor" opacity="0.9">
        <circle cx="404" cy="156" r="4" fill="currentColor" />
        <circle cx="366" cy="236" r="4" fill="currentColor" />
        <path d="M404 156l-38 80" strokeDasharray="3 3" />
      </g>
      <g opacity="0.4">
        <path d="M470 76h84M470 90h58M470 104h70" />
        <text x="470" y="126" fontSize="8" letterSpacing="2" fill="currentColor" stroke="none">
          PROVENANCE
        </text>
      </g>
    </g>
  );
}

function ChessBlueprint() {
  return (
    <g stroke="currentColor" strokeWidth="1">
      <g opacity="0.5">
        {Array.from({ length: 9 }, (_, index) => (
          <g key={index}>
            <line x1={140 + index * 30} y1="80" x2={140 + index * 30} y2="320" />
            <line x1="140" y1={80 + index * 30} x2="380" y2={80 + index * 30} />
          </g>
        ))}
      </g>
      <g opacity="0.14" fill="currentColor" stroke="none">
        {Array.from({ length: 8 }, (_, row) =>
          Array.from({ length: 8 }, (_, col) =>
            (row + col) % 2 === 0 ? (
              <rect key={`${row}-${col}`} x={140 + col * 30} y={80 + row * 30} width="30" height="30" />
            ) : null,
          ),
        )}
      </g>
      <g className="text-lake" stroke="currentColor" opacity="0.9">
        <circle cx="275" cy="230" r="10" />
        <path d="M275 220V204l-18-16M275 208l20-14" />
        <rect x="255" y="238" width="40" height="6" rx="3" />
      </g>
      <g opacity="0.45" className="text-sun" stroke="currentColor">
        <path d="M418 130h92M418 146h64M418 262h92M418 278h50" />
        <text x="418" y="114" fontSize="8" letterSpacing="2" fill="currentColor" stroke="none">
          PRACTICE MODE
        </text>
      </g>
    </g>
  );
}
