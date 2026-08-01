import { create } from "zustand";

type LearningState = {
  xp: number;
  coins: number;
  streak: number;
  completedLessons: string[];
  bookmarks: string[];
  completeLesson: (slug: string, xp: number) => void;
  toggleBookmark: (slug: string) => void;
};

export const useLearningStore = create<LearningState>((set) => ({
  xp: 8420,
  coins: 1260,
  streak: 14,
  completedLessons: ["programming-basics", "big-o-analysis"],
  bookmarks: ["binary-search"],
  completeLesson: (slug, xp) => set((state) => ({ completedLessons: Array.from(new Set([...state.completedLessons, slug])), xp: state.xp + xp, coins: state.coins + 25 })),
  toggleBookmark: (slug) => set((state) => ({ bookmarks: state.bookmarks.includes(slug) ? state.bookmarks.filter((item) => item !== slug) : [...state.bookmarks, slug] }))
}));
