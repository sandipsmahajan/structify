import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import Link from "next/link";

export default async function LearnPage() {
  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        select: { id: true, title: true, slug: true },
      },
    },
  });

  const tierColors = [
    { accent: "cyan" as const, border: "border-bd-cyan/30", bg: "bg-bd-cyan-dim" },
    { accent: "violet" as const, border: "border-bd-violet/30", bg: "bg-bd-violet-dim" },
    { accent: "gold" as const, border: "border-bd-gold/30", bg: "bg-bd-gold-dim" },
    { accent: "emerald" as const, border: "border-bd-emerald/30", bg: "bg-bd-cyan-dim" },
  ];

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-cyan-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-cyan">
            Free Curriculum
          </span>
        </div>
        <h1 className="heading-display text-4xl mb-4">Learn DSA</h1>
        <p className="body-text max-w-xl mx-auto">
          Progressive tiers from complexity basics through linear structures.
          Every topic includes interactive 3D visualizers and theory.
        </p>
      </div>

      <div className="space-y-10">
        {courses.map((course) => {
          const tier = tierColors[course.tier] ?? tierColors[0];
          return (
            <section key={course.id}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`clip-diamond-sm px-3 py-1 text-xs font-bold uppercase tracking-wider ${tier.bg} text-bd-${tier.accent === "cyan" ? "cyan" : tier.accent === "violet" ? "violet" : tier.accent === "gold" ? "gold" : "cyan"}`}>
                  Tier {course.tier}
                </span>
                <h2 className="heading-display text-2xl">{course.title}</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {course.topics.map((topic, i) => (
                  <Link key={topic.id} href={`/learn/${course.slug}/${topic.slug}`}>
                    <DiamondCard glow className="p-5 h-full group cursor-pointer transition-colors duration-200 hover:border-bd-border-active">
                      <div className="flex items-start gap-3">
                        <span className={`w-8 h-8 clip-diamond-sm flex items-center justify-center text-xs font-bold shrink-0 ${tier.bg}`}>
                          {i + 1}
                        </span>
                        <div>
                          <h3 className="heading-section text-sm mb-1">{topic.title}</h3>
                          <p className="text-xs text-bd-text-muted">Theory + Visualizer</p>
                        </div>
                      </div>
                    </DiamondCard>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
