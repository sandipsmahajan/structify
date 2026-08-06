import { BstVisualizer } from "@/components/visualizers/bst-visualizer";

export default function BstVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Binary Search Tree Visualizer</h1>
      <p className="body-text mb-8">3D tree with insert, delete, and traversal animations.</p>
      <BstVisualizer />
    </div>
  );
}
