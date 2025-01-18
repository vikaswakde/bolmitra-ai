"use client";

import {
  CheckoutEventNames,
  Paddle,
  initializePaddle,
} from "@paddle/paddle-js";
import React, { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

interface DynamicPaymentProps {
  userId: string;
}

const DynamicPayment = ({ userId }: DynamicPaymentProps) => {
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    console.log("Initializing Paddle with userId:", userId);
    if (!isSignedIn) {
      console.log("User not signed in, redirecting...");
      router.push("/sign-in");
      return;
    }

    initializePaddle({
      environment: "sandbox",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
      eventCallback: async (event) => {
        console.log("Paddle event received:", event.name, event.data);
        if (event.name === CheckoutEventNames.CHECKOUT_COMPLETED) {
          await fetch("/api/subscription/activate", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              transactionId: event.data?.transaction_id,
            }),
          });

          router.push("/success");
        }
      },
    })
      .then((paddle) => {
        console.log("Paddle initialized successfully");
        setPaddle(paddle);
      })
      .catch((error) => {
        console.error("Paddle initialization error:", error);
      });
  }, [userId, isSignedIn, router]);

  const handleCheckout = async () => {
    console.log("Starting checkout process...");
    setIsLoading(true);

    try {
      if (!paddle) {
        throw new Error("Payment system not initialized");
      }

      if (!isSignedIn) {
        router.push("/sign-in");
        return;
      }

      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      console.log("Payment API response status:", response.status);
      const data = await response.json();
      console.log("Payment API response data:", data);

      if (!response.ok)
        throw new Error(data.error || "Payment creation failed");

      await paddle.Checkout.open({
        transactionId: data.tnx,
        settings: {
          displayMode: "overlay",
          theme: "dark",
          successUrl: `https://5e78-2409-4042-2d98-a90d-c864-6958-f3b2-af69.ngrok-free.app/success`,
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to initialize checkout. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center justify-center gap-2 ${
        isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
      }`}
      onClick={!isLoading ? handleCheckout : undefined}
    >
      {isLoading ? "Processing..." : "Upgrade Now"}
      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
    </div>
  );
};

export default DynamicPayment;
