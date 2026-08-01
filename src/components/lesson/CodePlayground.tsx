"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Play } from "lucide-react";
import type { CodeExamples } from "@/lib/types";
import { Badge } from "@/components/ui";

const Editor = dynamic(() => import("@monaco-editor/react"), { ssr: false });
const languages = ["JavaScript", "Python", "Java", "C++", "Go"] as const;

export function CodePlayground({ code, activeLine }: { code: CodeExamples; activeLine: number }) {
  const [language, setLanguage] = useState<(typeof languages)[number]>("JavaScript");
  const [output, setOutput] = useState("Run to see the synchronized dry run output.");
  return <div className="surface overflow-hidden rounded-lg">
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 p-3 dark:border-white/10">
      <div className="flex flex-wrap gap-2">{languages.map((item) => <button key={item} className={`focus-ring rounded-lg px-3 py-2 text-sm font-semibold ${item === language ? "bg-ink text-white dark:bg-white dark:text-ink" : "bg-slate-100 text-slate-600 dark:bg-white/10 dark:text-slate-300"}`} onClick={() => setLanguage(item)}>{item}</button>)}</div>
      <button className="focus-ring inline-flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-bold text-white" onClick={() => setOutput(`Line ${activeLine}: compared current midpoint and updated the visualization state.`)}><Play size={16} />Run</button>
    </div>
    <Editor height="360px" language={language === "C++" ? "cpp" : language.toLowerCase()} theme="vs-dark" value={code[language]} options={{ minimap: { enabled: false }, fontSize: 14, lineNumbers: "on", readOnly: false }} />
    <div className="border-t border-slate-200 p-4 dark:border-white/10"><Badge>Live output</Badge><p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{output}</p></div>
  </div>;
}
