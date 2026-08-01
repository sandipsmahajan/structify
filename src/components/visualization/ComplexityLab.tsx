"use client";

import { useMemo, useState } from "react";
import { Binary, Braces, Gauge, Layers, MemoryStick, Network, Sigma } from "lucide-react";
import { Card, SectionTitle } from "@/components/ui";

const curves = [
  { label: "O(1)", color: "#27c59a", value: (n: number) => 1 },
  { label: "O(log n)", color: "#315df6", value: (n: number) => Math.log2(n) },
  { label: "O(n)", color: "#f4b740", value: (n: number) => n },
  { label: "O(n log n)", color: "#ef6f6c", value: (n: number) => n * Math.log2(n) },
  { label: "O(n^2)", color: "#8b5cf6", value: (n: number) => n * n },
  { label: "O(n^3)", color: "#0ea5e9", value: (n: number) => n * n * n },
  { label: "O(2^n)", color: "#e11d48", value: (n: number) => Math.pow(2, Math.min(n, 18)) },
  { label: "O(n!)", color: "#111827", value: (n: number) => factorial(Math.min(n, 10)) }
];

const derivations = [
  { title: "Single loop", icon: Gauge, steps: ["Initialize i = 0", "Increment i once per item", "Stop after n iterations", "Final complexity: O(n)"] },
  { title: "Nested loops", icon: Layers, steps: ["Outer loop runs n times", "Inner loop runs n times for each outer step", "Total operations: n * n", "Final complexity: O(n^2)"] },
  { title: "Binary search", icon: Binary, steps: ["Start with 100 candidates", "Keep 50", "Keep 25", "Keep 12", "Keep 6", "Keep 3", "Keep 1", "Final complexity: O(log n)"] },
  { title: "Merge sort", icon: Network, steps: ["Split into halves", "Build log n levels", "Merge n items per level", "Final complexity: O(n log n)"] },
  { title: "Recursive Fibonacci", icon: Braces, steps: ["Each call branches into two calls", "Repeated subproblems appear", "Call tree doubles by depth", "Final complexity: O(2^n)"] },
  { title: "Memoization", icon: Sigma, steps: ["Cache each state once", "Repeated calls read cache", "Edges collapse into table lookups", "Complexity improves to O(n)"] },
  { title: "Space complexity", icon: MemoryStick, steps: ["Stack frames grow with recursion depth", "Heap stores arrays and objects", "Auxiliary arrays add temporary memory", "Memory releases when frames return"] }
];

function factorial(n: number): number {
  return Array.from({ length: n }, (_, index) => index + 1).reduce((total, value) => total * value, 1);
}

function pointsFor(fn: (n: number) => number, maxInput: number, maxValue: number) {
  return Array.from({ length: maxInput }, (_, index) => {
    const n = index + 1;
    const x = 24 + (n / maxInput) * 552;
    const y = 276 - (Math.min(fn(n), maxValue) / maxValue) * 236;
    return `${x},${y}`;
  }).join(" ");
}

export function ComplexityLab() {
  const [inputSize, setInputSize] = useState(24);
  const [activeExample, setActiveExample] = useState(0);
  const maxValue = useMemo(() => Math.max(...curves.map((curve) => Math.min(curve.value(inputSize), 8000))), [inputSize]);
  const example = derivations[activeExample];
  const ExampleIcon = example.icon;
  const memoryFrames = activeExample === 6 ? ["main", "call n", "call n-1", "array", "object", "aux"] : ["counter", "input", "result"];

  return <div className="space-y-10">
    <section className="space-y-5"><SectionTitle eyebrow="big o lab" title="Animated growth comparison" text="Move the input size slider and watch time growth curves change in real time." /><Card><div className="flex flex-wrap items-center justify-between gap-4"><label className="flex min-w-72 flex-1 items-center gap-3 text-sm font-bold">Input size n<input className="w-full accent-brand" type="range" min={2} max={80} value={inputSize} onChange={(event) => setInputSize(Number(event.target.value))} /></label><span className="rounded-lg bg-ink px-4 py-2 font-display text-2xl font-extrabold text-white dark:bg-white dark:text-ink">n = {inputSize}</span></div><svg className="mt-6 h-[320px] w-full overflow-visible rounded-lg bg-white dark:bg-white/5" viewBox="0 0 600 320" role="img" aria-label="Complexity growth chart"><line x1="24" y1="276" x2="580" y2="276" stroke="#94a3b8" /><line x1="24" y1="40" x2="24" y2="276" stroke="#94a3b8" />{curves.map((curve) => <polyline key={curve.label} fill="none" stroke={curve.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={pointsFor(curve.value, inputSize, maxValue || 1)} />)}</svg><div className="mt-4 grid gap-2 md:grid-cols-4">{curves.map((curve) => <div key={curve.label} className="rounded-lg border border-slate-200 p-3 text-sm font-bold dark:border-white/10"><span className="mr-2 inline-block size-3 rounded-full" style={{ background: curve.color }} />{curve.label}<span className="ml-2 text-slate-500">{Math.round(Math.min(curve.value(inputSize), 999999)).toLocaleString()}</span></div>)}</div></Card></section>
    <section className="space-y-5"><SectionTitle eyebrow="derivation" title="How complexity is calculated" text="Each example shows what is counted: iterations, comparisons, calls, visited nodes, stack frames, and auxiliary memory." /><div className="grid gap-4 lg:grid-cols-[320px_1fr]"><Card><div className="grid gap-2">{derivations.map((item, index) => { const ItemIcon = item.icon; return <button key={item.title} className={`focus-ring flex items-center gap-3 rounded-lg p-3 text-left font-bold ${activeExample === index ? "bg-brand text-white" : "bg-slate-100 dark:bg-white/10"}`} onClick={() => setActiveExample(index)}><ItemIcon size={18} />{item.title}</button>; })}</div></Card><Card><div className="flex items-center gap-3"><ExampleIcon className="text-brand" size={26} /><h2 className="font-display text-2xl font-extrabold">{example.title}</h2></div><div className="mt-5 grid gap-3 md:grid-cols-2">{example.steps.map((step, index) => <div key={step} className="rounded-lg bg-slate-100 p-4 dark:bg-white/10"><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-brand">Step {index + 1}</p><p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{step}</p></div>)}</div></Card></div></section>
    <section className="grid gap-5 lg:grid-cols-2"><Card><h2 className="font-display text-2xl font-extrabold">Time complexity visualizer</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Operations increase as iterations, comparisons, calls, relaxations, or visits are counted.</p><div className="mt-5 grid grid-cols-10 gap-2">{Array.from({ length: 40 }).map((_, index) => <span key={index} className={`h-8 rounded-md ${index < Math.min(40, inputSize / 2) ? "bg-brand" : "bg-slate-200 dark:bg-white/10"}`} />)}</div><p className="mt-4 font-bold">Operation counter: {Math.round(inputSize * Math.max(1, activeExample + 1))}</p></Card><Card><h2 className="font-display text-2xl font-extrabold">Space complexity visualizer</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Stack memory, heap memory, variables, arrays, objects, pointers, and auxiliary space appear and release during execution.</p><div className="mt-5 grid gap-3 md:grid-cols-2">{memoryFrames.map((frame, index) => <div key={frame} className="rounded-lg border border-slate-200 p-4 dark:border-white/10"><p className="text-sm font-bold">{frame}</p><div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-white/10"><div className="h-2 rounded-full bg-mint" style={{ width: `${Math.min(100, 28 + index * 12)}%` }} /></div></div>)}</div></Card></section>
  </div>;
}
