import React from "react";
import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import FeedbackList, { Feedback } from "@/components/feedback/FeedbackList";

const FeedbackListPage = async () => {
  const user = await currentUser();
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white px-4">
        <div className="text-center space-y-4 p-4 sm:p-8 rounded-2xl bg-white shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Sign in Required
          </h2>
          <p className="text-sm sm:text-base text-gray-600">
            Please sign in to view your feedback history.
          </p>
          <Link href="/sign-in" className="block">
            <Button className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600">
              Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const sql = await getDbConnection();
  const feedbacks = await sql`
    SELECT 
      r.*,
      q.question_text,
      c.name as category_name
    FROM responses r
    JOIN questions q ON r.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE r.user_id = ${user.id}
    ORDER BY r.created_at DESC
  `;

  // Calculate statistics
  const averageScore =
    feedbacks.reduce((acc, f) => acc + (f.overall_score || 0), 0) /
    feedbacks.length;
  const totalPractices = feedbacks.length;
  const recentProgress =
    feedbacks.length > 1
      ? feedbacks[0].overall_score - feedbacks[1].overall_score
      : 0;

  return (
    <FeedbackList
      averageScore={averageScore}
      feedbacks={feedbacks as Feedback[]} // Type assertion to match Feedback type
      recentProgress={recentProgress}
      totalPractices={totalPractices}
    />
  );
};

export default FeedbackListPage;
