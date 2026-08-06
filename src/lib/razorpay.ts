import type Razorpay from "razorpay";

let RazorpayClass: typeof Razorpay | null = null;

async function getRazorpay() {
  if (!RazorpayClass) {
    const mod = await import("razorpay");
    RazorpayClass = mod.default;
  }
  return new RazorpayClass({
    key_id: process.env.RAZORPAY_KEY_ID ?? "",
    key_secret: process.env.RAZORPAY_KEY_SECRET ?? "",
  });
}

export async function createOrder(options: { amount: number; currency: string; receipt: string; notes: Record<string, string> }) {
  const rzp = await getRazorpay();
  return rzp.orders.create(options);
}

export async function fetchPayment(paymentId: string) {
  const rzp = await getRazorpay();
  return rzp.payments.fetch(paymentId);
}
