import Link from "next/link";

export default function NotFound() {
  return (
    <div className="pt-24 pb-16 px-6 max-w-lg mx-auto min-h-screen text-center">
      <h1 className="heading-display text-4xl mb-4">404</h1>
      <p className="text-bd-text-secondary mb-6">This page doesn't exist.</p>
      <Link href="/learn" className="text-bd-cyan hover:text-bd-cyan/80 text-sm">Back to Learn</Link>
    </div>
  );
}
