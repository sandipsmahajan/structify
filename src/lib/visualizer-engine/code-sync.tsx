import type { AnimationStep } from "./types";

interface CodeSyncProps {
  pseudocode: string[];
  currentLine: number;
  step: AnimationStep | null;
}

export function CodeSyncPanel({ pseudocode, currentLine, step }: CodeSyncProps) {
  return (
    <div className="glass border-l border-bd-border/40 p-4 overflow-y-auto min-w-[220px] max-w-[280px]">
      <h4 className="text-xs font-semibold text-bd-text-muted uppercase tracking-wider mb-3">
        Pseudocode
      </h4>
      <div className="space-y-0.5 font-mono text-xs">
        {pseudocode.map((line, i) => (
          <div
            key={i}
            className={`px-2 py-1 rounded transition-colors duration-150 ${
              i === currentLine
                ? "bg-bd-cyan-dim text-bd-cyan border-l-2 border-bd-cyan"
                : "text-bd-text-muted"
            }`}
          >
            <span className="text-bd-text-muted mr-2 select-none">{i + 1}</span>
            {line}
          </div>
        ))}
      </div>

      {step && (
        <div className="mt-4 p-3 bg-bd-raised border border-bd-border/40 rounded">
          <p className="text-xs text-bd-text-secondary">{step.description}</p>
        </div>
      )}
    </div>
  );
}
