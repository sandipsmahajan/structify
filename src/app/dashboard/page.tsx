import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return (
      <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
        <h1 className="heading-display text-3xl mb-6">Dashboard</h1>
        <DiamondCard className="p-8 text-center">
          <p className="text-bd-text-secondary mb-4">Sign in to track your progress, save solved problems, and unlock premium features.</p>
          <Link href="/auth/signin"><DiamondButton variant="primary" size="sm">Sign In</DiamondButton></Link>
        </DiamondCard>
      </div>
    );
  }

  const [user, solvedCount, allProblemsCount, courses, recentStatuses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { isPaid: true, createdAt: true, name: true, email: true, image: true },
    }),
    prisma.userProblemStatus.count({ where: { userId, solved: true } }),
    prisma.problem.count(),
    prisma.course.findMany({
      orderBy: { order: "asc" },
      include: {
        topics: {
          orderBy: { order: "asc" },
          include: {
            _count: { select: { problems: true } },
            progress: {
              where: { userId },
              select: { status: true },
            },
          },
        },
      },
    }),
    prisma.userProblemStatus.findMany({
      where: { userId, solved: true },
      orderBy: { solvedAt: "desc" },
      take: 5,
      include: { problem: { select: { title: true, difficulty: true } } },
    }),
  ]);

  const totalTopics = courses.reduce((sum, c) => sum + c.topics.length, 0);
  const startedTopics = courses.reduce(
    (sum, c) => sum + c.topics.filter((t) => t.progress.length > 0).length,
    0
  );
  const completedTopics = courses.reduce(
    (sum, c) =>
      sum +
      c.topics.filter((t) => t.progress.some((p) => p.status === "completed")).length,
    0
  );

  const percentComplete =
    allProblemsCount > 0 ? Math.round((solvedCount / allProblemsCount) * 100) : 0;

  return (
    <div className="pt-24 pb-16 px-6 max-w-5xl mx-auto min-h-screen">
      <h1 className="heading-display text-3xl mb-10">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
        <DiamondCard glow className="p-5 text-center">
          <div className="heading-display text-3xl text-bd-cyan mb-1">{solvedCount}</div>
          <div className="text-xs text-bd-text-muted">Problems Solved</div>
        </DiamondCard>
        <DiamondCard glow className="p-5 text-center">
          <div className="heading-display text-3xl text-bd-violet mb-1">{startedTopics}</div>
          <div className="text-xs text-bd-text-muted">Topics Started</div>
        </DiamondCard>
        <DiamondCard glow className="p-5 text-center">
          <div className="heading-display text-3xl text-bd-gold mb-1">{completedTopics}</div>
          <div className="text-xs text-bd-text-muted">Topics Completed</div>
        </DiamondCard>
        <DiamondCard glow className="p-5 text-center">
          <div className="heading-display text-3xl text-bd-emerald mb-1">{percentComplete}%</div>
          <div className="text-xs text-bd-text-muted">Overall Progress</div>
        </DiamondCard>
      </div>

      {/* Progress bar */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-bd-text-secondary">Course Progress</span>
          <span className="text-xs text-bd-text-muted">{totalTopics} topics total</span>
        </div>
        <div className="h-2 bg-bd-raised rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-bd-cyan via-bd-violet to-bd-gold transition-all duration-700"
            style={{ width: `${totalTopics > 0 ? Math.round((startedTopics / totalTopics) * 100) : 0}%` }}
          />
        </div>
      </div>

      {/* Course breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {courses.map((course) => {
          const courseTotal = course.topics.length;
          const courseStarted = course.topics.filter((t) => t.progress.length > 0).length;
          const pct = courseTotal > 0 ? Math.round((courseStarted / courseTotal) * 100) : 0;
          return (
            <DiamondCard key={course.id} className="p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="heading-section text-sm">{course.title}</h3>
                <span className="text-[10px] text-bd-text-muted">
                  {courseStarted}/{courseTotal}
                </span>
              </div>
              <div className="h-1.5 bg-bd-raised rounded-full overflow-hidden">
                <div
                  className="h-full bg-bd-cyan transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </DiamondCard>
          );
        })}
      </div>

      {/* Recent solves */}
      {recentStatuses.length > 0 && (
        <div>
          <h2 className="heading-section text-lg mb-4">Recently Solved</h2>
          <DiamondCard className="p-5">
            <div className="space-y-2">
              {recentStatuses.map((s) => (
                <div key={s.id} className="flex items-center justify-between text-sm">
                  <span className="text-bd-text-secondary">{s.problem.title}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    s.problem.difficulty === "Easy" ? "bg-bd-emerald/20 text-bd-emerald" :
                    s.problem.difficulty === "Medium" ? "bg-bd-gold/20 text-bd-gold" : "bg-bd-ruby/20 text-bd-ruby"
                  }`}>
                    {s.problem.difficulty}
                  </span>
                </div>
              ))}
            </div>
          </DiamondCard>
        </div>
      )}

      {/* Quick links */}
      <div className="mt-12 flex flex-wrap gap-3">
        <Link href="/learn"><DiamondButton variant="primary" size="sm">Continue Learning</DiamondButton></Link>
        <Link href="/practice"><DiamondButton variant="secondary" size="sm">Practice Problems</DiamondButton></Link>
        {!user?.isPaid && (
          <Link href="/pricing"><DiamondButton variant="gold" size="sm">Upgrade to Pro</DiamondButton></Link>
        )}
      </div>
    </div>
  );
}
