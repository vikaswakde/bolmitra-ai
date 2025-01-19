"use client";

import { useUser } from "@clerk/nextjs";
import { Paddle, initializePaddle } from "@paddle/paddle-js";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DynamicPaymentProps {
  userId: string;
}

const DynamicPayment = ({ userId }: DynamicPaymentProps) => {
  const [paddle, setPaddle] = useState<Paddle>();
  const [isLoading, setIsLoading] = useState(false);
  const { isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    console.log("Initializing Paddle with userId:", userId);
    if (!isSignedIn) {
      console.log("User not signed in, redirecting...");
      router.push("/sign-in");
      return;
    }

    initializePaddle({
      environment: "production",
      token: process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN!,
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

      if (!isSignedIn || !user) {
        router.push("/sign-in");
        return;
      }

      // Create user and initiate payment in one request
      const response = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          email: user.primaryEmailAddress?.emailAddress,
          fullName: user.fullName,
        }),
      });

      console.log("Payment API response status:", response.status);
      const data = await response.json();
      console.log("Payment API response data:", data);

      if (!response.ok) {
        throw new Error(data.error || "Payment creation failed");
      }

      await paddle.Checkout.open({
        transactionId: data.tnx,
        settings: {
          displayMode: "overlay",
          theme: "dark",
          successUrl: `https://bolmitra.live/`,
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
