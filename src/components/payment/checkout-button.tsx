"use client";

import { useState, useCallback } from "react";
import { DiamondButton } from "@/components/ui/diamond-button";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: { name?: string; email?: string };
  theme?: { color: string };
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
}

interface RazorpayInstance {
  open: () => void;
}

export function CheckoutButton({ label, className }: { label?: string; className?: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const loadScript = useCallback(() => {
    return new Promise<boolean>((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  }, []);

  const checkout = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadScript();
      if (!scriptLoaded) {
        alert("Failed to load Razorpay. Please try again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/payments/create-order", { method: "POST" });
      if (!res.ok) throw new Error("Failed to create order");
      const { orderId, amount, keyId } = await res.json();

      const razorpay = new window.Razorpay({
        key: keyId,
        amount,
        currency: "INR",
        name: "Structify",
        description: "Lifetime Access",
        order_id: orderId,
        prefill: {
          name: session.user?.name ?? "",
          email: session.user?.email ?? "",
        },
        theme: { color: "#6FE3FF" },
        handler: async (response) => {
          const verify = await fetch("/api/payments/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const data = await verify.json();
          if (data.success) {
            router.push("/learn");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
      });

      razorpay.open();
    } catch (err) {
      console.error("Checkout error:", err);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <DiamondButton variant="gold" size="lg" onClick={checkout} disabled={loading} className={className}>
      {loading ? "Processing..." : label ?? "Buy Lifetime — \u20B94,999"}
    </DiamondButton>
  );
}
