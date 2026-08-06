import { ArrayVisualizer } from "@/components/visualizers/array-visualizer";

export default function ArrayVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Array Visualizer</h1>
      <p className="body-text mb-8">3D interactive array with insert, delete, and traversal operations.</p>
      <ArrayVisualizer />
    </div>
  );
}
