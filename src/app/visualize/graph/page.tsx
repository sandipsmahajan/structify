"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";
import { GoDeeper } from "@/components/visualizers/go-deeper";

const GraphVisualizer = dynamic(() => import("@/components/visualizers/graph-visualizer").then((mod) => mod.GraphVisualizer), {
  ssr: false,
  loading: () => (
    <DiamondCard className="p-6">
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-bd-raised rounded w-48" />
        <div className="h-[400px] bg-bd-raised rounded" />
        <div className="h-10 bg-bd-raised rounded w-full" />
      </div>
    </DiamondCard>
  ),
});

const TEASERS = [
  { title: "DP Table", description: "Step through dynamic programming matrix fills with animated cell updates", href: "/visualize/dp", accent: "gold" as const },
  { title: "Sorting Race", description: "3-algorithm synchronized comparison with real-time swap counters", href: "/visualize/sorting", accent: "violet" as const },
  { title: "BST", description: "Hierarchical structure with O(log n) operations and animated traversals", href: "/visualize/bst", accent: "cyan" as const },
];

export default function GraphVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Graph BFS/DFS Visualizer</h1>
      <p className="body-text mb-8">Force-directed 3D graph with BFS traversal animation.</p>
      <GraphVisualizer />
      <GoDeeper teasers={TEASERS} />
    </div>
  );
}
