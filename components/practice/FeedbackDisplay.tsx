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
    <div className="space-y-8">
      {/* Header Section with Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid lg:grid-cols-2 gap-8"
      >
        <div className="bg-white rounded-2xl shadow-inner border border-gray-200 p-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600/90 to-purple-800/40 mb-6">
            Overall Performance
          </h2>
          <div className="flex items-center justify-between">
            <div
              className={cn(
                "text-7xl font-bold text-green-500",
                (feedback.overall_score || 0) < 50 && "text-red-400"
              )}
            >
              {feedback.overall_score !== undefined
                ? feedback.overall_score
                : 0}
              %
            </div>
            {feedback.tokens_used && (
              <div className="bg-purple-50 px-6 py-3 rounded-2xl inner-sm border border-gray-200">
                <p className="text-sm text-gray-700">
                  Tokens: {feedback.tokens_used}
                  <br />
                  Cost: ${costs?.usd || 0} / ₹{costs?.inr || 0}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(feedback.metrics || {}).map(([key, value], index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "backdrop-blur-sm p-6 rounded-2xl shadow-inner border border-purple-100 hover:shadow-md transition-shadow duration-300  text-red-500/90",
                (value > 50 || 0) && " text-green-400"
              )}
            >
              <h4 className="text-sm font-medium text-purple-600/90 capitalize mb-2">
                {key}
              </h4>
              <div className="text-3xl font-bold">
                {value !== undefined ? value : 0}%
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

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
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
          >
            <h3 className="text-2xl font-semibold text-blue-700 mb-6">
              Improvement Tips
            </h3>
            <ul className="space-y-4">
              {(feedback.feedback_json?.tips || []).map((tip, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 h-fit"
        >
          <h3 className="text-2xl font-semibold text-amber-700 mb-6">
            Areas for Improvement
          </h3>
          <ul className="space-y-4">
            {(feedback.feedback_json?.improvements || []).map(
              (improvement, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-amber-500 mr-2">⚡</span>
                  <span>{improvement}</span>
                </li>
              )
            )}
          </ul>
        </motion.div>
      </div>

      {/* Question Analysis Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-sm p-8 relative  border-t border-b "
      >
        <h3 className="text-2xl font-medium text-black/70 bg-purple-50 absolute py-12 px-10 rounded-2xl top-0 left-0 border borer-gray-200 shadow-sm">
          Qn Analysis
        </h3>
        <QuestionFeedback questionFeedback={feedback.questionFeedback || {}} />
      </motion.div>
    </div>
  );
}
