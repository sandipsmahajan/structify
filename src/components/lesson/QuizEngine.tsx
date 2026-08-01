"use client";

import { useState } from "react";
import type { QuizQuestion } from "@/lib/types";

export function QuizEngine({ questions }: { questions: QuizQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const score = questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0);
  return <div className="space-y-4">
    {questions.map((question, index) => <div key={question.prompt} className="surface rounded-lg p-5">
      <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold">{question.prompt}</h3><span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-white/10">{question.type}</span></div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">{question.options.map((option) => <button key={option} className={`focus-ring rounded-lg border p-3 text-left text-sm font-semibold ${answers[index] === option ? "border-brand bg-brand text-white" : "border-slate-200 bg-white/70 dark:border-white/10 dark:bg-white/5"}`} onClick={() => setAnswers({ ...answers, [index]: option })}>{option}</button>)}</div>
    </div>)}
    <div className="rounded-lg bg-ink p-4 text-white dark:bg-white dark:text-ink"><span className="font-display text-2xl font-extrabold">{score}/{questions.length}</span><span className="ml-3 text-sm">quiz checks passed</span></div>
  </div>;
}
