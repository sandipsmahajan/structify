"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";

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

export default function SortingRacePage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Sorting Race Visualizer</h1>
      <p className="body-text mb-8">Multi-algorithm synchronized comparison: Bubble, Selection, and Insertion Sort racing side-by-side.</p>
      <SortingRaceVisualizer />
    </div>
  );
}
