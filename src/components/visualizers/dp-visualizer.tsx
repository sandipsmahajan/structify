"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";

interface DPStep {
  row: number;
  col: number;
  value: number;
  fills: Array<{ r: number; c: number }>;
}

type DPProblem = "fibonacci" | "knapsack" | "lcs" | "editDistance";

const PROBLEMS: Record<DPProblem, { name: string; description: string; recurrence: string; baseCase: string }> = {
  fibonacci: {
    name: "Fibonacci",
    description: "Compute the nth Fibonacci number using bottom-up DP. fib(n) = fib(n-1) + fib(n-2).",
    recurrence: "dp[i] = dp[i-1] + dp[i-2]",
    baseCase: "dp[0] = 0, dp[1] = 1",
  },
  knapsack: {
    name: "0/1 Knapsack",
    description: "Items with weight [2,3,4,5] and value [3,4,5,6], capacity 8. Maximize total value.",
    recurrence: "dp[i][w] = max(dp[i-1][w], dp[i-1][w-wt[i]] + val[i])",
    baseCase: "dp[0][w] = 0, dp[i][0] = 0",
  },
  lcs: {
    name: "Longest Common Subsequence",
    description: "Find LCS length for strings 'abcde' and 'ace'. Classic bottom-up DP.",
    recurrence: "dp[i][j] = dp[i-1][j-1]+1 if match, else max(dp[i-1][j], dp[i][j-1])",
    baseCase: "dp[0][j] = 0, dp[i][0] = 0",
  },
  editDistance: {
    name: "Edit Distance",
    description: "Convert 'horse' to 'ros' using insert/delete/replace. Minimum operations.",
    recurrence: "dp[i][j] = dp[i-1][j-1] if match, else 1+min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1])",
    baseCase: "dp[i][0] = i, dp[0][j] = j",
  },
};

function generateSteps(problem: DPProblem): { steps: DPStep[]; rows: number; cols: number; rowLabels: string[]; colLabels: string[] } {
  switch (problem) {
    case "fibonacci": {
      const n = 10;
      const steps: DPStep[] = [];
      const dp: number[] = [0, 1];
      steps.push({ row: 0, col: 0, value: 0, fills: [{ r: 0, c: 0 }] });
      steps.push({ row: 0, col: 1, value: 1, fills: [{ r: 0, c: 1 }] });
      for (let i = 2; i <= n; i++) {
        dp[i] = dp[i - 1] + dp[i - 2];
        steps.push({ row: 0, col: i, value: dp[i], fills: [{ r: 0, c: i }] });
      }
      return { steps, rows: 1, cols: n + 1, rowLabels: ["fib(n)"], colLabels: Array.from({ length: n + 1 }, (_, i) => `${i}`) };
    }
    case "knapsack": {
      const weights = [2, 3, 4, 5];
      const values = [3, 4, 5, 6];
      const capacity = 8;
      const items = weights.length;
      const dp: number[][] = Array.from({ length: items + 1 }, () => new Array(capacity + 1).fill(0));
      const steps: DPStep[] = [];
      const computed: boolean[][] = Array.from({ length: items + 1 }, () => new Array(capacity + 1).fill(false));

      for (let w = 0; w <= capacity; w++) {
        computed[0][w] = true;
        steps.push({ row: 0, col: w, value: 0, fills: [{ r: 0, c: w }] });
      }
      for (let i = 1; i <= items; i++) {
        for (let w = 0; w <= capacity; w++) {
          const wt = weights[i - 1];
          const val = values[i - 1];
          if (wt <= w) {
            dp[i][w] = Math.max(dp[i - 1][w], dp[i - 1][w - wt] + val);
          } else {
            dp[i][w] = dp[i - 1][w];
          }
          computed[i][w] = true;
          const fills: Array<{ r: number; c: number }> = [];
          if (computed[i - 1][w]) fills.push({ r: i - 1, c: w });
          if (wt <= w && computed[i - 1][w - wt]) fills.push({ r: i - 1, c: w - wt });
          fills.push({ r: i, c: w });
          steps.push({ row: i, col: w, value: dp[i][w], fills });
        }
      }
      return {
        steps, rows: items + 1, cols: capacity + 1,
        rowLabels: ["0", ...weights.map((w, i) => `Item ${i + 1} (W${w})`)],
        colLabels: Array.from({ length: capacity + 1 }, (_, i) => `${i}`),
      };
    }
    case "lcs": {
      const s1 = "abcde";
      const s2 = "ace";
      const m = s1.length;
      const n = s2.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      const steps: DPStep[] = [];
      const computed: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));

      for (let r = 0; r <= m; r++) {
        computed[r][0] = true;
        steps.push({ row: r, col: 0, value: 0, fills: [{ r, c: 0 }] });
      }
      for (let c = 0; c <= n; c++) {
        computed[0][c] = true;
        steps.push({ row: 0, col: c, value: 0, fills: [{ r: 0, c }] });
      }
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const fills: Array<{ r: number; c: number }> = [];
          if (computed[i - 1][j - 1]) fills.push({ r: i - 1, c: j - 1 });
          if (computed[i - 1][j]) fills.push({ r: i - 1, c: j });
          if (computed[i][j - 1]) fills.push({ r: i, c: j - 1 });
          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1] + 1;
          } else {
            dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
          }
          computed[i][j] = true;
          fills.push({ r: i, c: j });
          steps.push({ row: i, col: j, value: dp[i][j], fills });
        }
      }
      return {
        steps, rows: m + 1, cols: n + 1,
        rowLabels: ["", ...s1.split("")],
        colLabels: ["", ...s2.split("")],
      };
    }
    case "editDistance": {
      const s1 = "horse";
      const s2 = "ros";
      const m = s1.length;
      const n = s2.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
      const steps: DPStep[] = [];
      const computed: boolean[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(false));

      for (let i = 0; i <= m; i++) {
        dp[i][0] = i;
        computed[i][0] = true;
        steps.push({ row: i, col: 0, value: i, fills: [{ r: i, c: 0 }] });
      }
      for (let j = 0; j <= n; j++) {
        dp[0][j] = j;
        computed[0][j] = true;
        steps.push({ row: 0, col: j, value: j, fills: [{ r: 0, c: j }] });
      }
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const fills: Array<{ r: number; c: number }> = [];
          if (computed[i - 1][j - 1]) fills.push({ r: i - 1, c: j - 1 });
          if (computed[i - 1][j]) fills.push({ r: i - 1, c: j });
          if (computed[i][j - 1]) fills.push({ r: i, c: j - 1 });
          if (s1[i - 1] === s2[j - 1]) {
            dp[i][j] = dp[i - 1][j - 1];
          } else {
            dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
          }
          computed[i][j] = true;
          fills.push({ r: i, c: j });
          steps.push({ row: i, col: j, value: dp[i][j], fills });
        }
      }
      return {
        steps, rows: m + 1, cols: n + 1,
        rowLabels: ["", ...s1.split("")],
        colLabels: ["", ...s2.split("")],
      };
    }
  }
}

export default function DpVisualizer() {
  const [problem, setProblem] = useState<DPProblem>("fibonacci");
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(3);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { steps, rows, cols, rowLabels, colLabels } = useMemo(() => generateSteps(problem), [problem]);

  const currentStep = steps[Math.min(step, steps.length - 1)];

  const totalSteps = steps.length;
  const progress = totalSteps > 0 ? (step / totalSteps) * 100 : 0;

  const activeFills = useMemo(() => {
    const set = new Set<string>();
    if (currentStep) {
      for (const f of currentStep.fills) {
        set.add(`${f.r},${f.c}`);
      }
    }
    return set;
  }, [currentStep]);

  useEffect(() => {
    if (playing) {
      intervalRef.current = setInterval(() => {
        setStep((s) => {
          if (s >= steps.length - 1) {
            setPlaying(false);
            return s;
          }
          return s + 1;
        });
      }, Math.max(50, 500 / speed));
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [playing, speed, steps.length]);

  const reset = useCallback(() => {
    setPlaying(false);
    setStep(0);
  }, []);

  const isComplete = step >= steps.length - 1;

  const info = PROBLEMS[problem];

  const getCellClass = useCallback((r: number, c: number) => {
    const key = `${r},${c}`;
    const isActive = r === currentStep?.row && c === currentStep?.col;
    const isInFill = activeFills.has(key);

    if (isActive) return "cell-active bg-bd-gold text-bd-bg font-bold scale-110 z-10";
    if (isInFill) return "bg-bd-cyan/20 text-bd-cyan";
    if (steps[step] && step > 0) {
      const filled = steps.slice(0, step + 1).some((s) =>
        s.fills.some((f) => f.r === r && f.c === c)
      );
      if (filled) return "bg-bd-violet/10 text-bd-text-secondary";
    }
    return "bg-bd-raised text-bd-text-muted";
  }, [currentStep, activeFills, step, steps]);

  const cellSize = rows > 5 ? "w-12 h-12" : "w-16 h-16";
  const labelCellSize = "w-14 h-10";

  const currentValue = currentStep ? `${currentStep.row},${currentStep.col}: ${currentStep.value}` : "";

  // Memoize which cells are newly filled on this step for count-up
  const newFillsThisStep = useMemo(() => {
    if (!currentStep) return new Set<string>();
    return new Set(currentStep.fills.map((f) => `${f.r},${f.c}`));
  }, [currentStep]);

  return (
    <div className="space-y-6">
      <DiamondCard className="p-6">
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <h2 className="heading-display text-xl">DP Table Visualizer</h2>
          <select
            value={problem}
            onChange={(e) => { setProblem(e.target.value as DPProblem); reset(); }}
            className="bg-bd-bg border border-bd-border rounded px-3 py-2 text-sm text-bd-text-primary ml-auto"
          >
            {Object.entries(PROBLEMS).map(([key, p]) => (
              <option key={key} value={key}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <p className="text-sm text-bd-text-secondary mb-3">{info.description}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="code-block px-3 py-2">
                <span className="text-bd-gold">Recurrence:</span>{" "}
                <span className="text-bd-text-secondary font-mono">{info.recurrence}</span>
              </div>
              <div className="code-block px-3 py-2">
                <span className="text-bd-emerald">Base:</span>{" "}
                <span className="text-bd-text-secondary font-mono">{info.baseCase}</span>
              </div>
            </div>
          </div>
          <DiamondCard className="p-3">
            <div className="text-[10px] text-bd-text-muted mb-1">Current Cell</div>
            <div className="font-mono text-sm text-bd-gold mb-2 animate-pulse">{currentValue || "\u2014"}</div>
            <div className="text-[10px] text-bd-text-muted">
              Step {step + 1} / {totalSteps}
            </div>
          </DiamondCard>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-bd-raised rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-bd-cyan via-bd-violet to-bd-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* DP Table */}
        <div className="overflow-auto mb-6">
          <div className="inline-block">
            {/* Column labels */}
            <div className="flex">
              <div className={`${labelCellSize} shrink-0`} />
              {Array.from({ length: cols }, (_, c) => (
                <div key={c} className={`${cellSize} flex items-center justify-center text-[10px] font-mono text-bd-text-muted border-b border-bd-border/20`}>
                  {colLabels[c] || ""}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="flex">
                <div className={`${labelCellSize} flex items-center justify-center text-[10px] font-mono text-bd-text-muted shrink-0 border-r border-bd-border/20`}>
                  {rowLabels[r] || ""}
                </div>
                {Array.from({ length: cols }, (_, c) => (
                  <div
                    key={c}
                    className={`${cellSize} flex items-center justify-center text-xs font-mono border border-bd-border/10 transition-all duration-300 ${getCellClass(r, c)}`}
                    style={newFillsThisStep.has(`${r},${c}`) ? { animation: "cell-pop 0.4s var(--ease-crystal) both" } : undefined}
                    title={`dp[${r}][${c}]`}
                  >
                    {steps.slice(0, step + 1).some((s) => s.row === r && s.col === c)
                      ? steps.findLast((s) => s.row === r && s.col === c)?.value ?? ""
                      : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <p className="text-sm text-bd-text-secondary mb-3">{info.description}</p>
            <div className="flex flex-wrap gap-4 text-xs">
              <div className="code-block px-3 py-2">
                <span className="text-bd-gold">Recurrence:</span>{" "}
                <span className="text-bd-text-secondary font-mono">{info.recurrence}</span>
              </div>
              <div className="code-block px-3 py-2">
                <span className="text-bd-emerald">Base:</span>{" "}
                <span className="text-bd-text-secondary font-mono">{info.baseCase}</span>
              </div>
            </div>
          </div>
          <DiamondCard className="p-3">
            <div className="text-[10px] text-bd-text-muted mb-1">Current Cell</div>
            <div className="font-mono text-sm text-bd-gold mb-2">{currentValue || "—"}</div>
            <div className="text-[10px] text-bd-text-muted">
              Step {step + 1} / {totalSteps}
            </div>
          </DiamondCard>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-bd-raised rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-bd-cyan via-bd-violet to-bd-gold transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* DP Table */}
        <div className="overflow-auto mb-6">
          <div className="inline-block">
            {/* Column labels */}
            <div className="flex">
              <div className={`${labelCellSize} shrink-0`} />
              {Array.from({ length: cols }, (_, c) => (
                <div key={c} className={`${cellSize} flex items-center justify-center text-[10px] font-mono text-bd-text-muted border-b border-bd-border/20`}>
                  {colLabels[c] || ""}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {Array.from({ length: rows }, (_, r) => (
              <div key={r} className="flex">
                <div className={`${labelCellSize} flex items-center justify-center text-[10px] font-mono text-bd-text-muted shrink-0 border-r border-bd-border/20`}>
                  {rowLabels[r] || ""}
                </div>
                {Array.from({ length: cols }, (_, c) => (
                  <div
                    key={c}
                    className={`${cellSize} flex items-center justify-center text-xs font-mono border border-bd-border/10 transition-all duration-300 ${getCellClass(r, c)}`}
                    style={newFillsThisStep.has(`${r},${c}`) ? { animation: "cell-pop 0.4s var(--ease-crystal) both" } : undefined}
                    title={`dp[${r}][${c}]`}
                  >
                    {steps.slice(0, step + 1).some((s) => s.row === r && s.col === c)
                      ? steps.findLast((s) => s.row === r && s.col === c)?.value ?? ""
                      : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <DiamondButton variant={playing ? "ghost" : "primary"} size="sm" onClick={() => {
            if (isComplete) { reset(); setPlaying(true); }
            else setPlaying(!playing);
          }}>
            {playing ? "Pause" : isComplete ? "Replay" : "Play"}
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={() => {
            setPlaying(false);
            setStep((s) => Math.max(0, s - 1));
          }} disabled={step === 0}>
            Prev
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(steps.length - 1, s + 1));
          }} disabled={isComplete}>
            Next
          </DiamondButton>

          <DiamondButton variant="ghost" size="sm" onClick={reset}>
            Reset
          </DiamondButton>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[10px] text-bd-text-muted">Speed</span>
            <input
              type="range"
              min="1"
              max="10"
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="w-20 accent-bd-cyan"
            />
          </div>
        </div>
      </DiamondCard>

      {/* Legend */}
      <DiamondCard className="p-4">
        <h3 className="heading-section text-sm mb-3 text-bd-violet">Color Legend</h3>
        <div className="flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bd-gold rounded" />
            <span className="text-bd-text-secondary">Current cell being filled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bd-cyan/20 border border-bd-cyan/40 rounded" />
            <span className="text-bd-text-secondary">Dependencies (values used to compute)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bd-violet/10 rounded" />
            <span className="text-bd-text-secondary">Previously computed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-bd-raised rounded" />
            <span className="text-bd-text-secondary">Not yet computed</span>
          </div>
        </div>
      </DiamondCard>
    </div>
  );
}
