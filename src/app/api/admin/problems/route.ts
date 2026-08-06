import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const problem = await prisma.problem.create({
    data: {
      topicId: body.topicId,
      title: body.title,
      difficulty: body.difficulty ?? "Easy",
      leetcodeUrl: body.leetcodeUrl || null,
      hackerrankUrl: body.hackerrankUrl || null,
      neetcodeUrl: body.neetcodeUrl || null,
    },
  });

  return NextResponse.json(problem, { status: 201 });
}
