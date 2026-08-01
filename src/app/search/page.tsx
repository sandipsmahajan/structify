"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { lessons, roadmap } from "@/lib/content";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const results = useMemo(() => lessons.filter((lesson) => [lesson.title, lesson.course, lesson.summary, ...lesson.examples].join(" ").toLowerCase().includes(normalized)).slice(0, 24), [normalized]);

  return <AppShell><div className="mx-auto max-w-7xl px-4 py-10"><SectionTitle eyebrow="search" title="Find any DSA lesson" text="Search lessons, algorithms, data structures, courses, problems, interview patterns, and complexity topics." /><div className="surface mt-8 flex items-center gap-3 rounded-lg p-4"><Search className="text-brand" /><input className="h-12 flex-1 bg-transparent text-lg outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search binary search, AVL, DP, Dijkstra, memory..." /></div><div className="mt-8 grid gap-4 lg:grid-cols-[1fr_320px]"><div className="grid gap-3">{results.map((lesson) => <a key={lesson.slug} href={`/learn/${lesson.slug}`} className="focus-ring surface rounded-lg p-5 transition hover:-translate-y-0.5"><div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-2xl font-extrabold">{lesson.title}</h2><Badge>{lesson.course}</Badge></div><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{lesson.summary}</p><p className="mt-3 text-xs font-bold uppercase tracking-[0.16em] text-brand">{lesson.unlockRequirements?.join(" | ")}</p></a>)}</div><Card><h2 className="font-display text-2xl font-extrabold">Courses</h2><div className="mt-4 space-y-2">{roadmap.map((course) => <p key={course.id} className="rounded-lg bg-slate-100 p-3 text-sm font-semibold dark:bg-white/10">{course.title}</p>)}</div></Card></div></div></AppShell>;
}
