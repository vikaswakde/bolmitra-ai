"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { BarChart2, Clock, Award, ArrowRight, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Feedback {
  id: string;
  overall_score: number;
  created_at: string;
  question_text: string;
  category_name: string;
}

interface FeedbackListProps {
  averageScore: number;
  totalPractices: number;
  recentProgress: number;
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  averageScore,
  totalPractices,
  recentProgress,
  feedbacks,
}) => {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9d5ff,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ddd6fe,transparent)]" />
      </div>
      <div className="container max-w-7xl py-12 mx-auto px-4">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
            Your Practice Journey
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Track your progress and review detailed feedback for each practice
            session
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: "Average Score",
              value: `${Math.round(averageScore)}%`,
              icon: Award,
              color: "from-green-500 to-emerald-500",
            },
            {
              title: "Total Practices",
              value: totalPractices,
              icon: BookOpen,
              color: "from-blue-500 to-indigo-500",
            },
            {
              title: "Recent Progress",
              value: `${recentProgress > 0 ? "+" : ""}${Math.round(
                recentProgress
              )}%`,
              icon: BarChart2,
              color: "from-purple-500 to-pink-500",
            },
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl shadow-lg p-6 border border-gray-300 bg-cyan-100"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Feedback Cards */}
        {feedbacks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 p-8 rounded-2xl shadow-lg border-gray-200 border"
          >
            <h2 className="text-2xl font-bold text-gray-800">
              No Feedback Yet
            </h2>
            <div className="flex  flex-col space-y-4">
              <p className="text-gray-600">
                Start practicing to get AI-powered feedback!
              </p>
              <Link href="/dashboard">
                <Button className="bg-gradient-to-r from-purple-600 to-indigo-600">
                  Start Practice
                </Button>
              </Link>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {feedbacks.map((feedback, index) => (
              <motion.div
                key={feedback.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group relative  rounded-2xl shadow-lg border border-cyan-300 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="absolute top-0 right-0 p-4">
                  <div
                    className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      feedback.overall_score >= 70 &&
                        "border-green-200 border text-green-700",
                      feedback.overall_score >= 50 &&
                        feedback.overall_score < 70 &&
                        "border-yellow-200 border text-yellow-700",
                      feedback.overall_score < 50 &&
                        " border-red-200 border text-red-700"
                    )}
                  >
                    {feedback.overall_score}%
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    {new Date(feedback.created_at).toLocaleDateString()}
                  </div>

                  <h2 className="text-lg font-semibold line-clamp-2 group-hover:text-purple-600 transition-colors">
                    {feedback.question_text}
                  </h2>

                  <div className="flex items-center gap-2 text-sm text-gray-600 pb-4 ">
                    <div className="px-2 py-1 border-cyan-300 border-b rounded-xl">
                      {feedback.category_name}
                    </div>
                  </div>

                  <Link href={`/feedback/${feedback.id}`}>
                    <Button
                      className="w-full group-hover:bg-gradient-to-r from-purple-600 to-indigo-600 group-hover:text-white transition-all duration-300 rounded-2xl bg-transparent border border-purple-400 shadow-lg"
                      variant="outline"
                    >
                      <span className="flex items-center gap-2">
                        View Detailed Feedback
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </Button>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackList;
