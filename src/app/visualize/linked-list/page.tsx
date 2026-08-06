import { LinkedListVisualizer } from "@/components/visualizers/linked-list-visualizer";

export default function LinkedListVisualizerPage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Linked List Visualizer</h1>
      <p className="body-text mb-8">3D chain of nodes with append and remove operations.</p>
      <LinkedListVisualizer />
    </div>
  );
}
