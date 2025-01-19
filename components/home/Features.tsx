"use client";
import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  BarChart,
  Sparkles,
  Clock,
  Shield,
  Zap,
  Target,
} from "lucide-react";
import { useState } from "react";

const features = [
  {
    icon: <Brain className="w-6 h-6" />,
    title: "AI-Powered Insights",
    description: "Get detailed feedback on tone, pace, clarity, and engagement",
    color: "from-indigo-500 to-indigo-600",
  },
  {
    icon: <BarChart className="w-6 h-6" />,
    title: "Detailed Analytics",
    description: "Track your progress with comprehensive performance metrics",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: "Personalized Tips",
    description:
      "Receive customized improvement suggestions after each session",
    color: "from-violet-500 to-violet-600",
  },
  {
    icon: <Clock className="w-6 h-6" />,
    title: "Real-time Feedback",
    description: "Instant analysis and recommendations as you practice",
    color: "from-fuchsia-500 to-fuchsia-600",
  },
  {
    icon: <Mic className="w-6 h-6" />,
    title: "Voice Analysis",
    description:
      "Advanced audio processing for clear, accurate speech recognition",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Private & Secure",
    description: "Enterprise-grade security for your voice data",
    color: "from-pink-500 to-pink-600",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Quick Practice",
    description: "60-second practice sessions for efficient learning",
    color: "from-rose-500 to-rose-600",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Goal Tracking",
    description: "Set and monitor your communication improvement goals",
    color: "from-purple-500 to-purple-600",
  },
];

const Features = () => {
  const [showAllFeatures, setShowAllFeatures] = useState(false);
  const displayedFeatures = showAllFeatures ? features : features.slice(0, 3);

  return (
    <section className="py-24 bg-gradient-to-b from-white to-purple-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Better Communication
            </span>
          </h2>
          <p className="text-gray-600 text-lg">
            Everything you need to analyze, improve, and perfect your speaking
            skills
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayedFeatures.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-white rounded-2xl shadow-xl shadow-purple-100/20 transform group-hover:scale-[1.02] transition-transform duration-300" />
              <div className="relative p-6 space-y-4">
                <div
                  className={`inline-block p-3 rounded-xl bg-gradient-to-r ${feature.color} text-white`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Show More/Less Button */}
        <div className="flex justify-center mt-8 md:hidden">
          <button
            onClick={() => setShowAllFeatures(!showAllFeatures)}
            className="px-6 py-2 text-purple-600 border border-purple-600 rounded-full hover:bg-purple-50 transition-colors bg-white/50"
          >
            {showAllFeatures ? "Show Less" : "Show More Features"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Features;
