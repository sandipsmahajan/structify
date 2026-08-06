import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface Props {
  params: Promise<{ courseSlug: string; topicSlug: string }>;
}

export default async function TopicPage({ params }: Props) {
  const { courseSlug, topicSlug } = await params;
  const session = await auth();
  const userId = session?.user?.id;

  const topic = await prisma.topic.findFirst({
    where: { slug: topicSlug },
    include: {
      course: true,
      problems: true,
    },
  });

  if (!topic || topic.course.slug !== courseSlug) notFound();

  if (topic.course.isPaid) {
    if (!userId) redirect("/auth/signin");
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { isPaid: true } });
    if (!user?.isPaid) redirect(`/paywall?slug=${topic.course.slug}`);
  }

  const paragraphs = (topic.theoryContent ?? "")
    .split("\n\n")
    .filter(Boolean);

  const visualizerMap: Record<string, string> = {
    array: "/visualize/array",
    "linked-list": "/visualize/linked-list",
    bst: "/visualize/bst",
    sorting: "/visualize/sorting",
    graph: "/visualize/graph",
  };

  const visualizerHref = topic.visualizerType
    ? visualizerMap[topic.visualizerType] ?? "/visualize"
    : "/visualize";

  return (
    <div className="pt-24 pb-16 px-6 max-w-4xl mx-auto min-h-screen">
      <Link
        href={`/learn/${courseSlug}`}
        className="text-xs text-bd-text-muted hover:text-bd-cyan mb-2 inline-block transition-colors"
      >
        &larr; Back to {topic.course.title}
      </Link>

      <h1 className="heading-display text-3xl sm:text-4xl mb-2">{topic.title}</h1>
      <p className="text-sm text-bd-text-muted mb-8">
        Tier {topic.course.tier} — {topic.course.title}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Theory */}
        <div className="lg:col-span-2 space-y-6">
          <DiamondCard glow className="p-6 sm:p-8">
            <div className="prose prose-invert max-w-none">
              {paragraphs.map((para, i) => {
                if (para.startsWith("# ")) {
                  return (
                    <h2 key={i} className="heading-display text-xl mb-4 mt-6 first:mt-0 text-bd-text-primary">
                      {para.replace("# ", "")}
                    </h2>
                  );
                }
                if (para.startsWith("## ")) {
                  return (
                    <h3 key={i} className="heading-section text-lg mb-3 mt-5 text-bd-cyan">
                      {para.replace("## ", "")}
                    </h3>
                  );
                }
                if (para.startsWith("### ")) {
                  return (
                    <h4 key={i} className="heading-section text-base mb-2 mt-4 text-bd-violet">
                      {para.replace("### ", "")}
                    </h4>
                  );
                }
                if (para.startsWith("|")) {
                  return (
                    <div key={i} className="overflow-x-auto my-4">
                      <table className="w-full text-sm border-collapse">
                        <tbody>
                          {para.split("\n").map((row, ri) => (
                            <tr key={ri} className={ri === 1 ? "border-b border-bd-border/40" : ""}>
                              {row.split("|").filter(Boolean).map((cell, ci) => (
                                ri === 0 ? (
                                  <th key={ci} className="text-left py-2 px-3 text-bd-cyan font-medium">{cell.trim()}</th>
                                ) : (
                                  <td key={ci} className="py-2 px-3 text-bd-text-secondary">{cell.trim()}</td>
                                )
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                if (para.startsWith("```")) {
                  return (
                    <div key={i} className="code-block p-4 my-3 text-xs text-bd-text-secondary overflow-x-auto">
                      <pre className="whitespace-pre-wrap font-mono">{para.replace(/^```\n?/, "").replace(/\n?```$/, "")}</pre>
                    </div>
                  );
                }
                if (para.startsWith("- ")) {
                  return (
                    <ul key={i} className="my-3 space-y-1">
                      {para.split("\n").map((item, ui) => (
                        <li key={ui} className="text-sm text-bd-text-secondary flex items-start gap-2">
                          <span className="text-bd-cyan mt-1.5 shrink-0">&#x25C6;</span>
                          <span>{item.replace(/^-\s*/, "")}</span>
                        </li>
                      ))}
                    </ul>
                  );
                }
                return (
                  <p key={i} className="body-text text-sm mb-3 leading-relaxed">
                    {para}
                  </p>
                );
              })}
            </div>
          </DiamondCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-cyan">Interactive Visualizer</h3>
            <p className="text-xs text-bd-text-secondary mb-4">
              See this data structure in action with the 3D visualizer.
            </p>
            <Link href={visualizerHref}>
              <DiamondButton variant="primary" size="sm" className="w-full justify-center">
                Open Visualizer
              </DiamondButton>
            </Link>
          </DiamondCard>

          <DiamondCard className="p-5">
            <h3 className="heading-section text-sm mb-3 text-bd-violet">Complexity</h3>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-bd-text-secondary">
                <span>Access</span>
                <span className="text-bd-cyan font-mono">O(1) ~ O(n)</span>
              </div>
              <div className="flex justify-between text-bd-text-secondary">
                <span>Search</span>
                <span className="text-bd-cyan font-mono">O(n) ~ O(log n)</span>
              </div>
              <div className="flex justify-between text-bd-text-secondary">
                <span>Insert</span>
                <span className="text-bd-violet font-mono">O(1) ~ O(n)</span>
              </div>
              <div className="flex justify-between text-bd-text-secondary">
                <span>Delete</span>
                <span className="text-bd-violet font-mono">O(1) ~ O(n)</span>
              </div>
            </div>
          </DiamondCard>

          {topic.problems.length > 0 && (
            <DiamondCard className="p-5">
              <h3 className="heading-section text-sm mb-3 text-bd-gold">Practice Problems</h3>
              <div className="space-y-2">
                {topic.problems.map((problem) => (
                  <div key={problem.id} className="flex items-center justify-between text-xs">
                    <span className="text-bd-text-secondary">{problem.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-bd-emerald/20 text-bd-emerald"
                          : problem.difficulty === "Medium"
                          ? "bg-bd-gold/20 text-bd-gold"
                          : "bg-bd-ruby/20 text-bd-ruby"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </DiamondCard>
          )}
        </div>
      </div>
    </div>
  );
}
