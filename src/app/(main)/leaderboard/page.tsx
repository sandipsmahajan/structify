import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { DiamondCard } from "@/components/ui/diamond-card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  const session = await auth();
  const currentUserId = session?.user?.id;

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      isPaid: true,
      _count: {
        select: { problemStatus: { where: { solved: true } } },
      },
    },
    orderBy: { problemStatus: { _count: "desc" } },
    where: {
      problemStatus: { some: { solved: true } },
    },
    take: 50,
  });

  const easyCount = await prisma.problem.count({ where: { difficulty: "Easy" } });
  const mediumCount = await prisma.problem.count({ where: { difficulty: "Medium" } });
  const hardCount = await prisma.problem.count({ where: { difficulty: "Hard" } });
  const totalProblems = easyCount + mediumCount + hardCount;

  const currentUser = currentUserId
    ? await prisma.user.findUnique({
        where: { id: currentUserId },
        select: {
          _count: { select: { problemStatus: { where: { solved: true } } } },
        },
      })
    : null;

  return (
    <div className="pt-24 pb-16 px-6 max-w-3xl mx-auto min-h-screen">
      <div className="text-center mb-10">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-gold-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-gold">Leaderboard</span>
        </div>
        <h1 className="heading-display text-3xl mb-3">Top Problem Solvers</h1>
        <p className="body-text text-sm max-w-md mx-auto mb-4">
          Ranking by total problems solved across all tiers.
        </p>
        <div className="flex justify-center gap-4 text-xs text-bd-text-muted">
          <span>{totalProblems} total problems</span>
          <span className="text-bd-emerald">{easyCount} Easy</span>
          <span className="text-bd-gold">{mediumCount} Medium</span>
          <span className="text-bd-ruby">{hardCount} Hard</span>
        </div>
      </div>

      {currentUser && (
        <DiamondCard className="p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm text-bd-text-secondary">Your rank:</span>
            <span className="heading-display text-lg text-bd-cyan">
              {currentUser._count.problemStatus} solved
            </span>
          </div>
          <Link href="/practice" className="text-xs text-bd-cyan hover:text-bd-violet transition-colors">
            Solve More
          </Link>
        </DiamondCard>
      )}

      {users.length === 0 ? (
        <DiamondCard className="p-8 text-center">
          <p className="text-sm text-bd-text-muted">No solved problems yet. Be the first!</p>
        </DiamondCard>
      ) : (
        <DiamondCard className="overflow-hidden">
          <div className="divide-y divide-bd-border/20">
            {users.map((user, i) => {
              const isCurrentUser = user.id === currentUserId;
              return (
                <div
                  key={user.id}
                  className={`flex items-center gap-4 p-4 transition-colors ${isCurrentUser ? "bg-bd-cyan-dim/30" : ""}`}
                >
                  <span
                    className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-full shrink-0 ${
                      i === 0
                        ? "bg-bd-gold/20 text-bd-gold"
                        : i === 1
                        ? "bg-bd-text-muted/20 text-bd-text-muted"
                        : i === 2
                        ? "bg-bd-ruby/20 text-bd-ruby"
                        : "text-bd-text-muted"
                    }`}
                  >
                    {i + 1}
                  </span>

                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name ?? ""}
                      className="w-8 h-8 rounded-full border border-bd-border"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-bd-violet-dim flex items-center justify-center text-bd-violet text-sm font-bold border border-bd-border">
                      {(user.name ?? "U")[0].toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-bd-text-primary truncate">
                        {user.name ?? "Anonymous"}
                      </span>
                      {isCurrentUser && (
                        <span className="text-[10px] text-bd-cyan font-semibold">You</span>
                      )}
                      {user.isPaid && (
                        <span className="text-[10px] text-bd-gold">Pro</span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-bd-text-primary tabular-nums">
                      {user._count.problemStatus}
                    </div>
                    <div className="text-[10px] text-bd-text-muted">solved</div>
                  </div>
                </div>
              );
            })}
          </div>
        </DiamondCard>
      )}
    </div>
  );
}
