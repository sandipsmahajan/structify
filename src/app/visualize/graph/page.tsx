"use client";

import dynamic from "next/dynamic";

const GraphVisualizer = dynamic(() => import("@/components/visualizers/graph-visualizer").then((mod) => mod.GraphVisualizer), { ssr: false });

export default function GraphVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Graph BFS/DFS Visualizer</h1>
      <p className="body-text mb-8">Force-directed 3D graph with BFS traversal animation.</p>
      <GraphVisualizer />
    </div>
  );
}
