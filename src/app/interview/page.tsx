import { InterviewSession } from "@/components/interview/interview-session";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function InterviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin");

  return (
    <div className="pt-24 pb-16 px-6 min-h-screen">
      <InterviewSession />
    </div>
  );
}
