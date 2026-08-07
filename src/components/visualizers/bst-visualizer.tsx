"use client";

import { DiamondCard } from "@/components/ui/diamond-card";

export function BstVisualizer() {
  return (
    <DiamondCard className="p-8 text-center">
      <div className="clip-diamond-sm inline-flex items-center gap-2 px-3 py-1 mb-4 bg-bd-violet-dim">
        <span className="text-xs font-semibold uppercase tracking-widest text-bd-violet">Coming Soon</span>
      </div>
      <p className="text-sm text-bd-text-secondary">The Binary Search Tree visualizer is being rebuilt in the new 2D engine. Check back soon.</p>
    </DiamondCard>
  );
}
