"use client";

import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";
import type { VisualizationEvent } from "@/lib/types";

export function TimelineController({ events, index, setIndex, playing, setPlaying }: { events: VisualizationEvent[]; index: number; setIndex: (index: number) => void; playing: boolean; setPlaying: (value: boolean) => void }) {
  const max = events.length - 1;
  return <div className="surface rounded-lg p-4">
    <div className="flex flex-wrap items-center gap-2">
      <button aria-label="Replay animation" className="focus-ring rounded-lg border border-slate-300 p-2 dark:border-white/15" onClick={() => setIndex(0)}><RotateCcw size={18} /></button>
      <button aria-label="Previous step" className="focus-ring rounded-lg border border-slate-300 p-2 dark:border-white/15" onClick={() => setIndex(Math.max(0, index - 1))}><SkipBack size={18} /></button>
      <button aria-label={playing ? "Pause animation" : "Play animation"} className="focus-ring rounded-lg bg-ink p-2 text-white dark:bg-white dark:text-ink" onClick={() => setPlaying(!playing)}>{playing ? <Pause size={18} /> : <Play size={18} />}</button>
      <button aria-label="Next step" className="focus-ring rounded-lg border border-slate-300 p-2 dark:border-white/15" onClick={() => setIndex(Math.min(max, index + 1))}><SkipForward size={18} /></button>
      <label className="ml-2 flex min-w-0 flex-1 items-center gap-3 text-sm text-slate-600 dark:text-slate-300">Timeline<input aria-label="Animation timeline" className="w-full accent-brand" type="range" min={0} max={max} value={index} onChange={(event) => setIndex(Number(event.target.value))} /></label>
    </div>
    <div className="mt-3 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.16em] text-slate-500"><span>{events[index].label}</span><span>{index + 1}/{events.length}</span></div>
  </div>;
}
