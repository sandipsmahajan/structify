import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Navbar } from "@/components/layout/navbar";
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
  title: "Structify — Master DSA with 3D Visualizations",
  description:
    "Learn Data Structures & Algorithms through interactive 3D visualizers. Animated theory, live simulations, and curated practice problems — all in a premium Black Diamond experience.",
  keywords: [
    "DSA",
    "data structures",
    "algorithms",
    "3D visualizer",
    "learn DSA",
    "coding interview",
    "interactive learning",
  ],
  openGraph: {
    title: "Structify — Master DSA with 3D Visualizations",
    description:
      "Interactive 3D visualizers for every major DSA topic. Learn, Visualize, Practice, Apply.",
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
    >
      <body className="min-h-full flex flex-col bg-bd-bg text-bd-text-primary">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
