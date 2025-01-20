"use client";

import { motion } from "framer-motion";
import { QuestionFeedback } from "../feedback/QuestionFeedback";
import { cn } from "@/lib/utils";

interface FeedbackDisplayProps {
  feedback: {
    id: string;
    user_id: string;
    question_id: string;
    audio_url?: string;
    overall_score?: number;
    feedback_json?: {
      tips?: string[];
      strengths?: string[];
      improvements?: string[];
    };
    metrics?: {
      clarity?: number;
      confidence?: number;
      relevance?: number;
      structure?: number;
    };
    created_at?: string;
    tokens_used?: number;
    question_text?: string;
    category_name?: string;
    questionFeedback?: {
      [question: string]: {
        timestamp?: string;
        score?: number;
        feedback?: string;
        improvedVersion?: string;
      }[];
    };
  };
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  const calculateCosts = () => {
    if (!feedback.tokens_used) return null;
    const usdCost = feedback.tokens_used * 0.00001;
    const inrCost = usdCost * 83;
    return {
      usd: usdCost.toFixed(6),
      inr: inrCost.toFixed(6),
    };
  };

  const costs = calculateCosts();

  return (
    <div className="space-y-8 overflow-x-hidden h-full">
      {/* Header Section with Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-lg border border-purple-100 p-8 relative overflow-hidden group hover:shadow-xl transition-all duration-300"
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-100/20 to-transparent rounded-bl-[100%]" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-purple-50/30 to-transparent rounded-tr-[100%]" />

        {/* Floating particles effect for high scores */}
        {(feedback.overall_score || 0) > 70 && (
          <>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute top-12 right-12 w-3 h-3 rounded-full bg-purple-200"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="absolute top-24 right-24 w-2 h-2 rounded-full bg-purple-300"
            />
          </>
        )}

        <div className="relative z-10">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800 mb-8">
            Overall Performance
          </h2>

          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div
                className={cn(
                  "text-7xl font-bold transition-colors duration-300",
                  (feedback.overall_score || 0) >= 70 && "text-green-500",
                  (feedback.overall_score || 0) >= 50 &&
                    (feedback.overall_score || 0) < 70 &&
                    "text-amber-500",
                  (feedback.overall_score || 0) < 50 && "text-red-500"
                )}
              >
                {feedback.overall_score !== undefined
                  ? feedback.overall_score
                  : 0}
                %
              </div>

              {/* Performance label */}
              <div
                className={cn(
                  "inline-block px-4 py-2 rounded-full text-sm font-medium",
                  (feedback.overall_score || 0) >= 70 &&
                    "bg-green-50 text-green-700",
                  (feedback.overall_score || 0) >= 50 &&
                    (feedback.overall_score || 0) < 70 &&
                    "bg-amber-50 text-amber-700",
                  (feedback.overall_score || 0) < 50 && "bg-red-50 text-red-700"
                )}
              >
                {(feedback.overall_score || 0) >= 70 &&
                  "Excellent Performance 🌟"}
                {(feedback.overall_score || 0) >= 50 &&
                  (feedback.overall_score || 0) < 70 &&
                  "Good Progress 👍"}
                {(feedback.overall_score || 0) < 50 && "Keep Practicing 💪"}
              </div>
            </div>

            {/* Token usage card with enhanced design */}
            {feedback.tokens_used && (
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-purple-100 rounded-2xl blur opacity-40 group-hover:opacity-60 transition-opacity duration-300" />
                <div className="relative bg-white/90 backdrop-blur-sm px-6 py-4 rounded-2xl border border-purple-100 shadow-sm group-hover:shadow-md transition-all duration-300">
                  <div className="text-xs text-purple-600 font-medium mb-1">
                    USAGE METRICS
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <p className="text-sm text-gray-600">
                        Tokens:{" "}
                        <span className="font-medium">
                          {feedback.tokens_used}
                        </span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <p className="text-sm text-gray-600">
                        Cost: <span className="font-medium">${costs?.usd}</span>{" "}
                        / <span className="font-medium">₹{costs?.inr}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Progress bar */}
          <div className="mt-8 space-y-2">
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${feedback.overall_score}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className={cn(
                  "h-full transition-colors duration-300",
                  (feedback.overall_score || 0) >= 70 && "bg-green-500",
                  (feedback.overall_score || 0) >= 50 &&
                    (feedback.overall_score || 0) < 70 &&
                    "bg-amber-500",
                  (feedback.overall_score || 0) < 50 && "bg-red-500"
                )}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Quick tip based on score */}
          <div className="mt-6 text-sm text-gray-600">
            {(feedback.overall_score || 0) >= 70 &&
              "Outstanding work! Your responses show excellent command over the subject matter."}
            {(feedback.overall_score || 0) >= 50 &&
              (feedback.overall_score || 0) < 70 &&
              "Good job! Focus on the improvement areas to enhance your performance further."}
            {(feedback.overall_score || 0) < 50 &&
              "Keep practicing! Review the feedback carefully and work on the suggested improvements."}
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(feedback.metrics || {}).map(([key, value], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "bg-white p-6 rounded-2xl shadow-md border relative overflow-hidden group hover:shadow-lg transition-all duration-300",
              value > 50 ? "border-green-100" : "border-red-100"
            )}
          >
            {/* Background decoration */}
            <div
              className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-bl-[100%] transition-all duration-300 opacity-10 group-hover:opacity-20",
                value > 70 && "bg-green-500",
                value > 50 && value <= 70 && "bg-amber-500",
                value <= 50 && "bg-red-500"
              )}
            />

            {/* Content */}
            <div className="relative z-10">
              <h4 className="text-sm font-medium text-gray-600 capitalize mb-2">
                {key}
              </h4>
              <div className="flex items-end gap-2">
                <div
                  className={cn(
                    "text-4xl font-bold",
                    value > 70 && "text-green-500",
                    value > 50 && value <= 70 && "text-amber-500",
                    value <= 50 && "text-red-500"
                  )}
                >
                  {value !== undefined ? value : 0}%
                </div>
                <div className="text-sm text-gray-500 mb-1">
                  {value > 70 && "Excellent"}
                  {value > 50 && value <= 70 && "Good"}
                  {value <= 50 && "Needs Work"}
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    value > 70 && "bg-green-500",
                    value > 50 && value <= 70 && "bg-amber-500",
                    value <= 50 && "bg-red-500"
                  )}
                  style={{ width: `${value}%` }}
                />
              </div>

              {/* Quick tip */}
              <div className="mt-3 text-xs text-gray-500">
                {key === "clarity" &&
                  value <= 50 &&
                  "Try speaking more clearly and at a steady pace"}
                {key === "confidence" &&
                  value <= 50 &&
                  "Work on maintaining a confident tone"}
                {key === "relevance" &&
                  value <= 50 &&
                  "Focus on staying on topic"}
                {key === "structure" &&
                  value <= 50 &&
                  "Try organizing your thoughts better"}

                {key === "clarity" &&
                  value > 50 &&
                  value <= 70 &&
                  "Good clarity, keep practicing"}
                {key === "confidence" &&
                  value > 50 &&
                  value <= 70 &&
                  "Growing confidence!"}
                {key === "relevance" &&
                  value > 50 &&
                  value <= 70 &&
                  "Staying mostly on topic"}
                {key === "structure" &&
                  value > 50 &&
                  value <= 70 &&
                  "Well structured overall"}

                {key === "clarity" && value > 70 && "Excellent clarity!"}
                {key === "confidence" &&
                  value > 70 &&
                  "Very confident delivery!"}
                {key === "relevance" && value > 70 && "Perfectly on topic!"}
                {key === "structure" && value > 70 && "Expertly structured!"}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Feedback Sections */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Strengths and Tips sections */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-inner border-gray-200 border p-8"
          >
            <h3 className="text-2xl font-semibold text-green-700 mb-6">
              Key Strengths
            </h3>
            <ul className="space-y-4">
              {(feedback.feedback_json?.strengths || []).map((strength, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start group hover:bg-green-50/50 p-3 rounded-lg transition-all duration-300"
                >
                  <span className="text-green-500 mr-3 bg-green-100 px-2 py-1 rounded-full group-hover:scale-110 transition-transform duration-300">
                    ✓
                  </span>
                  <div>
                    <p className="text-gray-700 font-medium">{strength}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Keep maintaining this strength in your future responses.
                    </p>
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-bl-full opacity-50" />
            <div className="mb-4">
              <h3 className="text-2xl font-semibold text-blue-700 mb-3 relative z-10">
                Improvement Tips
              </h3>
              <div className="flex items-center gap-2 ">
                <div className="h-1 w-1 rounded-full bg-blue-300" />
                <p className="text-xs text-blue-600">
                  Try implementing this in your next practice
                </p>
              </div>
            </div>
            <ul className="space-y-4 relative z-10">
              {(feedback.feedback_json?.tips || []).map((tip, i) => (
                <>
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-start bg-white/80 backdrop-blur-sm p-4 rounded-xl border border-blue-100 hover:border-blue-200 hover:shadow-md transition-all duration-300"
                  >
                    <span className="text-blue-500 mr-3 bg-blue-50 p-2 rounded-lg">
                      💡
                    </span>
                    <div>
                      <p className="text-gray-700">{tip}</p>
                    </div>
                  </motion.li>
                </>
              ))}
            </ul>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-bl-full opacity-50" />
            <h3 className="text-2xl font-semibold text-amber-700 mb-3 relative z-10">
              Areas for Improvement
            </h3>
            <div className="mt-2 flex items-center gap-2 mb-3">
              <div className="h-1 w-1 rounded-full bg-amber-400" />
              <p className="text-xs text-amber-600">
                Focus on this area in your next attempt
              </p>
            </div>
            <ul className="space-y-4 relative z-10">
              {(feedback.feedback_json?.improvements || []).map(
                (improvement, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-start bg-white rounded-xl border border-amber-100 p-4 hover:border-amber-200 hover:shadow-md transition-all duration-300">
                      <div className="flex-shrink-0">
                        <span className="inline-block text-amber-500 bg-amber-50 p-2 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          ⚡
                        </span>
                      </div>
                      <div className="ml-3">
                        <p className="text-gray-700">{improvement}</p>
                      </div>
                    </div>
                  </motion.li>
                )
              )}
            </ul>

            {/* Motivational message */}
            <div className="mt-6 p-4 bg-gradient-to-r from-amber-50 to-amber-100/50 rounded-xl">
              <p className="text-sm text-amber-700 text-center">
                Remember: Every area of improvement is an opportunity for
                growth! 🌱
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Question Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-start md:items-center space-y-8 border-t pt-8 relative rounded-tr-xl border-dashed  w-fit border-purple-400"
      >
        <h3 className="text-purple-500 shadow-sm text-xl px-10">
          Question{" "}
          <span className="md:hidden">
            <br></br>
          </span>{" "}
          Analysis
        </h3>
        <QuestionFeedback questionFeedback={feedback.questionFeedback || {}} />
      </motion.div>
    </div>
  );
}
