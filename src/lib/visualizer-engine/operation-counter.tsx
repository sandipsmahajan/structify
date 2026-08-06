interface OperationCounterProps {
  comparisons: number;
  swaps: number;
}

export function OperationCounter({ comparisons, swaps }: OperationCounterProps) {
  return (
    <div className="flex items-center gap-4 p-3 text-xs text-bd-text-secondary glass border-t border-bd-border/40">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-bd-cyan" />
        <span>Comparisons:</span>
        <span className="text-bd-text-primary font-mono font-semibold">{comparisons}</span>
      </div>
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-bd-violet" />
        <span>Swaps:</span>
        <span className="text-bd-text-primary font-mono font-semibold">{swaps}</span>
      </div>
      <div className="ml-auto text-bd-text-muted font-mono">
        O(n) indicator — operations grow with input
      </div>
    </div>
  );
}
