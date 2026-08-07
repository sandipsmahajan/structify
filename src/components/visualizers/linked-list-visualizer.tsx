"use client";

import { DiamondCard } from "@/components/ui/diamond-card";

export function LinkedListVisualizer() {
  return (
    <DiamondCard className="p-8 text-center">
      <div className="clip-diamond-sm inline-flex items-center gap-2 px-3 py-1 mb-4 bg-bd-cyan-dim">
        <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">Coming Soon</span>
      </div>
      <p className="text-sm text-bd-text-secondary">The Linked List visualizer is being rebuilt in the new 2D engine. Check back soon.</p>
    </DiamondCard>
  );
}
