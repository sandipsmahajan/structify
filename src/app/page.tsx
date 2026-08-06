"use client";

import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { ParticleBackground } from "@/components/ui/particle-background";
import Link from "next/link";

const features = [
  {
    title: "Interactive 3D Visualizers",
    description:
      "Rotate, zoom, and step through live 3D simulations of every data structure. Insert, delete, traverse, and sort — all rendered in real time.",
    accent: "cyan",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-cyan">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    title: "Sync Theory with Code",
    description:
      "Watch pseudocode highlight in sync with animations. Every step of a traversal or sort is explained visually and in code, building genuine intuition.",
    accent: "violet",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-violet">
        <path d="M16 18l6-6-6-6" />
        <path d="M8 6l-6 6 6 6" />
      </svg>
    ),
  },
  {
    title: "Curated Problem Sets",
    description:
      "Every topic links directly to real LeetCode, HackerRank, and NeetCode problems. Learn the pattern, visualize the solution, then solve it yourself.",
    accent: "gold",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-gold">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    title: "Mock Interview Mode",
    description:
      "Timed sessions with progressively revealed hints simulate real interview pressure. Practice the 14 core patterns top companies ask.",
    accent: "emerald",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-bd-emerald">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
      </svg>
    ),
  },
];

const tiers = [
  {
    name: "Foundation",
    color: "text-bd-cyan",
    border: "border-bd-cyan/30",
    items: ["Big-O Complexity", "Recursion & Call Stacks", "Arrays & Strings", "Linked Lists", "Stacks & Queues", "Hashing"],
  },
  {
    name: "Architect",
    color: "text-bd-violet",
    border: "border-bd-violet/30",
    items: ["Trees & BST", "AVL & Red-Black", "Tries & Segment Trees", "Heaps & Priority Queues", "Graph BFS/DFS", "Union-Find"],
  },
  {
    name: "Alchemist",
    color: "text-bd-gold",
    border: "border-bd-gold/30",
    items: ["All Major Sorts", "Graph Algorithms", "Dynamic Programming", "Greedy & Backtracking", "String Algorithms", "Advanced Topics"],
  },
  {
    name: "Mastery",
    color: "text-bd-emerald",
    border: "border-bd-emerald/30",
    items: ["14 Core Patterns", "Mock Interviews", "Timed Sessions", "Achievement Badges", "Progress Tracking", "Deep Platform Links"],
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ParticleBackground />

      {/* ── Hero ── */}
      <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-24 pb-16 text-center">
        {/* Badge */}
        <div className="clip-diamond-sm glass-glow inline-flex items-center gap-2 px-4 py-1.5 mb-8">
          <span className="w-2 h-2 rounded-full bg-bd-cyan animate-pulse" />
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">
            Now in Public Beta
          </span>
        </div>

        <h1 className="heading-display text-5xl sm:text-6xl lg:text-7xl max-w-4xl leading-[1.1] mb-6">
          Data Structures & Algorithms,
          <br />
          <span className="bg-gradient-to-r from-bd-cyan via-bd-violet to-bd-gold bg-clip-text text-transparent">
            Visualized in 3D
          </span>
        </h1>

        <p className="body-text max-w-2xl text-lg sm:text-xl mb-10">
          Structify transforms abstract DSA concepts into interactive 3D simulations.
          Learn through animated theory, live visualizers, and curated problem sets —
          all wrapped in a premium Black Diamond experience.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/learn">
            <DiamondButton variant="primary" size="lg">
              Start Learning Free
            </DiamondButton>
          </Link>
          <Link href="/visualize">
            <DiamondButton variant="secondary" size="lg">
              Explore Visualizers
            </DiamondButton>
          </Link>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-8 sm:gap-12">
          {[
            { value: "50+", label: "DSA Topics" },
            { value: "100+", label: "3D Visualizers" },
            { value: "300+", label: "Practice Problems" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="heading-display text-2xl sm:text-3xl text-bd-text-primary">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm text-bd-text-muted mt-1 uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tier preview ── */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-display text-3xl sm:text-4xl mb-4">
            A Complete Curriculum
          </h2>
          <p className="body-text max-w-xl mx-auto">
            Four progressive tiers take you from complexity basics to interview mastery.
            Foundations and Linear Structures are completely free.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((tier) => (
            <DiamondCard key={tier.name} glow className="p-5">
              <h3 className={`heading-section text-lg mb-4 ${tier.color}`}>
                {tier.name}
              </h3>
              <ul className="space-y-2">
                {tier.items.map((item) => (
                  <li
                    key={item}
                    className="text-sm text-bd-text-secondary flex items-center gap-2"
                  >
                    <span className={`w-1 h-1 rounded-full ${tier.color} bg-current opacity-60`} />
                    {item}
                  </li>
                ))}
              </ul>
            </DiamondCard>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-display text-3xl sm:text-4xl mb-4">
            Learn. Visualize. Practice. Apply.
          </h2>
          <p className="body-text max-w-xl mx-auto">
            Four-stage learning loop that builds real understanding, not just memorization.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature) => (
            <DiamondCard key={feature.title} glow className="p-6 group transition-colors duration-200 hover:border-bd-border-active">
              <div className="flex items-start gap-4">
                <div className={`mt-0.5 shrink-0 w-10 h-10 clip-diamond-sm flex items-center justify-center ${
                  feature.accent === "cyan"   ? "bg-bd-cyan-dim" :
                  feature.accent === "violet" ? "bg-bd-violet-dim" :
                  feature.accent === "gold"   ? "bg-bd-gold-dim" :
                  "bg-bd-cyan-dim"
                }`}>
                  {feature.icon}
                </div>
                <div>
                  <h3 className="heading-section text-base mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-bd-text-secondary leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </DiamondCard>
          ))}
        </div>
      </section>

      {/* ── Visualizer Preview Placeholder ── */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <DiamondCard
          animatedGlow
          className="p-8 sm:p-12 text-center"
        >
          <div className="max-w-2xl mx-auto">
            <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-cyan-dim">
              <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">
                Coming Soon
              </span>
            </div>
            <h2 className="heading-display text-3xl sm:text-4xl mb-4">
              The Visualizer Engine
            </h2>
            <p className="body-text mb-8">
              Our config-driven 3D visualizer renders arrays as glowing data cubes,
              linked lists as crystal chains, trees as floating node networks, graphs as
              force-directed cosmic webs, and sorting as a synchronized multi-algorithm race.
              Play, pause, step through — every animation synced with highlighted pseudocode.
            </p>
            <div className="h-48 sm:h-64 clip-diamond border border-bd-border/40 flex items-center justify-center bg-bd-bg/60">
              <div className="text-bd-text-muted text-sm font-mono">
                3D Visualizer Preview — Step 3
              </div>
            </div>
          </div>
        </DiamondCard>
      </section>

      {/* ── Pricing Preview ── */}
      <section className="relative z-10 px-6 py-24 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="heading-display text-3xl sm:text-4xl mb-4">
            Lifetime Access, One Payment
          </h2>
          <p className="body-text max-w-xl mx-auto">
            No subscriptions. No recurring fees. Pay once and unlock everything forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Free tier */}
          <DiamondCard className="p-8">
            <h3 className="heading-section text-xl text-bd-text-primary mb-2">Free</h3>
            <p className="text-sm text-bd-text-secondary mb-6">
              Tiers 0-1 fully unlocked with visualizers and curated problems.
            </p>
            <div className="heading-display text-4xl mb-6">
              &#8377;0
            </div>
            <ul className="space-y-3 mb-8">
              {[
                "Foundations & Linear Structures",
                "All visualizers free",
                "2 problems per topic",
                "Basic progress tracking",
              ].map((item) => (
                <li key={item} className="text-sm text-bd-text-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bd-cyan shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/learn">
              <DiamondButton variant="secondary" className="w-full justify-center">
                Get Started
              </DiamondButton>
            </Link>
          </DiamondCard>

          {/* Paid tier */}
          <DiamondCard glow animatedGlow className="p-8 relative overflow-hidden">
            <div className="absolute top-3 right-3 clip-diamond-sm px-3 py-1 bg-bd-gold/20 text-bd-gold text-xs font-bold uppercase tracking-wider">
              Popular
            </div>
            <h3 className="heading-section text-xl text-bd-gold mb-2">Lifetime</h3>
            <p className="text-sm text-bd-text-secondary mb-6">
              Unlock all 4 tiers, mock interviews, badges, and every future visualizer.
            </p>
            <div className="heading-display text-4xl mb-2">
              &#8377;4,999
            </div>
            <p className="text-xs text-bd-text-muted mb-6">One-time payment. No subscription.</p>
            <ul className="space-y-3 mb-8">
              {[
                "Tiers 2-4: Non-Linear, Algorithms, Mastery",
                "All visualizers & problems",
                "Mock interview mode",
                "Achievement badges & certificates",
                "Early access to new visualizers",
              ].map((item) => (
                <li key={item} className="text-sm text-bd-text-secondary flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bd-gold shrink-0">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
            <Link href="/pricing">
              <DiamondButton variant="gold" className="w-full justify-center">
                Buy Lifetime Access
              </DiamondButton>
            </Link>
          </DiamondCard>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="relative z-10 border-t border-bd-border/40 px-6 py-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="heading-display text-lg">
            <span className="text-bd-cyan">Struct</span>
            <span className="text-bd-violet">ify</span>
          </div>
          <div className="flex gap-6 text-sm text-bd-text-muted">
            <Link href="/learn" className="hover:text-bd-text-secondary transition-colors">Learn</Link>
            <Link href="/visualize" className="hover:text-bd-text-secondary transition-colors">Visualize</Link>
            <Link href="/practice" className="hover:text-bd-text-secondary transition-colors">Practice</Link>
            <Link href="/pricing" className="hover:text-bd-text-secondary transition-colors">Pricing</Link>
          </div>
          <p className="text-xs text-bd-text-muted">
            &copy; {new Date().getFullYear()} Structify. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
