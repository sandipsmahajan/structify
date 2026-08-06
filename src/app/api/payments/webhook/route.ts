import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: Request) {
  const signature = req.headers.get("x-razorpay-signature");
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? "";

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const body = await req.text();

  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "payment.captured") {
    const payment = event.payload.payment.entity;
    const userId = payment.notes?.userId;

    if (userId) {
      await prisma.$transaction([
        prisma.user.update({
          where: { id: userId },
          data: { isPaid: true, purchaseId: payment.id },
        }),
        prisma.payment.create({
          data: {
            userId,
            amount: 4999,
            currency: "INR",
            provider: "razorpay",
            status: "success",
            purchasedAt: new Date(),
          },
        }),
      ]);
    }
  }

  return NextResponse.json({ received: true });
}
