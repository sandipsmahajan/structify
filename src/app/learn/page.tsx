import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function LearnPage() {
  const session = await auth();
  const userId = session?.user?.id;

  let isPaid = false;
  if (userId) {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isPaid: true } });
    isPaid = user?.isPaid ?? false;
  }

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          ...(userId
            ? {
                progress: {
                  where: { userId },
                  select: { status: true },
                },
              }
            : {}),
        },
      },
    },
  });

  const tierColors = [
    { accent: "cyan" as const, border: "border-bd-cyan/30", bg: "bg-bd-cyan-dim", bar: "from-bd-cyan to-bd-cyan/50" },
    { accent: "violet" as const, border: "border-bd-violet/30", bg: "bg-bd-violet-dim", bar: "from-bd-violet to-bd-cyan" },
    { accent: "gold" as const, border: "border-bd-gold/30", bg: "bg-bd-gold-dim", bar: "from-bd-gold to-bd-violet" },
    { accent: "emerald" as const, border: "border-bd-emerald/30", bg: "bg-bd-cyan-dim", bar: "from-bd-emerald to-bd-cyan" },
  ];

  const tierAccentText = (accent: string) =>
    accent === "cyan" ? "text-bd-cyan" : accent === "violet" ? "text-bd-violet" : accent === "gold" ? "text-bd-gold" : "text-bd-cyan";

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-cyan-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">
            Curriculum
          </span>
        </div>
        <h1 className="heading-display text-4xl mb-4">Learn DSA</h1>
        <p className="body-text max-w-xl mx-auto">
          Progressive tiers from complexity basics through advanced algorithms.
          Every topic includes interactive 3D visualizers and theory.
        </p>
      </div>

      <div className="space-y-10">
        {courses.map((course) => {
          const tier = tierColors[course.tier] ?? tierColors[0];
          const locked = course.isPaid && !isPaid;
          const href = locked
            ? `/paywall?slug=${course.slug}`
            : `/learn/${course.slug}`;

          const total = course.topics.length;
          const started = userId
            ? course.topics.filter((t) => (t as { progress?: { status: string }[] }).progress?.length ?? 0 > 0).length
            : 0;
          const completed = userId
            ? course.topics.filter(
                (t) =>
                  (t as { progress?: { status: string }[] }).progress?.some(
                    (p) => p.status === "completed"
                  )
              ).length
            : 0;
          const pct = total > 0 ? Math.round((started / total) * 100) : 0;

          return (
            <section key={course.id}>
              <div className="flex items-center gap-3 mb-2">
                <span className={`clip-diamond-sm px-3 py-1 text-xs font-bold uppercase tracking-wider ${tier.bg} ${tierAccentText(tier.accent)}`}>
                  Tier {course.tier}
                </span>
                <h2 className="heading-display text-2xl">{course.title}</h2>
                {course.isPaid && (
                  <span className={`text-[10px] uppercase tracking-wider ${isPaid ? "text-bd-emerald" : "text-bd-gold"}`}>
                    {isPaid ? "Unlocked" : "Premium"}
                  </span>
                )}
              </div>

              {userId && total > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-bd-text-muted">
                      {completed} completed, {started} started of {total}
                    </span>
                    <span className="text-xs text-bd-text-muted">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-bd-raised rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${tier.bar} transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.topics.map((topic, i) => {
                  const topicProgress = userId
                    ? ((topic as { progress?: { status: string }[] }).progress ?? [])
                    : [];
                  const isCompleted = topicProgress.some((p: { status: string }) => p.status === "completed");

                  return (
                    <Link key={topic.id} href={locked ? href : `${href}/${topic.slug}`}>
                      <DiamondCard glow className="p-5 h-full group cursor-pointer transition-colors duration-200 hover:border-bd-border-active relative">
                        <div className="flex items-start gap-3">
                          <span className={`w-8 h-8 clip-diamond-sm flex items-center justify-center text-xs font-bold shrink-0 ${isCompleted ? "bg-bd-emerald/20 text-bd-emerald" : tier.bg}`}>
                            {isCompleted ? (
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              i + 1
                            )}
                          </span>
                          <div>
                            <h3 className="heading-section text-sm mb-1">{topic.title}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-xs text-bd-text-muted">
                                {isCompleted ? "Completed" : topicProgress.length > 0 ? "In Progress" : "Theory + Visualizer"}
                              </p>
                              {locked && (
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-bd-gold shrink-0">
                                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                  <path d="M7 11V7a5 5 0 0110 0v4" />
                                </svg>
                              )}
                            </div>
                          </div>
                        </div>
                      </DiamondCard>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
