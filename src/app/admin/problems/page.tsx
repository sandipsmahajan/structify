import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminProblemsPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  const topics = await prisma.topic.findMany({
    orderBy: [{ courseId: "asc" }, { order: "asc" }],
    include: {
      course: { select: { title: true, tier: true } },
      problems: { orderBy: { difficulty: "asc" } },
    },
  });

  return (
    <div className="pt-24 pb-16 px-6 max-w-6xl mx-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="heading-display text-3xl mb-1">Admin: Problem Mappings</h1>
          <p className="text-sm text-bd-text-muted">Manage LeetCode / HackerRank / NeetCode URL mappings per topic.</p>
        </div>
        <Link href="/admin/problems/new">
          <DiamondButton variant="primary" size="sm">Add Problem</DiamondButton>
        </Link>
      </div>

      <div className="space-y-8">
        {topics.map((topic) => (
          <DiamondCard key={topic.id} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="heading-section text-base">{topic.title}</h3>
                <p className="text-xs text-bd-text-muted">
                  {topic.course.title} (Tier {topic.course.tier})
                </p>
              </div>
            </div>
            {topic.problems.length === 0 ? (
              <p className="text-xs text-bd-text-muted">No problems mapped yet.</p>
            ) : (
              <div className="space-y-2">
                {topic.problems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between p-3 bg-bd-raised rounded">
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        problem.difficulty === "Easy" ? "bg-bd-emerald/20 text-bd-emerald" :
                        problem.difficulty === "Medium" ? "bg-bd-gold/20 text-bd-gold" : "bg-bd-ruby/20 text-bd-ruby"
                      }`}>
                        {problem.difficulty}
                      </span>
                      <span className="text-sm">{problem.title}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-bd-text-muted">
                      {problem.leetcodeUrl && <span>LC</span>}
                      {problem.hackerrankUrl && <span>HR</span>}
                      {problem.neetcodeUrl && <span>NC</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </DiamondCard>
        ))}
      </div>
    </div>
  );
}
