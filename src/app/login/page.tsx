import { Brain } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Button, Card } from "@/components/ui";

export default function LoginPage() {
  return <AppShell><div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl place-items-center px-4 py-10"><Card className="w-full max-w-md"><div className="grid size-12 place-items-center rounded-lg bg-ink text-white dark:bg-white dark:text-ink"><Brain /></div><h1 className="mt-5 font-display text-3xl font-extrabold">Sign in to Structify</h1><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">JWT-ready authentication surface for learner, mentor, and admin roles.</p><form className="mt-6 space-y-4"><input className="focus-ring h-12 w-full rounded-lg border border-slate-300 bg-white px-4 dark:border-white/10 dark:bg-white/10" placeholder="Email" type="email" /><input className="focus-ring h-12 w-full rounded-lg border border-slate-300 bg-white px-4 dark:border-white/10 dark:bg-white/10" placeholder="Password" type="password" /><Button href="/dashboard" className="w-full">Continue</Button></form></Card></div></AppShell>;
}
