"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";
import { GoDeeper } from "@/components/visualizers/go-deeper";

const BstVisualizer = dynamic(() => import("@/components/visualizers/bst-visualizer").then((mod) => mod.BstVisualizer), {
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
  { title: "Graph BFS/DFS", description: "Force-directed node graphs with traversal animation and edge connectors", href: "/visualize/graph", accent: "emerald" as const },
  { title: "Sorting Race", description: "3-algorithm synchronized comparison with real-time swap counters", href: "/visualize/sorting", accent: "gold" as const },
  { title: "Linked List", description: "3D chain of nodes with animated insert and delete operations", href: "/visualize/linked-list", accent: "cyan" as const },
];

export default function BstVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Binary Search Tree</h1>
      <p className="body-text mb-8">3D balanced BST with animated insert, delete, and traversal operations.</p>
      <BstVisualizer />
      <GoDeeper teasers={TEASERS} />
    </div>
  );
}
