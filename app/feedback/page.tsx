import React from "react";
import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const FeedbackListPage = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        <p className="text-lg">Please sign in to view your feedback.</p>
      </div>
    );
  }

  const sql = await getDbConnection();
  const feedbacks = await sql`
    SELECT 
      r.id,
      r.user_id,
      r.question_id,
      r.audio_url,
      r.overall_score,
      r.feedback_json,
      r.metrics,
      r.question_feedback,
      r.created_at,
      r.tokens_used,
      q.question_text,
      c.name as category_name
    FROM responses r
    JOIN questions q ON r.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE r.user_id = ${user.id}
    ORDER BY r.created_at DESC
  `;

  return (
    <div className="container max-w-6xl py-8 mx-auto mt-4 md:mt-8">
      <h1 className="text-4xl font-bold text-center text-gradient mb-12">
        Your Feedback
      </h1>
      {feedbacks.length === 0 ? (
        <p className="text-gray-600 text-center">No feedback available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
          {feedbacks.map((feedback) => (
            <div
              key={feedback.id}
              className="shadow-inner p-6 transform hover:scale-105 border border-gray-200 rounded-2xl hover:border-purple-200 transition-all space-y-5 group
"
            >
              <h2 className="text-lg font-semibold line-clamp-2 md:line-clamp-3">
                {feedback.question_text}
              </h2>
              <div className="space-y-2">
                <p className="text-gray-500">
                  Category: {feedback.category_name}
                </p>
                <p className="text-gray-700">Score: {feedback.overall_score}</p>
              </div>
              <Link href={`/feedback/${feedback.id}`}>
                <Button
                  variant="outline"
                  className="mt-4 bg-white text-blue-400 hover:bg-blue-100 
                  hover:text-blue-800 transition-colors
                  font-semibold
                  duration-200
                  border-gray-200 rounded-2xl shadow-inner group-hover:bg-white/10"
                >
                  View Feedback
                </Button>
              </Link>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-center gap-4 mt-8">
        <Link href="/dashboard">
          <Button
            variant="outline"
            className="bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
          >
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default FeedbackListPage;
