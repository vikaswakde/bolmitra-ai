"use client";
import { ArrowRight, CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const Pricing = () => {
  const [currency, setCurrency] = useState<"USD" | "INR">("USD");

  const convertPrice = (usdPrice: string) => {
    const price = parseFloat(usdPrice);
    return currency === "USD" ? price : Math.round(price * 83); // Using 83 as conversion rate
  };

  const formatPrice = (price: number) => {
    return currency === "USD"
      ? `$${price}`
      : `₹${price.toLocaleString("en-IN")}`;
  };

  const plans = [
    {
      name: "Free Tier",
      price: "0",
      description: "Access to 1 category and 2 questions only.",
      items: ["Basic feedback analysis", "Simple progress tracking"],
      id: "free",
      paymentLink: "/sign-up",
    },
    {
      name: "Pro Tier",
      price: "5",
      description: "Unlimited access to all categories and questions.",
      items: [
        "Advanced feedback analysis",
        "Detailed metrics and insights",
        "Priority processing",
        "Social sharing features",
        "Custom practice sessions",
      ],
      id: "pro",
      paymentLink: "https://rzp.io/rzp/2bnvZMY",
    },
  ];

  return (
    <section className="relative overflow-hidden" id="pricing">
      <div className="py-12 lg:py-24 max-w-5xl mx-auto px-12 lg:px-0">
        <div className="flex flex-col items-center justify-center w-full pb-6 pt-3">
          <h2 className="uppercase font-bold text-xl mb-4 text-purple-600">
            Pricing Plans
          </h2>

          {/* Currency Toggle */}
          <div className="flex items-center gap-2 p-2 bg-gray-100 rounded-full mb-8">
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "px-4 py-2 rounded-full transition-all",
                currency === "USD"
                  ? " bg-green-400 shadow-md hover:bg-green-300"
                  : "hover:bg-gray-200 bg-white/80"
              )}
            >
              USD
            </button>
            <button
              onClick={() => setCurrency("INR")}
              className={cn(
                "px-4 py-2 rounded-full transition-all",
                currency === "INR"
                  ? " shadow-md bg-green-400 hover:bg-green-300"
                  : "hover:bg-gray-200 bg-white/80"
              )}
            >
              INR
            </button>
          </div>
        </div>

        <div className="relative flex flex-col justify-center lg:flex-row items-center lg:items-stretch gap-8">
          {plans.map(
            ({ name, price, description, items, id, paymentLink }, idx) => (
              <div className="relative w-full max-w-lg" key={idx}>
                <div
                  className={cn(
                    "relative flex flex-col h-full gap-4 lg:gap-8 z-10 p-8 border-[1px] border-gray-500/20 rounded-2xl",
                    id === "pro" && "border-violet-500 gap-5 border-2"
                  )}
                >
                  <div className="flex flex-col justify-center items-start gap-4">
                    <div>
                      <p className="font-bold text-lg lg:text-xl capitalize">
                        {name}
                      </p>
                      <p className="text-base/80 mt-2">{description}</p>
                    </div>
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currency}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex gap-2"
                      >
                        <p className="text-5xl tracking-tight font-extrabold">
                          {formatPrice(convertPrice(price))}
                        </p>
                        <div className="flex flex-col justify-end mb-[4px]">
                          <p className="text-sm text-base-content/60 uppercase font-semibold">
                            {currency}
                          </p>
                          <p className="text-xs text-base-content/60">/month</p>
                        </div>
                      </motion.div>
                    </AnimatePresence>

                    <ul className="space-y-2.5 leading-relaxed text-base flex-1">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckIcon size={18} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="space-y-2">
                      <Button
                        variant="link"
                        className={cn(
                          "border-2 rounded-full bg-black text-gray-100",
                          id === "pro" && "padding-2 border-amber-200"
                        )}
                      >
                        <Link
                          href={paymentLink}
                          className="flex gap-1 items-center"
                        >
                          Get Started
                          <ArrowRight
                            size={22}
                            className="animate-pulse transition-colors ml-1"
                          />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
