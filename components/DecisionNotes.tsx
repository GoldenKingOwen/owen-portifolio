/**
 * Case-study callouts for the architecture record.
 *
 * The problem text is the project's own `problemStatement`. Each decision is
 * copied verbatim from the project data. Trade-offs are not recorded in
 * /data yet, so the card says so instead of inventing a consequence.
 *
 * TODO(owen): add a verified trade-off for each decision in
 * data/projects.ts (what it cost, what it rules out, any known limit), then
 * replace the placeholder below with that text.
 */
export function ProblemCallout({ children }: { children: React.ReactNode }) {
  return (
    <div className="case-note case-note-problem">
      <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-sun">Problem</p>
      <p className="mt-2 max-w-[62ch] text-base leading-relaxed text-foreground">{children}</p>
    </div>
  );
}

export function DecisionNotes({ decisions }: { decisions: string[] }) {
  return (
    <div className="space-y-3">
      {decisions.map((decision, index) => (
        <div key={decision} className="case-note">
          <div>
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              Decision {String(index + 1).padStart(2, "0")}
            </p>
            <p className="mt-2 max-w-[58ch] text-base leading-relaxed text-foreground">
              {decision}
            </p>
          </div>
          <div className="case-note-tradeoff">
            <p className="font-mono text-[0.625rem] uppercase tracking-[0.16em] text-muted">
              Trade-off
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Not documented yet.
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
