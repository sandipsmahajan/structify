import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseSlug: string }>;
}

export default async function CoursePage({ params }: Props) {
  const { courseSlug } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: {
      topics: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!course) notFound();

  if (course.isPaid) {
    if (!userId) redirect("/auth/signin");
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isPaid: true } });
    if (!user?.isPaid) redirect(`/paywall?slug=${course.slug}`);
  }

  const tierColors = [
    { accent: "cyan" as const, border: "border-bd-cyan/30", bg: "bg-bd-cyan-dim" },
    { accent: "violet" as const, border: "border-bd-violet/30", bg: "bg-bd-violet-dim" },
    { accent: "gold" as const, border: "border-bd-gold/30", bg: "bg-bd-gold-dim" },
    { accent: "emerald" as const, border: "border-bd-emerald/30", bg: "bg-bd-cyan-dim" },
  ];
  const tier = tierColors[course.tier] ?? tierColors[0];

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto min-h-screen">
      <Link href="/learn" className="text-xs text-bd-text-muted hover:text-bd-cyan mb-4 inline-block transition-colors">
        &larr; Back to Curriculum
      </Link>

      <div className="flex items-center gap-3 mb-8">
        <span className={`clip-diamond-sm px-3 py-1 text-xs font-bold uppercase tracking-wider ${tier.bg} text-bd-cyan`}>
          Tier {course.tier}
        </span>
        <h1 className="heading-display text-3xl">{course.title}</h1>
        {course.isPaid && <span className="text-[10px] text-bd-gold uppercase tracking-wider">Premium</span>}
      </div>

      <div className="space-y-3">
        {course.topics.map((topic, i) => (
          <Link key={topic.id} href={`/learn/${course.slug}/${topic.slug}`}>
            <DiamondCard glow className="p-5 flex items-center gap-4 group cursor-pointer transition-colors duration-200 hover:border-bd-border-active">
              <span className={`w-10 h-10 clip-diamond-sm flex items-center justify-center text-sm font-bold shrink-0 ${tier.bg}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <h3 className="heading-section text-base">{topic.title}</h3>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bd-text-muted group-hover:text-bd-cyan transition-colors">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </DiamondCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
