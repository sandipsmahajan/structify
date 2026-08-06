"use client";

import dynamic from "next/dynamic";

const BstVisualizer = dynamic(() => import("@/components/visualizers/bst-visualizer").then((mod) => mod.BstVisualizer), { ssr: false });

export default function BstVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Binary Search Tree</h1>
      <p className="body-text mb-8">3D balanced BST with animated insert, delete, and traversal operations.</p>
      <BstVisualizer />
    </div>
  );
}
