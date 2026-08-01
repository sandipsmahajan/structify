import Link from "next/link";
import { Brain, ChartNoAxesCombined, Code2, GraduationCap, LayoutDashboard, Map, Newspaper, Search, ShieldCheck, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui";

const nav = [
  ["Dashboard", "/dashboard", LayoutDashboard],
  ["Roadmap", "/roadmap", Map],
  ["Big O", "/big-o-lab", ChartNoAxesCombined],
  ["Learn", "/learn/binary-search", GraduationCap],
  ["Practice", "/practice", Code2],
  ["Interview", "/interview", Trophy],
  ["Search", "/search", Search],
  ["Blog", "/blog", Newspaper],
  ["Admin", "/admin", ShieldCheck],
  ["Profile", "/profile", User]
] as const;

export function AppShell({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen grid-paper">
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/82 backdrop-blur-xl dark:border-white/10 dark:bg-ink/75">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-display text-xl font-extrabold"><span className="grid size-9 place-items-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink"><Brain size={20} /></span>Structify</Link>
        <div className="hidden items-center gap-1 lg:flex">{nav.map(([label, href, Icon]) => <Link key={href} href={href} className="focus-ring inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10"><Icon size={16} />{label}</Link>)}</div>
        <Button href="/login" variant="secondary">Sign in</Button>
      </nav>
    </header>
    <main>{children}</main>
  </div>;
}
