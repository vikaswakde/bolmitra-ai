"use client";
import { motion } from "framer-motion";
import { Check, ArrowRight, Sparkles, Zap, Shield, Clock } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useState } from "react";

const features = {
  free: [
    "1 category access",
    "3 questions per day",
    "Basic feedback analysis",
    "Simple progress tracking",
  ],
  pro: [
    "Full category access",
    "Unlimited questions",
    "Advanced feedback analysis",
    "Detailed metrics & insights",
    "Priority processing",
    "Custom practice sessions",
    "Progress analytics dashboard",
    "Email support",
  ],
};

const PricingCard = ({
  tier,
  price,
  features,
  popular,
}: {
  tier: string;
  price: string;
  features: string[];
  popular?: boolean;
}) => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayFeatures = showAllFeatures ? features : features.slice(0, 4);
  const hasMoreFeatures = features.length > 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`relative rounded-2xl ${
        popular
          ? "border-2 border-purple-500 bg-white"
          : "border border-purple-100 bg-white/50"
      } p-8 shadow-xl`}
    >
      {popular && (
        <div className="absolute -top-5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full">
          <p className="text-sm font-medium text-white">Most Popular</p>
        </div>
      )}

      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">{tier}</h3>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-bold">{price}</span>
          {price !== "Free" && <span className="text-gray-600">/month</span>}
        </div>
      </div>

      <ul className="space-y-4 mb-8">
        {displayFeatures.map((feature, index) => (
          <motion.li
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-center gap-3"
          >
            <div
              className={`p-1 rounded-full ${
                popular ? "bg-purple-100" : "bg-gray-100"
              }`}
            >
              <Check
                className={`w-4 h-4 ${
                  popular ? "text-purple-600" : "text-gray-600"
                }`}
              />
            </div>
            <span className="text-gray-600">{feature}</span>
          </motion.li>
        ))}
      </ul>

      {hasMoreFeatures && (
        <Button
          variant={"outline"}
          onClick={() => setShowAllFeatures(!showAllFeatures)}
          className="w-full text-sm text-purple-600  hover:text-purple-700 font-medium mb-6"
        >
          {showAllFeatures
            ? "Show Less"
            : `+${features.length - 4} More Features`}
        </Button>
      )}

      <Button
        size="lg"
        className={`w-full rounded-xl ${
          popular
            ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white"
            : "bg-gray-50 hover:bg-gray-100 text-gray-800"
        } group`}
      >
        {tier === "Free" ? (
          <Link
            href="/sign-up"
            className="flex items-center justify-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        ) : (
          <Link
            href="/api/payment"
            className="flex items-center justify-center gap-2"
          >
            Upgrade Now
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
      </Button>
    </motion.div>
  );
};

const Pricing = () => {
  const [isUSD, setIsUSD] = useState(true);

  return (
    <section className="py-24 relative overflow-hidden" id="pricing">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white pointer-events-none" />
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-96 h-96 bg-purple-200/50 rounded-full blur-3xl" />
      <div className="absolute top-1/2 -translate-y-1/2 right-0 w-96 h-96 bg-indigo-200/50 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Simple,{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Transparent
            </span>{" "}
            Pricing
          </h2>
          <p className="text-gray-600 text-lg mb-8">
            Choose the perfect plan for your communication journey
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span
              className={`text-sm ${
                isUSD ? "text-purple-600 font-semibold" : "text-gray-600"
              }`}
            >
              USD
            </span>
            <button
              onClick={() => setIsUSD(!isUSD)}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                !isUSD ? "bg-purple-600" : "bg-gray-200"
              }`}
            >
              <div
                className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white transition-transform duration-300 ${
                  !isUSD ? "translate-x-8" : "translate-x-0"
                }`}
              />
            </button>
            <span
              className={`text-sm ${
                !isUSD ? "text-purple-600 font-semibold" : "text-gray-600"
              }`}
            >
              INR
            </span>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          {[
            {
              icon: Sparkles,
              title: "AI Analysis",
              desc: "Advanced speech processing",
            },
            {
              icon: Shield,
              title: "Secure",
              desc: "Enterprise-grade security",
            },
            { icon: Zap, title: "Fast", desc: "Instant feedback" },
            { icon: Clock, title: "24/7 Access", desc: "Practice anytime" },
          ].map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-4"
            >
              <div className="inline-block p-3 rounded-xl bg-purple-50 text-purple-600 mb-3">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1 text-sm md:text-base">
                {item.title}
              </h3>
              <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <PricingCard tier="Free" price="Free" features={features.free} />
          <PricingCard
            tier="Pro"
            price={isUSD ? "$5" : "₹500"}
            features={features.pro}
            popular
          />
        </div>
      </div>
    </section>
  );
};

export default Pricing;
