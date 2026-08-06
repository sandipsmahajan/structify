"use client";

import dynamic from "next/dynamic";
import { DiamondCard } from "@/components/ui/diamond-card";

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

export default function DpPage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto min-h-screen">
      <DpVisualizer />
    </div>
  );
}
