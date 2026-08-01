"use client";

import { useEffect, useState } from "react";
import { Bookmark, CheckCircle2, Download, Save } from "lucide-react";
import type { Lesson } from "@/lib/types";
import { AITutor } from "./AITutor";
import { CodePlayground } from "./CodePlayground";
import { QuizEngine } from "./QuizEngine";
import { ArrayVisualizer } from "@/components/visualization/ArrayVisualizer";
import { TimelineController } from "@/components/visualization/TimelineController";
import { Badge, Button, Card, SectionTitle } from "@/components/ui";
import { useLearningStore } from "@/store/learning";

export function LessonExperience({ lesson }: { lesson: Lesson }) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const event = lesson.visualization[index];
  const completeLesson = useLearningStore((state) => state.completeLesson);
  const toggleBookmark = useLearningStore((state) => state.toggleBookmark);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => setIndex((current) => current === lesson.visualization.length - 1 ? 0 : current + 1), 1300);
    return () => window.clearTimeout(timer);
  }, [playing, index, lesson.visualization.length]);

  return <div className="mx-auto max-w-7xl px-4 py-10">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div><Badge>{lesson.course}</Badge><h1 className="mt-3 font-display text-4xl font-extrabold md:text-6xl">{lesson.title}</h1><p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">{lesson.summary}</p></div>
      <div className="flex gap-2"><Button variant="secondary" className="px-3" href="#"><Bookmark size={18} />Bookmark</Button><button className="focus-ring rounded-lg border border-slate-300 px-3 dark:border-white/15" onClick={() => toggleBookmark(lesson.slug)}><Save size={18} /></button><button className="focus-ring rounded-lg border border-slate-300 px-3 dark:border-white/15"><Download size={18} /></button></div>
    </div>

    <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <div className="space-y-8">
        <Card><div className="grid gap-4 md:grid-cols-3">{lesson.prerequisites.map((item) => <div key={item} className="rounded-lg bg-slate-100 p-4 dark:bg-white/10"><CheckCircle2 className="mb-3 text-mint" size={20} /><p className="font-bold">{item}</p></div>)}</div></Card>
        {Object.entries(lesson.sections).slice(0, 4).map(([title, bullets]) => <Card key={title}><h2 className="font-display text-2xl font-extrabold">{title}</h2><div className="mt-4 grid gap-3 md:grid-cols-2">{bullets.map((item) => <p key={item} className="rounded-lg bg-white/70 p-4 text-sm leading-6 text-slate-600 dark:bg-white/5 dark:text-slate-300">{item}</p>)}</div></Card>)}
        <section className="space-y-4"><SectionTitle eyebrow="visualization" title="Event-driven animation" text="Operations emit structured events. The visualizer, code editor, dry run, and tutor all subscribe to the same step." /><ArrayVisualizer event={event} /><TimelineController events={lesson.visualization} index={index} setIndex={setIndex} playing={playing} setPlaying={setPlaying} /></section>
        <Card><h2 className="font-display text-2xl font-extrabold">Complexity Analysis</h2><div className="mt-4 grid gap-3 md:grid-cols-3">{lesson.sections["Complexity Analysis"].map((item) => <div key={item} className="rounded-lg border border-slate-200 p-4 text-sm dark:border-white/10">{item}</div>)}</div></Card>
        <section className="space-y-4"><SectionTitle eyebrow="code" title="Live code execution" text="Editor, visualization, execution output, and tutor state stay synchronized." /><CodePlayground code={lesson.code} activeLine={event.codeLine} /></section>
        <section className="space-y-4"><SectionTitle eyebrow="quiz" title="Interactive checks" /><QuizEngine questions={lesson.quiz} /></section>
        <Card><h2 className="font-display text-2xl font-extrabold">Practice and interview</h2><div className="mt-4 grid gap-3">{lesson.practice.map((problem) => <div key={problem.title} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-100 p-4 dark:bg-white/10"><div><p className="font-bold">{problem.title}</p><p className="text-sm text-slate-500">{problem.pattern} - {problem.company}</p></div><Badge>{problem.difficulty}</Badge></div>)}</div></Card>
        <Button href="/practice" className="w-full" variant="primary">Continue to practice mode</Button>
        <button className="focus-ring w-full rounded-lg bg-mint px-4 py-3 font-bold text-ink" onClick={() => completeLesson(lesson.slug, lesson.xp)}>Mark lesson complete and earn {lesson.xp} XP</button>
      </div>
      <div className="space-y-4 lg:sticky lg:top-24 lg:self-start"><AITutor event={event} /><Card><h3 className="font-display text-xl font-extrabold">Lesson format</h3><div className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">{Object.keys(lesson.sections).map((item, step) => <p key={item}>{step + 1}. {item}</p>)}</div></Card></div>
    </div>
  </div>;
}
