import { ArrowRight, Brain, ChartNoAxesCombined, Code2, GitBranch, Play, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Button, Card, SectionTitle } from "@/components/ui";
import { roadmap } from "@/lib/content";

const features = [
  [Brain, "AI tutor", "Explains swaps, recursion returns, DP reuse, and complexity through hints."],
  [Play, "Visual engine", "Every operation emits events consumed by playback, code, and explanations."],
  [Code2, "Code runner", "Monaco playground for Java, Python, C++, JavaScript, and Go."],
  [GitBranch, "Roadmap locks", "Courses unlock through prerequisites from foundation to interviews."],
  [ChartNoAxesCombined, "Big O lab", "Growth curves, sliders, best/worst/average, amortized analysis."],
  [Sparkles, "Gamification", "XP, coins, badges, streaks, challenges, and certificates."],
] as const;

export default function Home() {
  return <AppShell>
    <section className="relative overflow-hidden px-4 py-16 md:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
        <div><Badge>Commercial ed-tech foundation</Badge><h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.02] md:text-7xl">Structify</h1><p className="mt-5 max-w-2xl text-xl leading-8 text-slate-600 dark:text-slate-300">Learn data structures and algorithms by touching the concept: animated operations, dry runs, code execution, quizzes, AI hints, and interview practice in one focused workspace.</p><div className="mt-8 flex flex-wrap gap-3"><Button href="/learn/binary-search">Start learning <ArrowRight size={18} /></Button><Button href="/roadmap" variant="secondary">View roadmap</Button></div></div>
        <div className="surface rounded-lg p-4"><div className="rounded-lg bg-ink p-4 text-white dark:bg-white dark:text-ink"><div className="mb-4 flex items-center justify-between"><span className="font-bold">Binary Search Timeline</span><span className="text-xs">60 FPS</span></div><div className="grid grid-cols-7 gap-2">{[2, 4, 7, 8, 12, 19, 31].map((value, index) => <div key={value} className={`grid aspect-square place-items-center rounded-md text-sm font-bold ${index === 4 ? "bg-brand text-white" : index > 3 ? "bg-mint/80 text-ink" : "bg-white/12"}`}>{value}</div>)}</div><div className="mt-5 h-2 rounded-full bg-white/15"><div className="h-2 w-2/3 rounded-full bg-mint" /></div><p className="mt-4 text-sm opacity-80">AI hint: explain why the left half is no longer valid before revealing the result.</p></div></div>
      </div>
    </section>
    <section className="px-4 py-12"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="platform" title="A full learning system" text="Not a gallery of animations. Structify connects roadmap progress, lessons, playgrounds, practice, interviews, and administration." /><div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{features.map(([Icon, title, text]) => <Card key={title}><Icon className="text-brand" size={24} /><h3 className="mt-4 font-display text-xl font-extrabold">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{text}</p></Card>)}</div></div></section>
    <section className="px-4 py-12"><div className="mx-auto max-w-7xl"><SectionTitle eyebrow="roadmap" title="Beginner to interview ready" /><div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-4">{roadmap.slice(0, 8).map((course, index) => <Card key={course.id}><p className="text-sm text-slate-500">Step {index + 1}</p><h3 className="mt-2 font-display text-xl font-extrabold">{course.title}</h3><div className="mt-4 h-2 rounded-full bg-slate-200 dark:bg-white/10"><div className="h-2 rounded-full bg-brand" style={{ width: `${course.progress}%` }} /></div><p className="mt-3 text-sm font-semibold">{course.status}</p></Card>)}</div></div></section>
  </AppShell>;
}
