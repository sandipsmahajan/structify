import { ArrowRight } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { blogPosts } from "@/lib/content";

export default function BlogPage() {
  return <AppShell><div className="mx-auto max-w-7xl px-4 py-10"><SectionTitle eyebrow="blog" title="Guides and interview notes" text="Technical articles, algorithm guides, and interview experiences stay connected to lessons and practice patterns." /><div className="mt-8 grid gap-4 md:grid-cols-3">{blogPosts.map((post) => <Card key={post.slug}><Badge>{post.category}</Badge><h2 className="mt-4 font-display text-2xl font-extrabold">{post.title}</h2><p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{post.excerpt}</p><div className="mt-5 flex items-center justify-between text-sm font-bold"><span>{post.minutes} min read</span><ArrowRight size={18} /></div></Card>)}</div></div></AppShell>;
}
