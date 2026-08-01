import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Structify | Visual DSA Learning Platform",
  description: "Interactive data structures and algorithms learning with animations, code, quizzes, AI tutoring, and interview prep."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
