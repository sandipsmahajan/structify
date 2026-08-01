import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getLesson(slug: string) {
  return import("./content").then(({ lessons }) => lessons.find((lesson) => lesson.slug === slug));
}
