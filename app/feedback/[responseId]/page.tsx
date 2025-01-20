import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackDisplay from "@/components/practice/FeedbackDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Folder } from "lucide-react";

const FeedbackPage = async (props: {
  params: Promise<{ responseId: string }>;
}) => {
  const params = await props.params;
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const sql = await getDbConnection();
  const [response] = await sql`
    SELECT 
      r.*,
      q.question_text,
      c.name as category_name
    FROM responses r
    JOIN questions q ON r.question_id = q.id
    JOIN categories c ON q.category_id = c.id
    WHERE r.id = ${params.responseId}
    AND r.user_id = ${user.id}
  `;

  if (!response) {
    redirect("/dashboard");
  }

  const formattedDate = new Date(response.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  const formattedTime = new Date(response.created_at).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div className="min-h-screen overflow-hidden">
      {/* Background Elements */}

      <div className="container max-w-6xl py-12 mx-auto px-4">
        {/* Navigation */}
        <nav className="mb-8">
          <Link
            href="/feedback"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Feedback History
          </Link>
        </nav>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
                Interview Feedback
              </h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  {response.category_name}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formattedDate}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {formattedTime}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Link href={`/dashboard`}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600/20 to-indigo-600/50 hover:from-indigo-600 hover:to-purple-600 text-white shadow-md"
                >
                  Practice More
                </Button>
              </Link>
            </div>
          </div>
        </header>

        {/* Feedback Display */}
        <FeedbackDisplay
          feedback={{
            id: response.id,
            user_id: response.user_id,
            question_id: response.question_id,
            audio_url: response.audio_url,
            overall_score: response.overall_score,
            feedback_json: response.feedback_json,
            metrics: response.metrics,
            questionFeedback: response.question_feedback,
            created_at: response.created_at,
            tokens_used: response.tokens_used,
            question_text: response.question_text,
            category_name: response.category_name,
          }}
        />

        {/* Footer Actions */}
        <div className="flex justify-center gap-4 mt-12">
          <Link href="/feedback">
            <Button
              variant="outline"
              size="lg"
              className="shadow-sm hover:bg-purple-50 transition-colors"
            >
              View All Feedback
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeedbackPage;
