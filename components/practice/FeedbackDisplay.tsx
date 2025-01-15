"use client";

import { QuestionFeedback } from "../feedback/QuestionFeedback";

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
    <div className="space-y-8 p-8 border-2 border-purple-200 rounded-xl bg-white shadow-lg">
      {/* Header Section */}
      <div className="text-center bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg">
        <h2 className="text-3xl font-bold text-purple-800 mb-2">
          Interview Performance Analysis
        </h2>
        <div className="text-5xl font-bold text-purple-600 mb-4">
          {feedback.overall_score !== undefined ? feedback.overall_score : 0}%
        </div>
        {feedback.tokens_used ? (
          <div className="inline-block bg-white px-4 py-2 rounded-full shadow-sm">
            <p className="text-sm text-gray-600">
              Tokens: {feedback.tokens_used}
            </p>
            <p className="text-sm text-gray-600">
              Cost: ${costs?.usd || 0} / ₹{costs?.inr || 0}
            </p>
          </div>
        ) : null}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {Object.entries(feedback.metrics || {}).map(([key, value]) => (
          <div
            key={key}
            className="bg-white p-4 rounded-lg shadow-md border border-purple-100 transform hover:scale-105 transition-transform"
          >
            <h4 className="text-sm font-medium text-purple-600 capitalize mb-1">
              {key}
            </h4>
            <div className="text-2xl font-bold">
              {value !== undefined ? value : 0}%
            </div>
          </div>
        ))}
      </div>

      {/* Feedback Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          {/* Strengths Section */}
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h4 className="text-xl font-semibold text-green-700 mb-4">
              Key Strengths
            </h4>
            <ul className="space-y-2">
              {(feedback.feedback_json?.strengths || []).map((strength, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>{strength}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tips Section */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h4 className="text-xl font-semibold text-blue-700 mb-4">
              Improvement Tips
            </h4>
            <ul className="space-y-2">
              {(feedback.feedback_json?.tips || []).map((tip, i) => (
                <li key={i} className="flex items-start">
                  <span className="text-blue-500 mr-2">💡</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {/* Areas for Improvement */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h4 className="text-xl font-semibold text-amber-700 mb-4">
              Areas for Improvement
            </h4>
            <ul className="space-y-2">
              {(feedback.feedback_json?.improvements || []).map(
                (improvement, i) => (
                  <li key={i} className="flex items-start">
                    <span className="text-amber-500 mr-2">⚡</span>
                    <span>{improvement}</span>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Detailed Question Feedback */}
      <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
        <h4 className="text-xl font-semibold text-purple-700 mb-4">
          Question-by-Question Analysis
        </h4>
        <QuestionFeedback questionFeedback={feedback.questionFeedback || {}} />
      </div>
    </div>
  );
}
