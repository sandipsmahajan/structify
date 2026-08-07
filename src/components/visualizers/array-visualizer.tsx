"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DiamondCard } from "@/components/ui/diamond-card";
import { ControlsPanel } from "./engine/controls";
import type { ArrayStep } from "./engine/types";

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

const PRESETS = [
  { label: "Phone contacts sorted by name", values: [12, 47, 23, 89, 5, 61, 38] },
  { label: "Exam scores ranked high to low", values: [95, 88, 76, 63, 52, 41, 30] },
  { label: "Stock prices over a week", values: [142, 138, 145, 150, 147, 153, 149] },
];

function buildSteps(values: number[]): ArrayStep[] {
  const steps: ArrayStep[] = [];
  steps.push({ type: "reset", index: -1, description: "Starting array", codeLine: -1 });
  for (let i = 0; i < values.length; i++) {
    steps.push({ type: "visit", index: i, value: values[i], description: `Access arr[${i}] = ${values[i]}`, codeLine: 1 });
  }
  steps.push({ type: "reset", index: -1, description: "Traversal complete", codeLine: -1 });
  return steps;
}

function FacetedCell({ value, index, state, isNew }: {
  value: number; index: number; state: "idle" | "active" | "visited" | "inserting" | "deleting" | "comparing"; isNew?: boolean;
}) {
  const colors = {
    idle: "border-bd-border bg-bd-surface/80",
    active: "border-bd-cyan bg-bd-cyan-dim shadow-[0_0_16px_rgba(111,227,255,0.3)] shadow-bd-cyan/30",
    visited: "border-bd-violet/40 bg-bd-violet-dim/50",
    inserting: "border-bd-emerald bg-bd-emerald/10 shadow-[0_0_16px_rgba(45,212,191,0.3)]",
    deleting: "border-bd-ruby bg-bd-ruby/10 shadow-[0_0_12px_rgba(244,63,94,0.3)]",
    comparing: "border-bd-gold bg-bd-gold-dim/30 shadow-[0_0_12px_rgba(232,196,106,0.3)]",
  };

  const textColor = state === "active" ? "text-bd-cyan" : state === "deleting" ? "text-bd-ruby" : state === "inserting" ? "text-bd-emerald" : state === "comparing" ? "text-bd-gold" : state === "visited" ? "text-bd-violet" : "text-bd-text-primary";

  return (
    <motion.div
      layout
      initial={isNew ? { scale: 0, opacity: 0 } : false}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`
        relative clip-diamond min-w-[52px] h-[52px] flex flex-col items-center justify-center
        border ${colors[state]}
        transition-all duration-300
      `}
    >
      <span className={`text-sm font-mono font-bold ${textColor}`}>{value}</span>
      <span className="text-[9px] text-bd-text-muted mt-0.5">{index}</span>
    </motion.div>
  );
}

interface Props {
  theoryContent: string;
  realWorldUseCase: string;
}

export function ArrayVisualizer2D({ realWorldUseCase }: Props) {
  const [values, setValues] = useState(PRESETS[0].values);
  const [customInput, setCustomInput] = useState(PRESETS[0].values.join(","));
  const [isPlaying, setIsPlaying] = useState(false);
  const [step, setStep] = useState(0);
  const [speed, setSpeed] = useState(1);
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
      } else if (currentStep.type === "reset") {
        // no highlights
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
          if (next >= totalSteps) {
            setIsPlaying(false);
            return prev;
          }
          return next;
        });
      }, Math.max(100, 800 / speed));
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isPlaying, speed, totalSteps]);

  const applyCustomInput = () => {
    const nums = customInput.split(",").map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    if (nums.length > 0) {
      setValues(nums);
      setCustomInput(nums.join(","));
      setIsPlaying(false);
    }
  };

  const loadPreset = (vals: number[]) => {
    setValues(vals);
    setCustomInput(vals.join(","));
    setIsPlaying(false);
  };

  useEffect(() => { setStep(0); }, [values]);

  const parsedDescription = useMemo(() => {
    return "An array is a row of labeled slots in memory, like numbered lockers. You can instantly jump to any slot by its number (index), but inserting or deleting in the middle requires shifting everything over — like removing a chapter from a book and renumbering every page after it.";
  }, []);

  return (
    <div className="space-y-8">
      {/* TOP: Plain-English Definition */}
      <div className="text-center max-w-2xl mx-auto">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-4 bg-bd-cyan-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">What is an Array?</span>
        </div>
        <p className="text-sm text-bd-text-secondary leading-relaxed">{parsedDescription}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CENTER: 2D Visualization */}
        <div className="lg:col-span-2">
          <DiamondCard className="p-6">
            <div className="flex items-end justify-center gap-3 min-h-[100px] py-8 overflow-x-auto">
              <AnimatePresence mode="popLayout">
                {values.map((v, i) => (
                  <FacetedCell
                    key={`${i}-${v}`}
                    value={v}
                    index={i}
                    state={cellStates[i] ?? "idle"}
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
                presets={PRESETS}
              />
            </div>
          </DiamondCard>
        </div>

        {/* SIDE PANEL */}
        <div className="space-y-4">
          {/* Pseudocode */}
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

          {/* Big-O Table */}
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

          {/* Real-World Example */}
          <DiamondCard className="p-5 border-bd-gold/20 bg-bd-gold-dim/10">
            <h3 className="heading-section text-sm mb-2 text-bd-gold">Real-World Example</h3>
            <p className="text-xs text-bd-text-secondary leading-relaxed">
              When you delete a text message from a group chat, every message below it shifts up one slot — that's array shifting at work. A 4K TV screen is a 3840x2160 array of pixels, and when you apply an Instagram filter, it runs matrix math across every pixel in the array millions of times per second.
            </p>
          </DiamondCard>

          {/* Current Step Info */}
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
