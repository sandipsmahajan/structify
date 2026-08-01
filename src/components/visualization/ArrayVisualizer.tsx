"use client";

import { motion } from "framer-motion";
import type { VisualizationEvent } from "@/lib/types";

export function ArrayVisualizer({ event }: { event: VisualizationEvent }) {
  return <div className="surface rounded-lg p-5">
    <div className="flex min-h-52 items-end justify-center gap-3 rounded-lg border border-slate-200 bg-white/50 p-4 dark:border-white/10 dark:bg-white/5">
      {event.values.map((value, index) => {
        const active = event.activeIndexes.includes(index);
        return <motion.div key={`${value}-${index}`} layout className="flex w-14 flex-col items-center gap-2" transition={{ type: "spring", stiffness: 320, damping: 28 }}>
          <motion.div animate={{ height: 42 + value * 3, backgroundColor: active ? "#315df6" : "#27c59a" }} className="w-full rounded-md" />
          <span className={active ? "font-extrabold text-brand" : "font-semibold text-slate-600 dark:text-slate-300"}>{value}</span>
          <span className="text-xs text-slate-400">{index}</span>
        </motion.div>;
      })}
    </div>
    <p className="mt-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{event.explanation}</p>
  </div>;
}
