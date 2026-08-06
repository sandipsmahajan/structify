"use client";

import dynamic from "next/dynamic";

const DpVisualizer = dynamic(() => import("@/components/visualizers/dp-visualizer"), { ssr: false });

export default function DpPage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto min-h-screen">
      <DpVisualizer />
    </div>
  );
}
