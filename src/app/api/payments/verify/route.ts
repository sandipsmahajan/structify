import { auth } from "@/lib/auth";
import { fetchPayment } from "@/lib/razorpay";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();

  const generated = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "")
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const payment = await fetchPayment(razorpay_payment_id);
  if (payment.status !== "captured" && payment.status !== "authorized") {
    return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: session.user.id },
      data: { isPaid: true, purchaseId: razorpay_payment_id },
    }),
    prisma.payment.create({
      data: {
        userId: session.user.id,
        amount: 4999,
        currency: "INR",
        provider: "razorpay",
        status: payment.status === "captured" ? "success" : "pending",
        purchasedAt: new Date(),
      },
    }),
  ]);

  return NextResponse.json({ success: true });
}
