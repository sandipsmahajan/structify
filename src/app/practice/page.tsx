import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { SolveToggle } from "@/components/practice/solve-toggle";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PracticePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const courses = await prisma.course.findMany({
    orderBy: { order: "asc" },
    include: {
      topics: {
        orderBy: { order: "asc" },
        include: {
          problems: {
            orderBy: { difficulty: "asc" },
            include: userId
              ? { userStatus: { where: { userId }, select: { solved: true } } }
              : { userStatus: false as never },
          },
        },
      },
    },
  });

  if (!courses.length) notFound();

  const tierColors = [
    { accent: "cyan" as const, bg: "bg-bd-cyan-dim", text: "text-bd-cyan" },
    { accent: "violet" as const, bg: "bg-bd-violet-dim", text: "text-bd-violet" },
    { accent: "gold" as const, bg: "bg-bd-gold-dim", text: "text-bd-gold" },
    { accent: "emerald" as const, bg: "bg-bd-cyan-dim", text: "text-bd-emerald" },
  ];

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <div className="text-center mb-12">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-gold-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-gold">Practice</span>
        </div>
        <h1 className="heading-display text-4xl mb-4">Practice Problems</h1>
        <p className="body-text max-w-xl mx-auto">
          Curated problems from LeetCode, HackerRank, and NeetCode. Solve on the platform, then mark as solved here.
        </p>
      </div>

      {courses.map((course) => {
        const tier = tierColors[course.tier] ?? tierColors[0];
        return (
          <section key={course.id} className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className={`clip-diamond-sm px-3 py-1 text-xs font-bold uppercase tracking-wider ${tier.bg} ${tier.text}`}>
                Tier {course.tier}
              </span>
              <h2 className="heading-display text-xl">{course.title}</h2>
              {course.isPaid && <span className="text-[10px] text-bd-gold uppercase tracking-wider">Premium</span>}
            </div>

            {course.topics.map((topic) => (
              <div key={topic.id} className="mb-6">
                <h3 className="heading-section text-sm text-bd-text-secondary mb-3">
                  {topic.title}
                </h3>
                <div className="space-y-2">
                  {topic.problems.map((problem) => {
                    const isSolved = userId
                      ? problem.userStatus?.[0]?.solved ?? false
                      : false;
                    return (
                      <DiamondCard key={problem.id} className={`p-4 flex flex-wrap items-center justify-between gap-3 ${course.isPaid ? "opacity-60" : ""}`}>
                        <div className="flex items-center gap-3">
                          <span
                            className={`px-2 py-0.5 clip-diamond-sm text-[10px] font-bold uppercase ${
                              problem.difficulty === "Easy"
                                ? "bg-bd-emerald/20 text-bd-emerald"
                                : problem.difficulty === "Medium"
                                ? "bg-bd-gold/20 text-bd-gold"
                                : "bg-bd-ruby/20 text-bd-ruby"
                            }`}
                          >
                            {problem.difficulty}
                          </span>
                          <span className="text-sm text-bd-text-primary">{problem.title}</span>
                          {isSolved && (
                            <span className="text-[10px] text-bd-emerald font-semibold">Solved</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {problem.leetcodeUrl && (
                            <a href={problem.leetcodeUrl} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] px-2 py-1 bg-bd-raised border border-bd-border rounded text-bd-text-secondary hover:text-bd-cyan transition-colors">
                              LeetCode
                            </a>
                          )}
                          {problem.neetcodeUrl && (
                            <a href={problem.neetcodeUrl} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] px-2 py-1 bg-bd-raised border border-bd-border rounded text-bd-text-secondary hover:text-bd-violet transition-colors">
                              NeetCode
                            </a>
                          )}
                          {problem.hackerrankUrl && (
                            <a href={problem.hackerrankUrl} target="_blank" rel="noopener noreferrer"
                              className="text-[10px] px-2 py-1 bg-bd-raised border border-bd-border rounded text-bd-text-secondary hover:text-bd-emerald transition-colors">
                              HackerRank
                            </a>
                          )}
                          <SolveToggle problemId={problem.id} initialSolved={isSolved} />
                        </div>
                      </DiamondCard>
                    );
                  })}
                </div>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}
