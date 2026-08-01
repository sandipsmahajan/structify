import { notFound } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { LessonExperience } from "@/components/lesson/LessonExperience";
import { lessons } from "@/lib/content";

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = lessons.find((item) => item.slug === slug);
  if (!lesson) notFound();
  return <AppShell><LessonExperience lesson={lesson} /></AppShell>;
}
