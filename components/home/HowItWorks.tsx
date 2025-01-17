"use client";
import { motion } from "framer-motion";
import { BrainIcon, Mic, FileText, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

const steps = [
  {
    icon: <Mic className="w-12 h-12" />,
    title: "Record Your Audio",
    description:
      "Speak naturally for up to 60 seconds. Our advanced audio processing ensures crystal-clear capture.",
    color: "from-purple-500 to-purple-600",
    delay: 0.2,
  },
  {
    icon: <BrainIcon className="w-12 h-12" />,
    title: "AI Analysis",
    description:
      "Our AI engine analyzes multiple aspects of your speech including tone, clarity, pace, and engagement.",
    color: "from-indigo-500 to-indigo-600",
    delay: 0.4,
  },
  {
    icon: <FileText className="w-12 h-12" />,
    title: "Detailed Feedback",
    description:
      "Receive comprehensive feedback with specific improvement suggestions and performance metrics.",
    color: "from-blue-500 to-blue-600",
    delay: 0.6,
  },
];

const HowItWorks = () => {
  return (
    <section className="relative py-24 overflow-hidden bg-white">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 to-white pointer-events-none" />

      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20" />

      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <h2 className="text-4xl font-bold mb-6">
            Simple Steps to{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Perfect Your Speech
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Transform your communication skills with our easy-to-follow process
          </p>
        </motion.div>

        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: step.delay }}
              className="relative group"
            >
              {/* Connector Lines */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 left-full w-full h-[2px] bg-gradient-to-r from-purple-200 to-transparent -translate-y-1/2 transform" />
              )}

              {/* Card */}
              <div className="relative p-8 bg-white rounded-2xl border border-purple-100 shadow-xl shadow-purple-100/10 group-hover:border-purple-200 transition-all duration-300">
                {/* Icon */}
                <div
                  className={`inline-block p-4 rounded-xl bg-gradient-to-r ${step.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  {step.icon}
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-purple-100 to-indigo-100">
            <Button
              size="lg"
              className="rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white px-8 group"
            >
              <Link href="/#pricing" className="flex items-center gap-2">
                Start Practicing Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          {/* Feature Badge */}
          <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm">
            <Sparkles className="w-4 h-4" />
            AI-Powered Analysis
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
