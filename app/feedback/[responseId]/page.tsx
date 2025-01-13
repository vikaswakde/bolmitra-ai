import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import FeedbackDisplay from "@/components/practice/FeedbackDisplay";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

  console.log("this is response =>", response);
  console.log("structre of feedback_json", response.feedback_json);

  if (!response) {
    redirect("/dashboard");
  }

  return (
    <div className="container max-w-4xl py-8 space-y-8 mx-auto mt-4 md:mt-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-purple-700">Your Feedback</h1>
          <p className="text-gray-600">Category: {response.category_name}</p>
        </div>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
      <div className="bg-white rounded-lg shadow-lg">
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
      </div>

      <div className="flex justify-center gap-4">
        <Link href={`/practice/${response.category_id}`}>
          <Button>Practice More</Button>
        </Link>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  );
};

export default FeedbackPage;
