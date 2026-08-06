import { SortingRaceVisualizer } from "@/components/visualizers/sorting-race-visualizer";

export default function SortingRacePage() {
  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2">Sorting Race Visualizer</h1>
      <p className="body-text mb-8">Multi-algorithm synchronized comparison: Bubble, Selection, and Insertion Sort racing side-by-side.</p>
      <SortingRaceVisualizer />
    </div>
  );
}
