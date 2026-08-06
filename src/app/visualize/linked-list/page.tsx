"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";
import { GoDeeper } from "@/components/visualizers/go-deeper";

const LinkedListVisualizer = dynamic(() => import("@/components/visualizers/linked-list-visualizer").then((mod) => mod.LinkedListVisualizer), {
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
  { title: "Binary Search Tree", description: "Hierarchical structure with O(log n) operations and animated traversals", href: "/visualize/bst", accent: "violet" as const },
  { title: "Graph BFS/DFS", description: "Force-directed node graphs with traversal animation and edge connectors", href: "/visualize/graph", accent: "emerald" as const },
  { title: "Sorting Race", description: "3-algorithm synchronized comparison with real-time swap counters", href: "/visualize/sorting", accent: "gold" as const },
];

export default function LinkedListVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Linked List Visualizer</h1>
      <p className="body-text mb-8">3D chain of nodes with append and remove operations.</p>
      <LinkedListVisualizer />
      <GoDeeper teasers={TEASERS} />
    </div>
  );
}
