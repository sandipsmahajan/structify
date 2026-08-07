"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DiamondCard } from "@/components/ui/diamond-card";
import { ControlsPanel } from "./engine/controls";
import type { ArrayStep } from "./engine/types";

type DataType = "numbers" | "strings" | "objects" | "booleans";
type CellValue = number | string | { label: string; sub: string } | boolean;

const DATA_TYPES: { key: DataType; label: string; example: string }[] = [
  { key: "numbers", label: "Numbers", example: "[15, 42, 8, 23]" },
  { key: "strings", label: "Strings", example: '["apple", "banana", "cherry"]' },
  { key: "objects", label: "Records", example: "[{Alice,95}, {Bob,72}]" },
  { key: "booleans", label: "Flags", example: "[true, false, true]" },
];

const PSEUDOCODE = [
  "// Array Traversal",
  "for i = 0 to n-1:",
  "  process(arr[i])",
  "",
  "// Insert at position k",
  "for i = n down to k+1:",
  "  arr[i] = arr[i-1]",
  "arr[k] = value",
  "n = n + 1",
];

const BIG_O_TABLE = [
  ["Access", "O(1)"],
  ["Search", "O(n)"],
  ["Insert (end)", "O(1)*"],
  ["Insert (mid)", "O(n)"],
  ["Delete (end)", "O(1)*"],
  ["Delete (mid)", "O(n)"],
];

type Preset = { label: string; values: CellValue[] };

const PRESETS: Record<DataType, Preset[]> = {
  numbers: [
    { label: "Phone contacts sorted", values: [12, 47, 23, 89, 5, 61, 38] },
    { label: "Exam scores ranked", values: [95, 88, 76, 63, 52, 41, 30] },
    { label: "Stock prices (week)", values: [142, 138, 145, 150, 147, 153, 149] },
  ],
  strings: [
    { label: "To-do list items", values: ["Buy milk", "Call dentist", "Finish report", "Walk dog", "Pay bills"] },
    { label: "Browser tabs open", values: ["Gmail", "GitHub", "YouTube", "Docs", "Slack", "Twitter"] },
    { label: "Fruits A-Z", values: ["apple", "banana", "cherry", "date", "elderberry"] },
  ],
  objects: [
    { label: "Leaderboard (score)", values: [{ label: "Alice", sub: "95" }, { label: "Bob", sub: "72" }, { label: "Carol", sub: "88" }, { label: "Dan", sub: "64" }] },
    { label: "Contact list", values: [{ label: "Mom", sub: "555-0100" }, { label: "Boss", sub: "555-0200" }, { label: "Dr.", sub: "555-0300" }] },
    { label: "Shopping cart", values: [{ label: "Milk", sub: "$3.50" }, { label: "Bread", sub: "$2.00" }, { label: "Eggs", sub: "$4.25" }] },
  ],
  booleans: [
    { label: "Seat availability", values: [true, true, false, true, false, true, false, false] },
    { label: "Attendance sheet", values: [true, true, true, false, true, false, true] },
    { label: "Feature flags", values: [true, false, false, true, true, false] },
  ],
};

function formatValue(val: CellValue, dtype: DataType): { main: string; sub: string } {
  if (dtype === "numbers") return { main: String(val), sub: "" };
  if (dtype === "strings") return { main: `"${val}"`, sub: "" };
  if (dtype === "booleans") return { main: val ? "true" : "false", sub: "" };
  if (dtype === "objects" && typeof val === "object") return { main: val.label, sub: val.sub };
  return { main: String(val), sub: "" };
}

function parseInput(input: string, dtype: DataType): CellValue[] {
  if (dtype === "numbers") {
    return input.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
  }
  if (dtype === "strings") {
    return input.split(",").map((s) => s.trim().replace(/^"|"$/g, "")).filter(Boolean);
  }
  if (dtype === "booleans") {
    return input.split(",").map((s) => s.trim().toLowerCase() === "true" || s.trim() === "1").filter((_, i, arr) => arr.length > 0);
  }
  // objects: name:detail, name:detail
  if (dtype === "objects") {
    return input.split(",").map((s) => {
      const [label, sub] = s.split(":").map((p) => p.trim());
      return { label: label || "?", sub: sub || "-" };
    }).filter((o) => o.label !== "?");
  }
  return [];
}

function stringifyValues(vals: CellValue[], dtype: DataType): string {
  if (dtype === "numbers") return vals.map(String).join(",");
  if (dtype === "strings") return vals.map((v) => `"${v}"`).join(",");
  if (dtype === "booleans") return vals.map((v) => v ? "true" : "false").join(",");
  if (dtype === "objects") return (vals as { label: string; sub: string }[]).map((o) => `${o.label}:${o.sub}`).join(",");
  return "";
}

function buildSteps(vals: CellValue[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  steps.push({ type: "reset", index: -1, description: "Starting array", codeLine: -1 });
  for (let i = 0; i < vals.length; i++) {
    steps.push({ type: "visit", index: i, value: typeof vals[i] === "number" ? vals[i] as number : undefined, description: `Access arr[${i}]`, codeLine: 1 });
  }
  steps.push({ type: "reset", index: -1, description: "Traversal complete", codeLine: -1 });
  return steps;
}

function FacetedCell({ display, index, state, isNew, dtype }: {
  display: { main: string; sub: string }; index: number; state: "idle" | "active" | "visited" | "inserting" | "deleting" | "comparing"; isNew?: boolean; dtype: DataType;
}) {
  const colors: Record<string, string> = {
    idle: "border-bd-border bg-bd-surface/80",
    active: "border-bd-cyan bg-bd-cyan-dim shadow-[0_0_16px_rgba(111,227,255,0.3)]",
    visited: "border-bd-violet/40 bg-bd-violet-dim/50",
    inserting: "border-bd-emerald bg-bd-emerald/10 shadow-[0_0_16px_rgba(45,212,191,0.3)]",
    deleting: "border-bd-ruby bg-bd-ruby/10 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    comparing: "border-bd-gold bg-bd-gold-dim/30 shadow-[0_0_12px_rgba(232,196,106,0.3)]",
  };

  const textMap: Record<string, string> = {
    idle: "text-bd-text-primary", active: "text-bd-cyan font-bold", visited: "text-bd-violet",
    inserting: "text-bd-emerald font-bold", deleting: "text-bd-ruby", comparing: "text-bd-gold font-bold",
  };

  const boolColor = display.main === "true" ? "text-bd-emerald" : "text-bd-ruby";
  const mainClass = dtype === "booleans" ? boolColor : textMap[state];
  const tall = dtype === "objects";
  const isString = dtype === "strings";

  return (
    <motion.div
      layout
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative clip-diamond min-w-[52px] flex flex-col items-center justify-center px-2
        border ${colors[state]} transition-all duration-300
        ${tall ? "h-[60px]" : "h-[52px]"}
        ${isString ? "min-w-[80px]" : ""}
      `}
    >
      <span className={`text-xs font-mono ${mainClass} max-w-[100px] truncate`}>{display.main}</span>
      {display.sub && <span className="text-[9px] text-bd-text-muted mt-0.5 max-w-[100px] truncate">{display.sub}</span>}
      <span className="text-[9px] text-bd-text-muted mt-0.5">{index}</span>
    </motion.div>
  );
}

interface Props {
  theoryContent: string;
  realWorldUseCase: string;
}

export function ArrayVisualizer2D({ realWorldUseCase }: Props) {
  const [dataType, setDataType] = useState<DataType>("numbers");
  const [values, setValues] = useState<CellValue[]>(PRESETS.numbers[0].values);
  const [customInput, setCustomInput] = useState(stringifyValues(PRESETS.numbers[0].values, "numbers"));
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showLearnMore, setShowLearnMore] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const steps = useMemo(() => buildSteps(values), [values]);
  const totalSteps = steps.length;
  const currentStep = steps[step] ?? null;

  const cellStates = useMemo(() => {
    const states: Record<number, "idle" | "active" | "visited" | "inserting" | "deleting" | "comparing"> = {};
    if (currentStep) {
      if (currentStep.type === "visit") {
        for (let i = 0; i < currentStep.index; i++) states[i] = "visited";
        if (currentStep.index >= 0) states[currentStep.index] = "active";
      } else if (currentStep.type === "highlight") {
        states[currentStep.index] = "active";
      } else if (currentStep.type === "insert") {
        if (currentStep.index >= 0) states[currentStep.index] = "inserting";
      } else if (currentStep.type === "delete") {
        if (currentStep.index >= 0) states[currentStep.index] = "deleting";
      } else if (currentStep.type === "compare") {
        if (currentStep.index >= 0) states[currentStep.index] = "comparing";
      }
    }
    return states;
  }, [currentStep]);

  const stepTo = useCallback((s: number) => {
    const clamped = Math.max(0, Math.min(s, totalSteps));
    setStep(clamped);
    if (clamped >= totalSteps) setIsPlaying(false);
  }, [totalSteps]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setStep((prev) => {
          const next = prev + 1;
          if (next >= totalSteps) { setIsPlaying(false); return prev; }
          return next;
        });
      }, Math.max(100, 800 / speed));
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, totalSteps]);

  const applyCustomInput = () => {
    const parsed = parseInput(customInput, dataType);
    if (parsed.length > 0) {
      setValues(parsed);
      setIsPlaying(false);
    }
  };

  const switchDataType = (dt: DataType) => {
    setDataType(dt);
    const defaults = PRESETS[dt][0].values;
    setValues(defaults);
    setCustomInput(stringifyValues(defaults, dt));
    setIsPlaying(false);
  };

  const loadPreset = (vals: CellValue[]) => {
    setValues(vals);
    setCustomInput(stringifyValues(vals, dataType));
    setIsPlaying(false);
  };

  useEffect(() => { setStep(0); }, [values]);

  const description = "An array is a row of labeled slots in memory, like numbered lockers. You can instantly jump to any slot by its number (index), but inserting or deleting in the middle requires shifting everything over — like removing a chapter from a book and renumbering every page after it.";

  return (
    <div className="space-y-8">
      {/* TOP: Plain-English Definition */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-bd-cyan-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">What is an Array?</span>
        </div>
        <p className="text-sm text-bd-text-secondary leading-relaxed">{description}</p>

        {/* Expandable Learn More */}
        <button
          onClick={() => setShowLearnMore(!showLearnMore)}
          className="mt-3 text-xs text-bd-cyan hover:text-bd-cyan/80 flex items-center gap-1 mx-auto transition-colors"
        >
          {showLearnMore ? "Hide details ▲" : "Learn more ▼"}
        </button>
        <motion.div
          initial={false}
          animate={{ height: showLearnMore ? "auto" : 0, opacity: showLearnMore ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
          className="overflow-hidden"
        >
          <div className="mt-4 pt-4 border-t border-bd-border/30 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-bd-text-secondary leading-relaxed">
              <div>
                <h4 className="text-bd-cyan font-semibold mb-1">How It Works</h4>
                <p>
                  An array stores elements in a single, contiguous block of memory. Each element has a numbered <em>index</em> starting from 0.
                  Because every element is the same size (e.g., all integers take 4 bytes), the computer can jump to any element instantly:
                  <span className="font-mono text-bd-gold"> address = base + (index × element_size)</span>. This is why array access is O(1).
                </p>
              </div>
              <div>
                <h4 className="text-bd-cyan font-semibold mb-1">Static vs Dynamic</h4>
                <p>
                  <strong>Static arrays</strong> (C, Java) have a fixed size set at creation — you can't add more elements.{" "}
                  <strong>Dynamic arrays</strong> (Python lists, JavaScript arrays, Java ArrayList) grow automatically by allocating a larger block and copying elements over.
                  This resizing is O(n) but happens rarely, making appends O(1) amortized.
                </p>
              </div>
              <div>
                <h4 className="text-bd-cyan font-semibold mb-1">Inserting & Deleting</h4>
                <p>
                  Adding or removing at the <strong>end</strong> is fast (O(1) amortized). But inserting at the <strong>front</strong> requires shifting every subsequent element one slot over — an O(n) operation.
                  This is why most data structures avoid frequent front-inserts: an array of 100,000 items doing a front-delete must shift 99,999 elements.
                </p>
              </div>
              <div>
                <h4 className="text-bd-cyan font-semibold mb-1">Common Pitfalls</h4>
                <ul className="space-y-1">
                  <li><span className="text-bd-ruby">Off-by-one:</span> Looping to <code className="code-block px-1 text-[11px]">i &lt;= arr.length</code> instead of <code className="code-block px-1 text-[11px]">&lt;</code> causes out-of-bounds errors.</li>
                  <li><span className="text-bd-ruby">Out-of-bounds:</span> Accessing <code className="code-block px-1 text-[11px]">arr[-1]</code> or <code className="code-block px-1 text-[11px]">arr[n]</code> crashes programs.</li>
                  <li><span className="text-bd-ruby">Shrink cost:</span> Repeated front-inserts on large arrays are expensive — use a deque or linked list instead.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Data Type Selector */}
      <div className="flex items-center justify-center gap-2">
        {DATA_TYPES.map((dt) => (
          <button
            key={dt.key}
            onClick={() => switchDataType(dt.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded clip-diamond-sm transition-all duration-200 ${
              dataType === dt.key
                ? "bg-bd-cyan-dim text-bd-cyan border border-bd-cyan/40"
                : "bg-bd-raised text-bd-text-muted border border-bd-border hover:border-bd-cyan/30"
            }`}
          >
            {dt.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CENTER: 2D Visualization */}
        <div className="lg:col-span-2">
          <DiamondCard className="p-6">
            <div className="flex items-end justify-center gap-3 min-h-[100px] py-8 overflow-x-auto">
              <AnimatePresence mode="popLayout">
                {values.map((v, i) => (
                  <FacetedCell
                    key={`${i}-${dataType}-${typeof v === "object" ? JSON.stringify(v) : String(v)}`}
                    display={formatValue(v, dataType)}
                    index={i}
                    state={cellStates[i] ?? "idle"}
                    dtype={dataType}
                  />
                ))}
              </AnimatePresence>
            </div>

            <div className="mt-6">
              <ControlsPanel
                isPlaying={isPlaying}
                currentStep={step}
                totalSteps={totalSteps}
                speed={speed}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onStepForward={() => stepTo(step + 1)}
                onStepBack={() => stepTo(step - 1)}
                onReset={() => stepTo(0)}
                onSpeedChange={setSpeed}
                customInput={customInput}
                onInputChange={setCustomInput}
                onApply={applyCustomInput}
                onPreset={loadPreset}
                presets={PRESETS[dataType]}
                inputPlaceholder={DATA_TYPES.find((d) => d.key === dataType)?.example}
              />
            </div>
          </DiamondCard>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-4">
          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-cyan">Pseudocode</h3>
            <div className="code-block p-3 text-xs font-mono">
              {PSEUDOCODE.map((line, i) => (
                <div
                  key={i}
                  className={`py-0.5 px-1 -mx-1 rounded transition-colors duration-200 ${
                    currentStep?.codeLine === i ? "bg-bd-gold/15 text-bd-gold" :
                    line.startsWith("//") ? "text-bd-text-muted italic" : "text-bd-text-secondary"
                  }`}
                >
                  {line || "\u00A0"}
                </div>
              ))}
            </div>
          </DiamondCard>

          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-violet">Complexity</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-bd-border/30">
                  <th className="text-left py-1 text-bd-text-muted font-medium">Operation</th>
                  <th className="text-right py-1 text-bd-text-muted font-medium">Time</th>
                </tr>
              </thead>
              <tbody>
                {BIG_O_TABLE.map(([op, time]) => (
                  <tr key={op} className="border-b border-bd-border/10">
                    <td className="py-1.5 text-bd-text-secondary">{op}</td>
                    <td className={`py-1.5 text-right font-mono ${time.startsWith("O(1)") ? "text-bd-emerald" : "text-bd-gold"}`}>{time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-[10px] text-bd-text-muted mt-2">*Amortized with dynamic resizing</p>
          </DiamondCard>

          <DiamondCard className="p-5 border-bd-gold/20 bg-bd-gold-dim/10">
            <h3 className="heading-section text-sm mb-2 text-bd-gold">Real-World Example</h3>
            <p className="text-xs text-bd-text-secondary leading-relaxed">
              When you delete a text message from a group chat, every message below it shifts up one slot — that's array shifting at work. A 4K TV screen is a 3840x2160 array of pixels, and when you apply an Instagram filter, it runs matrix math across every pixel in the array millions of times per second.
            </p>
          </DiamondCard>

          {currentStep && (
            <DiamondCard className="p-4">
              <div className="text-[10px] text-bd-text-muted mb-1">Animation Step</div>
              <div className="text-xs text-bd-text-secondary">{currentStep.description}</div>
            </DiamondCard>
          )}
        </div>
      </div>
    </div>
  );
}
