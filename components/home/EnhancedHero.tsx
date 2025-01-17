"use client";
import { motion } from "framer-motion";
import { ArrowRight, Users, Star, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";

const stats = [
  { label: "Active Users", value: "10K+", icon: Users },
  { label: "User Rating", value: "4.9", icon: Star },
  { label: "Industry Awards", value: "15+", icon: Award },
];

const EnhancedHero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center ">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9d5ff,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ddd6fe,transparent)]" />
      </div>

      <div className="container mx-auto px-4 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="text-6xl font-bold leading-tight">
              Transform Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-3">
                Voice
              </span>
              Into Impact
            </h1>

            <p className="text-xl text-gray-600 max-w-lg">
              Leverage AI-powered analysis to enhance your communication skills
              and receive instant, personalized feedback.
            </p>

            <div className="flex gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full px-8"
              >
                <Link href="/#pricing" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="rounded-full border-2 hover:bg-purple-50"
              >
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="text-center p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className="w-6 h-6 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-[600px] rounded-3xl overflow-hidden">
              <Image
                src="/hero-person-mic-illustration.jpg"
                alt="Hero Illustration"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-200/30 to-indigo-200/30 backdrop-blur-0" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EnhancedHero;
