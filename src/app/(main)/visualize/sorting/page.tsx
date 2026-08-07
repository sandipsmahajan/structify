"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";
import { GoDeeper } from "@/components/visualizers/go-deeper";

const SortingRaceVisualizer = dynamic(() => import("@/components/visualizers/sorting-race-visualizer").then((mod) => mod.SortingRaceVisualizer), {
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
  { title: "Graph Algorithms", description: "Dijkstra, Bellman-Ford, and A* pathfinding visualized on 3D graphs", href: "/visualize/graph", accent: "emerald" as const },
  { title: "DP Table", description: "Step through dynamic programming matrix fills with animated cell updates", href: "/visualize/dp", accent: "gold" as const },
  { title: "BST", description: "Interactive self-balancing binary search tree with rotations", href: "/visualize/bst", accent: "violet" as const },
];

export default function SortingRacePage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Sorting Race Visualizer</h1>
      <p className="body-text mb-8">Multi-algorithm synchronized comparison: Bubble, Selection, and Insertion Sort racing side-by-side.</p>
      <SortingRaceVisualizer />
      <GoDeeper teasers={TEASERS} />
    </div>
  );
}
