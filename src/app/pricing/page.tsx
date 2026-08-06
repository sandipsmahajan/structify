"use client";

import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { CheckoutButton } from "@/components/payment/checkout-button";
import Link from "next/link";

const comparisonFeatures = [
  {
    feature: "Tier 0 — Foundations (Big-O, Recursion, Bit Manipulation, Memory Model)",
    free: true,
    lifetime: true,
  },
  {
    feature: "Tier 1 — Linear Structures (Arrays, Linked Lists, Stacks, Queues, Hashing)",
    free: true,
    lifetime: true,
  },
  {
    feature: "Interactive 3D Visualizers for all free topics",
    free: true,
    lifetime: true,
  },
  {
    feature: "Curated problem sets with platform deep-links",
    free: "2 per topic",
    lifetime: "Full access (300+)",
  },
  {
    feature: "Basic progress tracking",
    free: true,
    lifetime: true,
  },
  {
    feature: "Tier 2 — Non-Linear Structures (Trees, BST, AVL, Red-Black, Tries, Segment Trees, Heaps, Graphs)",
    free: false,
    lifetime: true,
  },
  {
    feature: "Tier 3 — Algorithms & Patterns (Sorting, Graph Alg, DP, Greedy, Backtracking, Strings, Advanced)",
    free: false,
    lifetime: true,
  },
  {
    feature: "Tier 4 — Interview Systemization (14 Core Patterns, Mock Interviews)",
    free: false,
    lifetime: true,
  },
  {
    feature: "Sorting Race Mode — animated multi-algorithm comparison",
    free: false,
    lifetime: true,
  },
  {
    feature: "3D Force-Directed Graph Visualizer",
    free: false,
    lifetime: true,
  },
  {
    feature: "Animated DP Table Fill-in",
    free: false,
    lifetime: true,
  },
  {
    feature: "Backtracking Pruning Tree Visualizer",
    free: false,
    lifetime: true,
  },
  {
    feature: "Timed Mock Interview Mode with progressive hints",
    free: false,
    lifetime: true,
  },
  {
    feature: "Achievement Badges & Certificate of Completion",
    free: false,
    lifetime: true,
  },
  {
    feature: "Early access to new visualizers & features",
    free: false,
    lifetime: true,
  },
  {
    feature: "Payment model",
    free: "Free forever",
    lifetime: "One-time payment",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-gold-dim">
            <span className="text-xs font-semibold uppercase tracking-widest text-bd-gold">
              Simple Pricing
            </span>
          </div>
          <h1 className="heading-display text-4xl sm:text-5xl mb-4">
            Lifetime Access,
            <br />
            <span className="bg-gradient-to-r from-bd-cyan via-bd-violet to-bd-gold bg-clip-text text-transparent">
              One Payment
            </span>
          </h1>
          <p className="body-text max-w-xl mx-auto">
            No subscriptions. No recurring fees. Pay once and unlock every visualizer,
            every problem set, and every future feature — forever.
          </p>
        </div>

        {/* Price cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Free */}
          <DiamondCard className="p-8 flex flex-col">
            <h2 className="heading-section text-xl text-bd-text-primary mb-1">Free</h2>
            <p className="text-sm text-bd-text-secondary mb-8">
              Foundations & Linear Structures fully unlocked.
            </p>
            <div className="heading-display text-5xl mb-2">&#8377;0</div>
            <p className="text-xs text-bd-text-muted mb-8">Free forever</p>
            <Link href="/learn" className="mt-auto">
              <DiamondButton variant="secondary" className="w-full justify-center">
                Start Learning Free
              </DiamondButton>
            </Link>
          </DiamondCard>

          {/* Lifetime */}
          <DiamondCard glow animatedGlow className="p-8 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4 clip-diamond-sm px-3 py-1 bg-bd-gold/20 text-bd-gold text-xs font-bold uppercase tracking-wider">
              Best Value
            </div>
            <h2 className="heading-section text-xl text-bd-gold mb-1">Lifetime</h2>
            <p className="text-sm text-bd-text-secondary mb-8">
              All 4 tiers. All visualizers. All problems. Forever.
            </p>
            <div className="heading-display text-5xl mb-2">&#8377;4,999</div>
            <p className="text-xs text-bd-text-muted mb-8">One-time payment. No subscription.</p>
            <div className="mt-auto">
              <CheckoutButton className="w-full justify-center" />
            </div>
          </DiamondCard>
        </div>

        {/* Feature comparison table */}
        <DiamondCard className="p-6 sm:p-8 overflow-x-auto">
          <h2 className="heading-section text-xl mb-8 text-center">
            Full Feature Comparison
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bd-border/40">
                <th className="text-left py-3 pr-4 text-bd-text-secondary font-medium">Feature</th>
                <th className="text-center py-3 px-4 text-bd-text-secondary font-medium w-24">
                  Free
                </th>
                <th className="text-center py-3 pl-4 text-bd-gold font-medium w-28">
                  Lifetime
                </th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, i) => (
                <tr
                  key={i}
                  className="border-b border-bd-border/20 last:border-0"
                >
                  <td className="py-3 pr-4 text-bd-text-secondary">{row.feature}</td>
                  <td className="py-3 px-4 text-center">
                    {row.free === true ? (
                      <CheckIcon className="text-bd-cyan inline" />
                    ) : row.free === false ? (
                      <CrossIcon className="text-bd-text-muted inline" />
                    ) : (
                      <span className="text-bd-text-secondary">{row.free}</span>
                    )}
                  </td>
                  <td className="py-3 pl-4 text-center">
                    {row.lifetime === true ? (
                      <CheckIcon className="text-bd-gold inline" />
                    ) : (
                      <span className="text-bd-text-secondary">{row.lifetime}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </DiamondCard>

        {/* FAQ teaser */}
        <div className="mt-16 text-center">
          <h3 className="heading-section text-lg mb-4">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {[
              {
                q: "Is this really a one-time payment?",
                a: "Yes. Pay once and you own lifetime access. No recurring charges, ever.",
              },
              {
                q: "What happens when new visualizers are added?",
                a: "Lifetime users get immediate access to every new feature and visualizer we ship.",
              },
              {
                q: "Can I switch from Free to Lifetime later?",
                a: "Absolutely. Your progress is preserved when you upgrade.",
              },
              {
                q: "Do you offer refunds?",
                a: "Yes, we offer a 7-day no-questions-asked refund policy.",
              },
            ].map((faq) => (
              <DiamondCard key={faq.q} className="p-4 text-left">
                <h4 className="text-sm font-semibold text-bd-text-primary mb-1">
                  {faq.q}
                </h4>
                <p className="text-xs text-bd-text-secondary">{faq.a}</p>
              </DiamondCard>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <DiamondCard animatedGlow className="p-8 sm:p-12 inline-block max-w-2xl">
            <h2 className="heading-display text-2xl sm:text-3xl mb-4">
              Ready to master DSA?
            </h2>
            <p className="body-text mb-6 max-w-md mx-auto">
              Start with the free tier and upgrade anytime to unlock the full
              Structify experience.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/learn">
                <DiamondButton variant="primary" size="md">
                  Start Free
                </DiamondButton>
              </Link>
              <CheckoutButton className="w-full justify-center" />
            </div>
          </DiamondCard>
        </div>
      </div>
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className={className}
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

function CrossIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
