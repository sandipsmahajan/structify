import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DiamondCard } from "@/components/ui/diamond-card";
import { DiamondButton } from "@/components/ui/diamond-button";
import { CheckoutButton } from "@/components/payment/checkout-button";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function PaywallPage({
  searchParams,
}: {
  searchParams: Promise<{ slug?: string }>;
}) {
  const { slug } = await searchParams;
  const session = await auth();

  let courseTitle = "Premium Content";
  if (slug) {
    const course = await prisma.course.findUnique({ where: { slug } });
    if (course) courseTitle = course.title;
    else notFound();
  }

  const isPaid = await prisma.user.findUnique({
    where: { id: session?.user?.id ?? "" },
    select: { isPaid: true },
  });

  if (isPaid?.isPaid) {
    return (
      <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto min-h-screen text-center flex flex-col items-center justify-center">
        <DiamondCard glow className="p-8">
          <h1 className="heading-display text-2xl mb-4 text-bd-emerald">Access Granted</h1>
          <p className="body-text mb-6">You have lifetime access. Return to the curriculum.</p>
          <Link href="/learn"><DiamondButton variant="primary" size="md">Go to Learn</DiamondButton></Link>
        </DiamondCard>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 px-6 max-w-2xl mx-auto min-h-screen text-center flex flex-col items-center justify-center">
      <DiamondCard animatedGlow className="p-8 sm:p-12">
        <div className="clip-diamond-sm inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-bd-gold-dim">
          <span className="text-xs font-semibold uppercase tracking-widest text-bd-gold">Premium</span>
        </div>
        <h1 className="heading-display text-3xl sm:text-4xl mb-4">
          Unlock {courseTitle}
        </h1>
        <p className="body-text mb-8 max-w-md mx-auto">
          Tier 2-4 content requires a one-time lifetime purchase. Get access to all visualizers,
          problem sets, mock interviews, and future features forever.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <CheckoutButton />
          <Link href="/learn">
            <DiamondButton variant="ghost" size="lg">
              Back to Free Tiers
            </DiamondButton>
          </Link>
        </div>
      </DiamondCard>
    </div>
  );
}
