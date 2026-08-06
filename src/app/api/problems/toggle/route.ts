import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { problemId, solved } = await req.json();

  const exists = await prisma.userProblemStatus.findUnique({
    where: { userId_problemId: { userId: session.user.id, problemId } },
  });

  if (exists) {
    await prisma.userProblemStatus.update({
      where: { userId_problemId: { userId: session.user.id, problemId } },
      data: { solved, solvedAt: solved ? new Date() : null },
    });
  } else {
    await prisma.userProblemStatus.create({
      data: {
        userId: session.user.id,
        problemId,
        solved,
        solvedAt: solved ? new Date() : null,
      },
    });
  }

  return NextResponse.json({ success: true });
}
