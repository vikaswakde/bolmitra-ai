"use client";
import { motion } from "framer-motion";
import { ArrowRight, Users, Star, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { useAuth } from "@clerk/nextjs";

const stats = [
  { label: "Active Users", value: "69+", icon: Users },
  { label: "User Rating", value: "4.2", icon: Star },
  { label: "Recognitions", value: "7+", icon: Award },
];

const EnhancedHero = () => {
  const { userId } = useAuth();

  return (
    <section className="relative min-h-screen pt-20 lg:pt-0 flex items-center overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9d5ff,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ddd6fe,transparent)]" />
      </div>

      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 lg:space-y-8 text-center lg:text-left"
          >
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              Transform Your
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 px-2">
                Voice
              </span>
              Into Impact
            </h1>

            <p className="text-lg lg:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0">
              Leverage AI-powered analysis to enhance your communication skills
              and receive instant, personalized feedback.
            </p>

            <div className="flex justify-center lg:justify-start gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white rounded-full px-6 lg:px-8"
              >
                <Link
                  href={userId ? "/dashboard" : "/sign-up"}
                  className="flex items-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6 pt-6 lg:pt-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="text-center p-2 lg:p-4 rounded-xl bg-white/50 backdrop-blur-sm border border-purple-100 hover:shadow-lg transition-all duration-300"
                >
                  <stat.icon className="w-5 h-5 lg:w-6 lg:h-6 mx-auto mb-1 lg:mb-2 text-purple-600" />
                  <div className="text-xl lg:text-2xl font-bold text-gray-800">
                    {stat.value}
                  </div>
                  <div className="text-xs lg:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Content - Hero Illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative mt-8 lg:mt-0"
          >
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[600px] rounded-3xl overflow-hidden">
              <Image
                src="/hero-person-mic-illustration.jpg"
                alt="Hero Illustration"
                fill
                className="object-cover object-center"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
