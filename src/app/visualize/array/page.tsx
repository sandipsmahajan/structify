import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { GoDeeper } from "@/components/visualizers/go-deeper";
import { ArrayVisualizer2D } from "@/components/visualizers/array-visualizer";
import Link from "next/link";

const PAID_TEASERS = [
  { title: "Sorting Race", description: "Compare Bubble, Selection, and Insertion sort side-by-side with swap counters", href: "/visualize/sorting", accent: "violet" as const },
  { title: "DP Table", description: "Step through dynamic programming matrix fills with animated cell updates", href: "/visualize/dp", accent: "gold" as const },
  { title: "Graph BFS/DFS", description: "Animated node traversal on force-directed graphs", href: "/visualize/graph", accent: "emerald" as const },
];

export default async function ArrayVisualizerPage() {
  let topic: { theoryContent?: string | null; realWorldUseCase?: string | null } | null = null;
  try {
    topic = await prisma.topic.findFirst({ where: { slug: "arrays-strings" } });
  } catch { /* DB not available — use fallback */ }

  return (
    <div className="pt-20 pb-16 px-4 max-w-7xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-2 text-center">
        Array Visualizer
        <span className="ml-3 inline-block align-middle clip-diamond-sm px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-bd-cyan-dim text-bd-cyan">Free</span>
      </h1>

      <ArrayVisualizer2D
        theoryContent={topic?.theoryContent ?? ""}
        realWorldUseCase={topic?.realWorldUseCase ?? ""}
      />

      {/* Go Deeper */}
      <section className="mt-16">
        <div className="text-center mb-8">
          <h2 className="heading-display text-2xl mb-2">Go Deeper</h2>
          <p className="text-sm text-bd-text-muted max-w-lg mx-auto">
            See how arrays power dynamic programming and graph algorithms — unlock with Lifetime.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PAID_TEASERS.map((teaser) => (
            <DiamondCard key={teaser.href} className="p-5 relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 backdrop-blur-sm bg-bd-bg/60 z-10 flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-gold">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div className={`inline-flex items-center gap-1 px-2 py-0.5 clip-diamond-sm text-[10px] font-bold uppercase mb-3 ${
                teaser.accent === "violet" ? "bg-bd-violet-dim text-bd-violet" :
                teaser.accent === "gold" ? "bg-bd-gold-dim text-bd-gold" : "bg-bd-cyan-dim text-bd-emerald"
              }`}>
                Premium
              </div>
              <h3 className="heading-section text-sm mb-1">{teaser.title}</h3>
              <p className="text-xs text-bd-text-muted">{teaser.description}</p>
            </DiamondCard>
          ))}
        </div>
        <div className="text-center mt-6">
          <Link href="/pricing">
            <DiamondButton variant="gold" size="sm">Unlock All Visualizers</DiamondButton>
          </Link>
        </div>
      </section>
    </div>
  );
}
