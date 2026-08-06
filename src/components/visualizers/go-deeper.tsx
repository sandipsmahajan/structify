import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import Link from "next/link";

interface Teaser {
  title: string;
  description: string;
  href: string;
  accent: "cyan" | "violet" | "gold" | "emerald";
}

export function GoDeeper({ teasers }: { teasers: Teaser[] }) {
  const accentColors = {
    cyan: "bg-bd-cyan-dim text-bd-cyan",
    violet: "bg-bd-violet-dim text-bd-violet",
    gold: "bg-bd-gold-dim text-bd-gold",
    emerald: "bg-bd-cyan-dim text-bd-emerald",
  };

  return (
    <section className="mt-16">
      <div className="text-center mb-8">
        <h2 className="heading-display text-2xl mb-2">Go Deeper</h2>
        <p className="text-sm text-bd-text-muted max-w-lg mx-auto">
          See how this data structure powers advanced algorithms — unlock with Lifetime.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {teasers.map((teaser) => (
          <DiamondCard key={teaser.href} className="p-5 relative overflow-hidden group cursor-pointer">
            <div className="absolute inset-0 backdrop-blur-sm bg-bd-bg/60 z-10 flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-gold">
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0110 0v4" />
              </svg>
            </div>
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 clip-diamond-sm text-[10px] font-bold uppercase mb-3 ${accentColors[teaser.accent]}`}>
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
  );
}
