import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Button({ href, children, variant = "primary", className }: { href?: string; children: ReactNode; variant?: "primary" | "secondary" | "ghost"; className?: string }) {
  const classes = cn(
    "focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-bold transition",
    variant === "primary" && "bg-ink text-white hover:bg-slate-800 dark:bg-white dark:text-ink",
    variant === "secondary" && "border border-slate-300 bg-white/70 text-ink hover:bg-white dark:border-white/15 dark:bg-white/10 dark:text-white",
    variant === "ghost" && "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/10",
    className
  );
  if (href) return <Link className={classes} href={href}>{children}</Link>;
  return <button className={classes}>{children}</button>;
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("surface rounded-lg p-5", className)}>{children}</section>;
}

export function Kpi({ label, value, tone = "brand" }: { label: string; value: string; tone?: "brand" | "mint" | "amber" | "coral" }) {
  const color = { brand: "text-brand", mint: "text-mint", amber: "text-amber", coral: "text-coral" }[tone];
  return <Card><p className="text-sm text-slate-500 dark:text-slate-400">{label}</p><p className={cn("mt-2 font-display text-3xl font-extrabold", color)}>{value}</p></Card>;
}

export function Badge({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center rounded-full border border-slate-300/70 px-3 py-1 text-xs font-semibold text-slate-700 dark:border-white/15 dark:text-slate-200">{children}</span>;
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return <div className="max-w-3xl"><p className="text-sm font-extrabold uppercase tracking-[0.18em] text-brand">{eyebrow}</p><h2 className="mt-2 font-display text-3xl font-extrabold md:text-5xl">{title}</h2>{text && <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{text}</p>}</div>;
}
