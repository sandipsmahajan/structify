import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Structify — Master DSA with Interactive Visualizations",
  description:
    "Learn Data Structures & Algorithms through interactive visualizations, real-world scenarios, and guided interview preparation.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "visualizer",
    "learn DSA",
    "coding interview",
    "interactive learning",
  ],
  openGraph: {
    title: "Structify — Master DSA with Interactive Visualizations",
    description:
      "Interactive visualizers for every major DSA topic. Learn, Visualize, Practice, Apply.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col">
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
