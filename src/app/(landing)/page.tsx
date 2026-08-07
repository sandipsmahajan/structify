"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Color Palette (inline – white theme)                               */
/*  Purple #7C3AED  Blue #3B82F6  Text #171717  Muted #525252         */
/*  Bg #FAFAFA   Card #FFFFFF  Border #E5E5E5  Green #10B981          */
/* ------------------------------------------------------------------ */

const purple = "#7C3AED";
const purpleLight = "#A855F7";
const blue = "#3B82F6";
const blueLight = "#60A5FA";
const gradient = "linear-gradient(135deg, #7C3AED 0%, #3B82F6 100%)";
const gradientSoft = "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(59,130,246,0.08) 100%)";
const textPrimary = "#171717";
const textSecondary = "#525252";
const textMuted = "#A3A3A3";
const bg = "#FAFAFA";
const cardBg = "#FFFFFF";

/* ------------------------------------------------------------------ */
/*  Shared components                                                  */
/* ------------------------------------------------------------------ */

function SectionTag({ children }: { children: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200/40 mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
      <span className="text-xs font-semibold uppercase tracking-widest text-purple-600">{children}</span>
    </div>
  );
}

function GradientText({ children, className = "" }: { children: string; className?: string }) {
  return (
    <span className={`bg-gradient-to-r from-purple-600 via-purple-500 to-blue-500 bg-clip-text text-transparent ${className}`}>
      {children}
    </span>
  );
}

function PrimaryButton({ children, href, ...props }: { children: string; href: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Link href={href}>
      <button
        {...props}
        className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-white overflow-hidden group shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-shadow"
        style={{ background: gradient }}
      >
        <span className="absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative">{children}</span>
        <span className="relative">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </span>
      </button>
    </Link>
  );
}

function SecondaryButton({ children, href, ...props }: { children: string; href: string } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Link href={href}>
      <button
        {...props}
        className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl font-semibold text-sm text-purple-600 bg-white border border-purple-200 hover:bg-purple-50 hover:border-purple-300 transition-colors shadow-sm"
      >
        {children}
      </button>
    </Link>
  );
}

function FadeInSection({ children, className = "", delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1, rootMargin: "-40px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [mounted]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 1, y: 0 }}
      animate={mounted && visible ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Landing Navigation                                                  */
/* ------------------------------------------------------------------ */

const navItems = [
  { label: "Home", href: "/" },
  { label: "Learn", href: "/learn" },
  { label: "Roadmap", href: "/learn" },
  { label: "Playground", href: "/visualize" },
  { label: "Practice", href: "/practice" },
  { label: "Pricing", href: "/pricing" },
];

function LandingNav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: gradient }}>
            S
          </div>
          <span className="font-bold text-lg" style={{ color: textPrimary }}>
            Structify
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/auth/signin" className="text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors">
            Login
          </Link>
          <Link
            href="/learn"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md shadow-purple-500/25 hover:shadow-lg hover:shadow-purple-500/30 transition-shadow"
            style={{ background: gradient }}
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={textPrimary} strokeWidth="2">
            {mobileOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-b border-gray-100 overflow-hidden"
          >
            <div className="px-6 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <div className="border-t border-gray-100 pt-4 mt-2 flex gap-3">
                <Link
                  href="/auth/signin"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-xl text-sm font-medium border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/learn"
                  onClick={() => setMobileOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-md"
                  style={{ background: gradient }}
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  DSA Universe – Isometric Illustration                              */
/* ------------------------------------------------------------------ */

type Islet = { label: string; icon: string; x: number; y: number; color: string; road: number[] };

const islets: Islet[] = [
  { label: "Arrays", icon: "🚆", x: 18, y: 10, color: "#7C3AED", road: [1, 3] },
  { label: "Linked List", icon: "🌉", x: 42, y: 22, color: "#3B82F6", road: [0, 2, 4] },
  { label: "Stacks", icon: "🏢", x: 65, y: 12, color: "#8B5CF6", road: [1, 3, 5] },
  { label: "Queues", icon: "✈️", x: 30, y: 42, color: "#6366F1", road: [0, 4] },
  { label: "Trees", icon: "🌳", x: 55, y: 38, color: "#06B6D4", road: [2, 6] },
  { label: "Graphs", icon: "🌐", x: 72, y: 52, color: "#0EA5E9", road: [2, 6, 7] },
  { label: "Heaps", icon: "⛰️", x: 48, y: 62, color: "#A855F7", road: [4, 7] },
  { label: "Hash Table", icon: "🔐", x: 10, y: 58, color: "#F59E0B", road: [3, 6] },
];

const roadPairs = [[0, 1], [0, 3], [1, 2], [1, 4], [2, 5], [3, 4], [3, 7], [4, 6], [4, 7], [5, 6]];

function DSAUniverse() {
  return (
    <svg viewBox="0 0 800 500" className="w-full h-auto max-w-2xl mx-auto" fill="none">
      <defs>
        <linearGradient id="roadGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop stopColor="#7C3AED" stopOpacity="0" />
          <stop offset="50%" stopColor="#A855F7" stopOpacity="0.6" />
          <stop stopColor="#3B82F6" stopOpacity="0" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Background platform - hexagonal base */}
      <ellipse cx="400" cy="320" rx="350" ry="140" fill="url(#roadGrad)" opacity="0.08" />
      <ellipse cx="400" cy="320" rx="320" ry="128" stroke="#D8B4FE" strokeWidth="1.5" strokeDasharray="8 4" fill="none" opacity="0.3" />

      {/* Grid pattern on the platform */}
      {Array.from({ length: 6 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const cx = 100 + col * 85 + (row % 2) * 42;
          const cy = 240 + row * 30;
          return (
            <g key={`${row}-${col}`} opacity={0.12}>
              {[2, 4, 6].includes(row) && (
                <circle cx={cx} cy={cy} r="1.5" fill="#7C3AED" />
              )}
            </g>
          );
        })
      )}

      {/* Glowing roads between nodes */}
      {roadPairs.map(([a, b], i) => {
        const from = islets[a];
        const to = islets[b];
        const fx = (from.x / 100) * 760 + 20;
        const fy = (from.y / 100) * 460 + 20;
        const tx = (to.x / 100) * 760 + 20;
        const ty = (to.y / 100) * 460 + 20;
        return (
          <line
            key={i}
            x1={fx} y1={fy} x2={tx} y2={ty}
            stroke="url(#roadGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.4"
          />
        );
      })}

      {/* Islets */}
      {islets.map((islet, i) => {
        const cx = (islet.x / 100) * 760 + 20;
        const cy = (islet.y / 100) * 460 + 20;
        return (
          <g key={i} filter={i === 0 ? "url(#glow)" : undefined}>
            {/* Platform hexagon */}
            <polygon
              points={`${cx},${cy - 24} ${cx + 20},${cy - 12} ${cx + 20},${cy + 12} ${cx},${cy + 24} ${cx - 20},${cy + 12} ${cx - 20},${cy - 12}`}
              fill={islet.color}
              opacity="0.12"
              stroke={islet.color}
              strokeWidth="1.5"
            />
            {/* 3D side faces */}
            <polygon points={`${cx},${cy + 24} ${cx + 20},${cy + 12} ${cx + 20},${cy + 24} ${cx},${cy + 36}`} fill={islet.color} opacity="0.08" />
            <polygon points={`${cx},${cy + 24} ${cx - 20},${cy + 12} ${cx - 20},${cy + 24} ${cx},${cy + 36}`} fill={islet.color} opacity="0.06" />
            {/* Label */}
            <text x={cx} y={cy + 5} textAnchor="middle" fontSize="10" fill={islet.color} fontWeight="600" fontFamily="var(--font-sans)">
              {islet.label}
            </text>
            {/* Icon */}
            <text x={cx} y={cy - 28} textAnchor="middle" fontSize="16">{islet.icon}</text>
          </g>
        );
      })}

      {/* Central student avatar (traveling dot) */}
      <circle cx="135" cy="70" r="6" fill={purple} opacity="0.6" className="animate-pulse" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                            */
/* ------------------------------------------------------------------ */

/* --- Hero --- */
function HeroSection() {
  return (
    <section className="relative pt-32 pb-20 sm:pt-40 sm:pb-28 overflow-hidden" style={{ background: "linear-gradient(180deg, #FAFAFA 0%, #F5F0FF 60%, #FAFAFA 100%)" }}>
      {/* Ambient background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-purple-400/10 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <SectionTag>Visual DSA Learning Platform</SectionTag>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.08] mb-6 max-w-5xl mx-auto" style={{ color: textPrimary }}>
            Master Data Structures
            <br />
            <GradientText>& Algorithms Visually</GradientText>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: textSecondary }}>
            Learn DSA through animations, simulations, real-world examples, interactive practice, and interview-focused learning paths.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <PrimaryButton href="/learn">Start Learning Free</PrimaryButton>
            <SecondaryButton href="/learn">Explore Roadmap</SecondaryButton>
          </div>

          {/* Trust indicators */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 max-w-3xl mx-auto">
            {[
              { value: "400+", label: "Concepts" },
              { value: "2,500+", label: "Problems" },
              { value: "100+", label: "Real-World Scenarios" },
              { value: "Mock", label: "Interview Prep" },
              { value: "Track", label: "Progress" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold" style={{ color: purple }}>{stat.value}</div>
                <div className="text-xs text-gray-500 mt-1 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* DSA Universe illustration */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-12 max-w-3xl mx-auto"
        >
          <DSAUniverse />
        </motion.div>
      </div>
    </section>
  );
}

/* --- Roadmap --- */

const roadmapCategories = [
  {
    title: "Foundations",
    accent: purple,
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    items: ["Time Complexity", "Space Complexity", "Recursion", "Mathematics", "Bit Manipulation", "Logic Building"],
  },
  {
    title: "Linear Structures",
    accent: blue,
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-700",
    items: ["Arrays", "Strings", "Linked Lists", "Stacks", "Queues", "Deques"],
  },
  {
    title: "Hashing",
    accent: "#8B5CF6",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    items: ["Hash Tables", "Hash Functions", "Collision Resolution", "Consistent Hashing"],
  },
  {
    title: "Trees",
    accent: "#06B6D4",
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    items: ["Binary Tree", "BST", "AVL Tree", "Red-Black", "Segment Tree", "Fenwick Tree", "Trie", "B-Tree"],
  },
  {
    title: "Heaps",
    accent: "#F59E0B",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    items: ["Binary Heap", "Min Heap", "Max Heap", "Priority Queue", "Heap Sort"],
  },
  {
    title: "Graphs",
    accent: "#0EA5E9",
    bg: "bg-sky-50",
    border: "border-sky-200",
    text: "text-sky-700",
    items: ["BFS", "DFS", "Topological Sort", "MST", "Dijkstra", "Bellman-Ford", "Floyd-Warshall", "A*"],
  },
  {
    title: "Advanced",
    accent: purple,
    bg: "bg-purple-50",
    border: "border-purple-200",
    text: "text-purple-700",
    items: ["Greedy", "Dynamic Programming", "Backtracking", "Divide & Conquer", "Meet In Middle", "Bitmasking"],
  },
];

function RoadmapSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Complete Curriculum</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            Everything You Need To Master
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            A structured path from fundamentals to advanced algorithmic thinking, with 50+ topics across 7 categories.
          </p>
          <div className="flex items-center justify-center gap-6 mt-6">
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: purple }}>50+</span>
              <span className="text-xs text-gray-500 block">Topics</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: purple }}>400+</span>
              <span className="text-xs text-gray-500 block">Concepts</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div className="text-center">
              <span className="text-2xl font-bold" style={{ color: purple }}>7</span>
              <span className="text-xs text-gray-500 block">Categories</span>
            </div>
          </div>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {roadmapCategories.map((cat, i) => (
            <FadeInSection key={cat.title} delay={i * 0.08}>
              <div className="rounded-2xl p-5 border h-full hover:shadow-lg transition-shadow duration-300" style={{ background: cardBg, borderColor: "#E5E5E5" }}>
                <h3 className="font-bold text-base mb-3" style={{ color: cat.accent }}>{cat.title}</h3>
                <ul className="space-y-1.5">
                  {cat.items.map((item) => (
                    <li key={item} className="text-sm flex items-center gap-2" style={{ color: textSecondary }}>
                      <span className="w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: cat.accent, opacity: 0.5 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Comparison --- */

const comparisons = [
  { left: "Theory Heavy", leftIcon: "📚", right: "Visual Learning", rightIcon: "👁️" },
  { left: "Static Diagrams", leftIcon: "📊", right: "Interactive Simulations", rightIcon: "🎮" },
  { left: "Memorization", leftIcon: "🧠", right: "Real-World Scenarios", rightIcon: "🌍" },
  { left: "No Clear Path", leftIcon: "🧭", right: "Guided Learning Journey", rightIcon: "🗺️" },
  { left: "Generic Examples", leftIcon: "📝", right: "Interview Preparation", rightIcon: "🎯" },
];

function ComparisonSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: cardBg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Why Structify</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            A Different Way To Learn DSA
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Traditional resources make DSA feel abstract and boring. Structify makes it visual, interactive, and actually fun.
          </p>
        </FadeInSection>

        <div className="max-w-3xl mx-auto space-y-4">
          {comparisons.map((row, i) => (
            <FadeInSection key={i} delay={i * 0.1}>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl p-5 border border-red-100 bg-red-50/40 flex items-center gap-4">
                  <span className="text-xl">{row.leftIcon}</span>
                  <div>
                    <div className="text-xs text-red-500 font-semibold uppercase tracking-wider mb-0.5">Traditional</div>
                    <div className="text-sm font-medium text-red-700 line-through decoration-red-300">{row.left}</div>
                  </div>
                </div>
                <div className="rounded-2xl p-5 border border-green-100 bg-green-50/40 flex items-center gap-4">
                  <span className="text-xl">{row.rightIcon}</span>
                  <div>
                    <div className="text-xs text-green-500 font-semibold uppercase tracking-wider mb-0.5">Structify</div>
                    <div className="text-sm font-semibold" style={{ color: "#059669" }}>{row.right}</div>
                  </div>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Learning Engine --- */

const learningSteps = [
  {
    step: 1, title: "Story", desc: "Every concept starts with a real-world story that makes it relatable and memorable.",
    icon: "📖", color: "#7C3AED",
  },
  {
    step: 2, title: "Visualize", desc: "Watch the data structure come alive with interactive 2D animations and step-by-step playback.",
    icon: "👁️", color: "#3B82F6",
  },
  {
    step: 3, title: "Simulate", desc: "Insert, delete, and traverse — control the simulation yourself to build true intuition.",
    icon: "🎮", color: "#8B5CF6",
  },
  {
    step: 4, title: "Practice", desc: "Solve curated problems with progressive difficulty, linked to LeetCode and HackerRank.",
    icon: "💪", color: "#06B6D4",
  },
  {
    step: 5, title: "Patterns", desc: "Recognize the 14 core problem-solving patterns that top companies ask in interviews.",
    icon: "🧩", color: "#F59E0B",
  },
  {
    step: 6, title: "Interview Prep", desc: "Mock interview mode with timed sessions, hints, and real pressure simulation.",
    icon: "🎯", color: "#10B981",
  },
];

function LearningEngineSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Learning Engine</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            Learn Once. Remember Forever.
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Our six-step methodology builds layered understanding that sticks — because you see it, do it, and apply it.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {learningSteps.map((item, i) => (
            <FadeInSection key={item.step} delay={i * 0.1}>
              <div className="relative rounded-2xl p-6 border hover:shadow-xl transition-shadow duration-300" style={{ background: cardBg, borderColor: "#E5E5E5" }}>
                {/* Connector to next step */}
                {i < learningSteps.length - 1 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 z-10">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={purpleLight} strokeWidth="2" strokeLinecap="round" opacity="0.4">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-4" style={{ backgroundColor: `${item.color}15` }}>
                  {item.icon}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold rounded-lg px-2 py-0.5 text-white" style={{ backgroundColor: item.color }}>0{item.step}</span>
                  <h3 className="font-bold text-base" style={{ color: textPrimary }}>{item.title}</h3>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{item.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Real World --- */

const realWorldExamples = [
  { concept: "Array", example: "Spotify Playlists", desc: "A playlist is an ordered collection of songs, just like an array. Shuffle rearranges the order.", icon: "🎵", color: "#7C3AED" },
  { concept: "Linked List", example: "Browser History", desc: "Back and forward buttons traverse a doubly-linked list of visited pages.", icon: "🌐", color: "#3B82F6" },
  { concept: "Stack", example: "Undo / Redo", desc: "Every edit you make is pushed onto a stack. Undo pops the last action off.", icon: "↩️", color: "#8B5CF6" },
  { concept: "Queue", example: "Airport Boarding", desc: "First passenger in line boards first. A FIFO queue processes passengers in order.", icon: "✈️", color: "#06B6D4" },
  { concept: "Tree", example: "File System", desc: "Your computer's folders and files form a tree. Each folder is a node with children.", icon: "📁", color: "#0EA5E9" },
  { concept: "Graph", example: "Social Network", desc: "Friends are nodes, connections are edges. BFS finds the shortest introduction path.", icon: "👥", color: "#F59E0B" },
  { concept: "Heap", example: "Uber Matching", desc: "The nearest driver is always at the top of a min-heap, O(log n) retrieval.", icon: "🚗", color: "#A855F7" },
  { concept: "Hash Table", example: "Dictionary Lookup", desc: "Looking up a word's definition is O(1) — the hash function maps directly to its entry.", icon: "📚", color: "#10B981" },
];

function RealWorldSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: cardBg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Real-World Connections</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            DSA Exists Everywhere
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Every great app you use is powered by data structures. See how they work in the products you love.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {realWorldExamples.map((item, i) => (
            <FadeInSection key={item.concept} delay={i * 0.07}>
              <div className="rounded-2xl p-5 border h-full hover:shadow-lg transition-shadow duration-300 group" style={{ background: cardBg, borderColor: "#E5E5E5" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: `${item.color}12` }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: item.color }}>{item.concept}</h3>
                <p className="text-sm font-semibold mb-2" style={{ color: textPrimary }}>{item.example}</p>
                <p className="text-xs leading-relaxed" style={{ color: textSecondary }}>{item.desc}</p>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Interactive Preview --- */

function InteractivePreviewSection() {
  const [activeOp, setActiveOp] = useState<"access" | "insert" | "delete" | "update" | "traverse">("access");
  const [highlighted, setHighlighted] = useState(2);
  const [playStep, setPlayStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const arr = [10, 20, 30, 40, 50];

  useEffect(() => {
    if (!playing) return;
    const t = setInterval(() => {
      setPlayStep((s) => {
        const next = s + 1;
        if (next > arr.length) { setPlaying(false); return 0; }
        return next;
      });
    }, 600);
    return () => clearInterval(t);
  }, [playing, arr.length]);

  useEffect(() => {
    if (activeOp === "traverse") setHighlighted(playStep);
    else { setPlayStep(0); setPlaying(false); }
  }, [activeOp]);

  useEffect(() => {
    if (activeOp === "traverse") setHighlighted(playStep);
  }, [playStep, activeOp]);

  const operations = [
    { key: "access", label: "Access arr[2]", desc: "O(1) — Directly jump to index 2", result: "30" },
    { key: "insert", label: "Insert at 2", desc: "O(n) — Shift elements right", result: "[10,20,99,30,40,50]" },
    { key: "delete", label: "Delete at 2", desc: "O(n) — Shift elements left", result: "[10,20,40,50]" },
    { key: "update", label: "Update arr[2]", desc: "O(1) — Overwrite existing value", result: "[10,20,99,40,50]" },
    { key: "traverse", label: "Traverse", desc: "O(n) — Visit every element", result: "10→20→30→40→50" },
  ];

  const op = operations.find((o) => o.key === activeOp)!;

  return (
    <section className="py-20 sm:py-28" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Interactive Preview</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            See It In Action
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Try a live array lesson right here. Click operations, watch animations, understand complexity.
          </p>
        </FadeInSection>

        <FadeInSection>
          <div className="max-w-3xl mx-auto rounded-3xl border p-6 sm:p-8 shadow-lg" style={{ background: cardBg, borderColor: "#E5E5E5" }}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left: Operations */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Operations</h4>
                {operations.map((o) => (
                  <button
                    key={o.key}
                    onClick={() => { setActiveOp(o.key as typeof activeOp); setHighlighted(2); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                      activeOp === o.key
                        ? "text-white shadow-md"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                    style={activeOp === o.key ? { background: gradient } : {}}
                  >
                    {o.label}
                  </button>
                ))}
              </div>

              {/* Center: Array visualization */}
              <div className="flex flex-col items-center justify-center gap-4 min-h-[160px]">
                <div className="flex items-center gap-2">
                  {arr.map((val, i) => {
                    const isHL = activeOp === "traverse" ? i < highlighted : activeOp === "access" ? i === 2 : false;
                    const isDeleted = activeOp === "delete" && i === 2;
                    const isInserted = activeOp === "insert" && i === 2;
                    return (
                      <motion.div
                        key={i}
                        layout
                        animate={{
                          scale: isHL ? 1.1 : isDeleted ? 0 : isInserted ? [0, 1.2, 1] : 1,
                          opacity: isDeleted ? 0 : 1,
                          backgroundColor: isHL ? "#7C3AED" : isDeleted ? "transparent" : cardBg,
                          color: isHL ? "#FFFFFF" : isDeleted ? "transparent" : textPrimary,
                          borderColor: isHL ? "#7C3AED" : isDeleted ? "transparent" : "#E5E5E5",
                        }}
                        className="w-12 h-12 rounded-xl border flex items-center justify-center font-mono text-sm font-semibold"
                      >
                        {isDeleted ? "" : val}
                      </motion.div>
                    );
                  })}
                  {activeOp === "insert" && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-12 h-12 rounded-xl border-2 border-dashed border-purple-400 flex items-center justify-center font-mono text-sm font-semibold text-purple-600 bg-purple-50"
                    >
                      99
                    </motion.div>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono">{op.desc}</p>
              </div>

              {/* Right: Output & controls */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-gray-400">Output</h4>
                <div className="rounded-xl p-3 font-mono text-sm font-semibold text-center" style={{ background: gradientSoft, color: purple }}>
                  {op.result}
                </div>

                {/* Playback controls for traverse */}
                {activeOp === "traverse" && (
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setPlaying(!playing)}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      style={{ color: purple }}
                    >
                      {playing ? (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" /></svg>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20" /></svg>
                      )}
                    </button>
                    <button
                      onClick={() => { setPlaying(false); setPlayStep((s) => Math.max(0, s - 1)); }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="6" width="4" height="12" /><polygon points="18,6 14,12 18,18" /></svg>
                    </button>
                    <button
                      onClick={() => { setPlaying(false); setPlayStep((s) => Math.min(arr.length, s + 1)); }}
                      className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><rect x="14" y="6" width="4" height="12" /><polygon points="6,6 10,12 6,18" /></svg>
                    </button>
                    <span className="text-xs text-gray-400 font-mono">Step {playStep}/{arr.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}

/* --- Progress Journey --- */

const journeyStages = [
  { title: "Beginner Explorer", icon: "🌱", desc: "Start with Big-O notation, arrays, and basic problem-solving." },
  { title: "Data Adventurer", icon: "🔍", desc: "Master linked lists, stacks, queues, and hashing techniques." },
  { title: "Problem Solver", icon: "⚡", desc: "Conquer trees, heaps, recursion, and graph traversal algorithms." },
  { title: "Algorithm Master", icon: "🏆", desc: "Tackle DP, greedy, backtracking, and advanced graph algorithms." },
  { title: "Interview Champion", icon: "👑", desc: "Mock interviews, timed practice, and real-world system design." },
];

function ProgressJourneySection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: cardBg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Your Journey</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            From Beginner To Interview Champion
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Progress through five stages, each with clear milestones and achievements to unlock.
          </p>
        </FadeInSection>

        <div className="max-w-4xl mx-auto">
          {journeyStages.map((stage, i) => (
            <FadeInSection key={stage.title} delay={i * 0.15}>
              <div className="flex items-start gap-5 relative pb-10 last:pb-0">
                {/* Vertical connector line */}
                {i < journeyStages.length - 1 && (
                  <div className="absolute left-[27px] top-14 bottom-0 w-0.5" style={{ background: "linear-gradient(180deg, #7C3AED 0%, #3B82F6 100%)" }} />
                )}
                {/* Badge circle */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 shadow-md" style={{ background: cardBg, borderColor: purpleLight }}>
                  {stage.icon}
                </div>
                <div className="pt-1.5">
                  <h3 className="font-bold text-lg mb-1" style={{ color: textPrimary }}>{stage.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: textSecondary }}>{stage.desc}</p>
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Testimonials --- */

const testimonials = [
  {
    name: "Priya Sharma",
    role: "SDE at Microsoft",
    avatar: "PS",
    color: "#7C3AED",
    quote: "Structify helped me finally understand trees and graphs visually. I landed my dream software engineering role after 6 months of consistent practice.",
  },
  {
    name: "Arjun Patel",
    role: "Backend Engineer at Uber",
    avatar: "AP",
    color: "#3B82F6",
    quote: "The visualizers make abstract concepts click instantly. I went from barely passing DSA rounds to confidently solving medium LeetCode problems in 3 months.",
  },
  {
    name: "Neha Gupta",
    role: "CS Student at IIT Delhi",
    avatar: "NG",
    color: "#8B5CF6",
    quote: "Every concept is tied to a real-world example I already know. Learning DP through the Spotify playlist analogy was a game-changer for me.",
  },
];

function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: bg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Testimonials</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            Loved By Learners Worldwide
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Hear from students who transformed their DSA skills with Structify.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <FadeInSection key={t.name} delay={i * 0.15}>
              <div className="rounded-2xl p-6 border hover:shadow-lg transition-shadow duration-300" style={{ background: cardBg, borderColor: "#E5E5E5" }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: t.color }}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm" style={{ color: textPrimary }}>{t.name}</div>
                    <div className="text-xs" style={{ color: textMuted }}>{t.role}</div>
                  </div>
                </div>
                <p className="text-sm leading-relaxed italic" style={{ color: textSecondary }}>
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex gap-1 mt-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#F59E0B">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Pricing --- */

const pricingTiers = [
  {
    name: "Free",
    price: "0",
    color: "#525252",
    bg: "bg-gray-50",
    border: "border-gray-200",
    features: ["Limited Concepts", "Basic Practice", "Array & String Visualizers"],
  },
  {
    name: "Pro",
    price: "1,999",
    period: "/year",
    color: purple,
    bg: "bg-purple-50/60",
    border: "border-purple-300",
    popular: true,
    features: ["Full Roadmap Access", "All Visual Simulations", "2,500+ Practice Problems", "Progress Tracking", "Mock Interview Mode"],
  },
  {
    name: "Lifetime",
    price: "4,999",
    color: "#F59E0B",
    bg: "bg-amber-50/60",
    border: "border-amber-300",
    features: ["Everything in Pro", "Lifetime Access", "All Future Updates", "Premium Badges", "Early Access"],
  },
];

function PricingSection() {
  return (
    <section className="py-20 sm:py-28" style={{ background: cardBg }}>
      <div className="max-w-7xl mx-auto px-6">
        <FadeInSection className="text-center mb-16">
          <SectionTag>Pricing</SectionTag>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: textPrimary }}>
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg max-w-xl mx-auto" style={{ color: textSecondary }}>
            Start free. Upgrade when you're ready. No hidden fees, no auto-renewals.
          </p>
        </FadeInSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {pricingTiers.map((tier, i) => (
            <FadeInSection key={tier.name} delay={i * 0.1}>
              <div
                className={`relative rounded-2xl p-6 border-2 h-full flex flex-col ${tier.popular ? "shadow-xl scale-[1.02]" : "shadow-sm"}`}
                style={{ background: cardBg, borderColor: tier.popular ? purple : "#E5E5E5" }}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-white text-xs font-bold shadow-lg" style={{ background: gradient }}>
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: tier.color }}>{tier.name}</h3>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-3xl font-bold" style={{ color: textPrimary }}>&#8377;{tier.price}</span>
                  {tier.period && <span className="text-sm text-gray-400">{tier.period}</span>}
                </div>
                <p className="text-xs text-gray-400 mb-4">{tier.name === "Lifetime" ? "One-time payment" : tier.name === "Free" ? "No credit card required" : "Billed annually"}</p>
                <ul className="space-y-2.5 mb-6 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="text-sm flex items-center gap-2" style={{ color: textSecondary }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={tier.color} strokeWidth="2.5"><path d="M20 6L9 17l-5-5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={tier.name === "Free" ? "/learn" : "/pricing"}
                  className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                    tier.popular
                      ? "text-white shadow-md shadow-purple-500/25 hover:shadow-lg"
                      : tier.name === "Free"
                        ? "text-gray-600 border border-gray-200 hover:bg-gray-50"
                        : "text-purple-600 border border-purple-200 hover:bg-purple-50"
                  }`}
                  style={tier.popular ? { background: gradient } : {}}
                >
                  {tier.name === "Free" ? "Start Learning" : "Get Started"}
                </Link>
              </div>
            </FadeInSection>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Final CTA --- */

function FinalCTASection() {
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #3B82F6 50%, #1D4ED8 100%)" }}>
      {/* Decorative blobs */}
      <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-white/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="flex justify-center gap-4 mb-8 text-5xl">
          <span>🏆</span><span>🎓</span><span>📚</span><span>⭐</span>
        </div>

        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
          Ready To Master DSA
          <br />
          The Visual Way?
        </h2>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/learn"
            className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-purple-700 bg-white hover:bg-purple-50 shadow-lg hover:shadow-xl transition-all"
          >
            Start Learning Free
          </Link>
          <Link
            href="/pricing"
            className="px-8 py-3.5 rounded-2xl font-semibold text-sm text-white border-2 border-white/30 hover:bg-white/10 transition-colors"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* --- Footer --- */

const footerColumns = [
  {
    title: "Platform",
    links: [
      { label: "Learn", href: "/learn" },
      { label: "Practice", href: "/practice" },
      { label: "Playground", href: "/visualize" },
      { label: "Roadmap", href: "/learn" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "#" },
      { label: "Tutorials", href: "#" },
      { label: "Cheat Sheets", href: "#" },
      { label: "Glossary", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "#" },
      { label: "LinkedIn", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
];

function FooterSection() {
  return (
    <footer className="py-16 border-t" style={{ background: bg, borderColor: "#E5E5E5" }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 mb-12">
          {/* Logo column */}
          <div className="col-span-2 sm:col-span-1 lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: gradient }}>
                S
              </div>
              <span className="font-bold text-lg" style={{ color: textPrimary }}>Structify</span>
            </div>
            <p className="text-sm mb-4" style={{ color: textSecondary }}>
              Master Data Structures & Algorithms through interactive visualizations.
            </p>
            {/* Newsletter */}
            <div className="flex gap-2 max-w-xs">
              <input
                type="email"
                placeholder="you@email.com"
                className="flex-1 px-4 py-2 rounded-xl border text-sm outline-none focus:border-purple-400 transition-colors"
                style={{ borderColor: "#E5E5E5", background: cardBg }}
              />
              <button
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{ background: gradient }}
              >
                Subscribe
              </button>
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: textMuted }}>{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm hover:text-purple-600 transition-colors" style={{ color: textSecondary }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#E5E5E5" }}>
          <p className="text-xs" style={{ color: textMuted }}>
            &copy; {new Date().getFullYear()} Structify. All rights reserved.
          </p>
          {/* Social icons */}
          <div className="flex items-center gap-4">
            {["Discord", "LinkedIn", "YouTube", "GitHub"].map((platform) => (
              <a key={platform} href="#" className="text-gray-400 hover:text-purple-500 transition-colors">
                <span className="text-xs">{platform}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Landing Page                                                  */
/* ------------------------------------------------------------------ */

export default function LandingPage() {
  return (
    <div style={{ background: bg }}>
      <LandingNav />
      <HeroSection />
      <RoadmapSection />
      <ComparisonSection />
      <LearningEngineSection />
      <RealWorldSection />
      <InteractivePreviewSection />
      <ProgressJourneySection />
      <TestimonialsSection />
      <PricingSection />
      <FinalCTASection />
      <FooterSection />
    </div>
  );
}
