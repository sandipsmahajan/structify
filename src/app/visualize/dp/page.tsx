"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";
import { GoDeeper } from "@/components/visualizers/go-deeper";

const DpVisualizer = dynamic(() => import("@/components/visualizers/dp-visualizer"), {
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
  { title: "Sorting Race", description: "3-algorithm synchronized comparison with real-time swap counters", href: "/visualize/sorting", accent: "violet" as const },
  { title: "Array", description: "Interactive array with glowing cubes and Big-O complexity breakdown", href: "/visualize/array", accent: "cyan" as const },
];

export default function DpPage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto min-h-screen">
      <DpVisualizer />
      <GoDeeper teasers={TEASERS} />
    </div>
  );
}
