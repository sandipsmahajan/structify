import { DiamondCard } from "@/components/ui/diamond-card";
import Link from "next/link";

const visualizers = [
  {
    title: "Array",
    description: "3D data cubes with insert, delete, and traversal operations.",
    href: "/visualize/array",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-cyan">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18M9 3v18" />
      </svg>
    ),
    accent: "cyan" as const,
  },
  {
    title: "Linked List",
    description: "3D node chain with append, remove, and traversal animations.",
    href: "/visualize/linked-list",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-violet">
        <circle cx="4" cy="6" r="2" /><circle cx="4" cy="12" r="2" /><circle cx="4" cy="18" r="2" />
        <path d="M6 6h14M6 12h14M6 18h14" />
      </svg>
    ),
    accent: "violet" as const,
  },
  {
    title: "Binary Search Tree",
    description: "3D tree with animated insert, delete, and balanced layout.",
    href: "/visualize/bst",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-emerald">
        <circle cx="12" cy="5" r="2" />
        <circle cx="7" cy="13" r="2" /><circle cx="17" cy="13" r="2" />
        <line x1="12" y1="7" x2="7" y2="11" /><line x1="12" y1="7" x2="17" y2="11" />
      </svg>
    ),
    accent: "emerald" as const,
  },
  {
    title: "Sorting Race",
    description: "Multi-algorithm side-by-side comparison: Bubble, Selection, Insertion Sort.",
    href: "/visualize/sorting",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-gold">
        <path d="M4 20h4V4H4v16zM10 20h4v-8h-4v8zM16 20h4V8h-4v12z" />
      </svg>
    ),
    accent: "gold" as const,
  },
  {
    title: "Graph BFS/DFS",
    description: "Force-directed 3D graph with animated BFS traversal.",
    href: "/visualize/graph",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-cyan">
        <circle cx="12" cy="5" r="3" /><circle cx="5" cy="17" r="3" /><circle cx="19" cy="17" r="3" />
        <path d="M9.5 7.5l-2 7M14.5 7.5l2 7M9 15h6" />
      </svg>
    ),
    accent: "cyan" as const,
  },
  {
    title: "DP Table",
    description: "Animated 2D DP table fill-in: Fibonacci, Knapsack, LCS, Edit Distance.",
    href: "/visualize/dp",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-gold">
        <rect x="2" y="2" width="8" height="8" /><rect x="14" y="2" width="8" height="8" />
        <rect x="2" y="14" width="8" height="8" /><rect x="14" y="14" width="8" height="8" />
        <path d="M10 6h4" /><path d="M6 10v4" />
      </svg>
    ),
    accent: "gold" as const,
  },
];

export default function VisualizePage() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <h1 className="heading-display text-4xl mb-4">3D Visualizers</h1>
        <p className="body-text max-w-xl mx-auto">
          Interactive 3D simulations for every major data structure.
          Play, pause, step through, and modify the data in real time.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {visualizers.map((v) => {
          const accentDim = v.accent === "cyan" ? "bg-bd-cyan-dim" : v.accent === "violet" ? "bg-bd-violet-dim" : v.accent === "gold" ? "bg-bd-gold-dim" : "bg-bd-cyan-dim";
          return (
            <Link key={v.href} href={v.href}>
              <DiamondCard glow className="p-6 h-full group cursor-pointer transition-colors duration-200 hover:border-bd-border-active">
                <div className={`w-12 h-12 clip-diamond-sm flex items-center justify-center mb-4 ${accentDim}`}>
                  {v.icon}
                </div>
                <h3 className="heading-section text-base mb-1.5">{v.title}</h3>
                <p className="text-sm text-bd-text-secondary leading-relaxed">{v.description}</p>
              </DiamondCard>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
