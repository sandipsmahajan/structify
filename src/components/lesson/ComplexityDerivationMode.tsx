"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Cpu, HardDrive, ListTree, RotateCcw } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { Badge, Card, SectionTitle } from "@/components/ui";

function inferRule(line: string, operationCount: number, memoryUnits: number) {
  const normalized = line.toLowerCase();
  if (normalized.includes("for") || normalized.includes("while")) {
    return {
      timeReason: "Loop line: the operation count grows with how many times this line repeats.",
      spaceReason: "Loop counters usually add constant memory unless the body allocates data.",
      derivedTime: operationCount > 10 ? "growth trends toward O(n) or higher" : "counting iterations",
      derivedSpace: memoryUnits > 1 ? "auxiliary memory is active" : "constant extra memory so far"
    };
  }
  if (normalized.includes("return")) {
    return {
      timeReason: "Return line: one final operation completes the current path.",
      spaceReason: "Returning releases any stack frame owned by this call path.",
      derivedTime: "terminal constant step",
      derivedSpace: "memory begins to release"
    };
  }
  if (normalized.includes("emit") || normalized.includes("update")) {
    return {
      timeReason: "State update: count one meaningful algorithm operation.",
      spaceReason: "Visualization and algorithm state are tracked separately from asymptotic auxiliary space.",
      derivedTime: "one counted operation",
      derivedSpace: "state memory accounted"
    };
  }
  return {
    timeReason: "Sequential line: add one constant-time step to the running total.",
    spaceReason: "No new growing allocation is visible on this line.",
    derivedTime: "constant step inside the current structure",
    derivedSpace: "no asymptotic growth on this line"
  };
}

export function ComplexityDerivationMode({ lesson, activeCodeLine }: { lesson: Lesson; activeCodeLine: number }) {
  const lines = useMemo(() => lesson.code.JavaScript.split("\n"), [lesson.code.JavaScript]);
  const [lineIndex, setLineIndex] = useState(Math.max(0, Math.min(lines.length - 1, activeCodeLine - 1)));
  const event = lesson.visualization[Math.min(lesson.visualization.length - 1, lineIndex % lesson.visualization.length)];
  const operationCount = event.operationCount ?? lineIndex + 1;
  const memoryUnits = event.memoryUnits ?? 1;
  const rule = inferRule(lines[lineIndex] ?? "", operationCount, memoryUnits);
  const complexityFacts = lesson.sections["Complexity Analysis"];

  return <section className="space-y-4">
    <SectionTitle eyebrow="derive" title="Complexity Derivation Mode" text="Step through code line by line. Structify counts operations and memory changes first, then derives the time and space complexity from what happened." />
    <div className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><Badge>Line {lineIndex + 1} of {lines.length}</Badge><h2 className="mt-3 font-display text-2xl font-extrabold">Line-by-line dry run</h2></div>
          <div className="flex gap-2">
            <button className="focus-ring rounded-lg border border-slate-300 p-2 dark:border-white/15" aria-label="Reset derivation" onClick={() => setLineIndex(0)}><RotateCcw size={18} /></button>
            <button className="focus-ring rounded-lg border border-slate-300 p-2 dark:border-white/15" aria-label="Previous line" onClick={() => setLineIndex(Math.max(0, lineIndex - 1))}><ChevronLeft size={18} /></button>
            <button className="focus-ring rounded-lg bg-ink p-2 text-white dark:bg-white dark:text-ink" aria-label="Next line" onClick={() => setLineIndex(Math.min(lines.length - 1, lineIndex + 1))}><ChevronRight size={18} /></button>
          </div>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-lg bg-ink p-4 text-sm leading-7 text-white dark:bg-black"><code>{lines.map((line, index) => <span key={`${line}-${index}`} className={`block rounded px-2 ${index === lineIndex ? "bg-brand text-white" : "text-slate-300"}`}>{String(index + 1).padStart(2, "0")}  {line}</span>)}</code></pre>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10"><p className="text-sm font-bold">Why this line counts</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{rule.timeReason}</p></div>
          <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10"><p className="text-sm font-bold">Memory effect</p><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{rule.spaceReason}</p></div>
        </div>
      </Card>
      <div className="space-y-4">
        <Card><Cpu className="text-brand" /><h2 className="mt-3 font-display text-2xl font-extrabold">Operation count</h2><p className="mt-2 text-4xl font-extrabold text-brand">{operationCount}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Current derivation: {rule.derivedTime}</p><div className="mt-4 h-3 rounded-full bg-slate-200 dark:bg-white/10"><div className="h-3 rounded-full bg-brand" style={{ width: `${Math.min(100, operationCount * 8)}%` }} /></div></Card>
        <Card><HardDrive className="text-mint" /><h2 className="mt-3 font-display text-2xl font-extrabold">Memory usage</h2><p className="mt-2 text-4xl font-extrabold text-mint">{memoryUnits}</p><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Current derivation: {rule.derivedSpace}</p><div className="mt-4 grid grid-cols-8 gap-2">{Array.from({ length: 8 }).map((_, index) => <span key={index} className={`h-8 rounded-md ${index < memoryUnits ? "bg-mint" : "bg-slate-200 dark:bg-white/10"}`} />)}</div></Card>
        <Card><ListTree className="text-amber" /><h2 className="mt-3 font-display text-2xl font-extrabold">Derived result</h2><div className="mt-3 space-y-2">{complexityFacts.map((fact) => <p key={fact} className="rounded-lg bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">{fact}</p>)}</div><p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">The formula is shown only after the visual evidence: repeated lines explain time growth, and active allocations explain space growth.</p></Card>
      </div>
    </div>
  </section>;
}
