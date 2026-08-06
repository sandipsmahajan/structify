import { auth } from "@/lib/auth";
import { createOrder } from "@/lib/razorpay";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const STARS_AMOUNT = 499900;

  const order = await createOrder({
    amount: STARS_AMOUNT,
    currency: "INR",
    receipt: `rcpt_${session.user.id}_${Date.now()}`,
    notes: { userId: session.user.id },
  });

  return NextResponse.json({
    orderId: order.id,
    amount: STARS_AMOUNT,
    currency: "INR",
    keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
  });
}
