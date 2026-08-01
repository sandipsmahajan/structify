"use client";

import { Bot, Lightbulb, MessagesSquare } from "lucide-react";
import type { VisualizationEvent } from "@/lib/types";

export function AITutor({ event }: { event: VisualizationEvent }) {
  return <aside className="surface rounded-lg p-5">
    <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-lg bg-brand text-white"><Bot size={20} /></span><div><h3 className="font-display text-xl font-extrabold">AI Tutor</h3><p className="text-sm text-slate-500 dark:text-slate-400">Hint-first explanations</p></div></div>
    <div className="mt-5 space-y-3">
      <div className="rounded-lg bg-slate-100 p-4 dark:bg-white/10"><div className="mb-2 flex items-center gap-2 text-sm font-bold"><MessagesSquare size={16} />Current step</div><p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{event.explanation}</p></div>
      <div className="rounded-lg bg-amber/15 p-4"><div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber"><Lightbulb size={16} />Guided hint</div><p className="text-sm leading-6 text-slate-700 dark:text-slate-200">Before asking for the answer, state which side of the range is still valid and why.</p></div>
    </div>
  </aside>;
}
