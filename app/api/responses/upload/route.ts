import { PromptUploadedFile } from "@/actions/upload-actions";
import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { audioUrl, questionId, segments } = await req.json();

    if (!audioUrl || !questionId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    // Get question text for context
    const sql = await getDbConnection();
    const [question] = await sql`
      SELECT question_text FROM questions WHERE id = ${questionId}
    `;

    if (!question) {
      return new NextResponse("Question not found", { status: 404 });
    }

    // Process audio with new Gemini capabilities
    let result;
    try {
      result = await PromptUploadedFile(audioUrl, segments);

      if (
        !result.overallScore ||
        !result.feedback ||
        !result.metrics ||
        !result.questionFeedback
      ) {
        console.error("Invalid AI response:", result);
        return NextResponse.json(
          { success: false, error: "Invalid AI response format" },
          { status: 500 }
        );
      }
    } catch (error) {
      console.error("AI Processing error:", error);
      return NextResponse.json(
        { success: false, error: "AI Processing failed" },
        { status: 500 }
      );
    }

    // Save response and feedback to database
    const feedbackJson = JSON.stringify(result.feedback);
    const metricsJson = JSON.stringify(result.metrics);
    const questionFeedbackJson = JSON.stringify(result.questionFeedback);

    console.log("Inserting response with values:", {
      userId: user.id,
      questionId,
      audioUrl,
      overallScore: result.overallScore,
      feedback: feedbackJson,
      metrics: metricsJson,
      questionFeedback: questionFeedbackJson,
      tokensUsed: result.tokensUsed,
    });

    const [response] = await sql`
      INSERT INTO responses (
        user_id,
        question_id,
        audio_url,
        overall_score,
        feedback_json,
        metrics,
        question_feedback,
        tokens_used
      ) VALUES (
        ${user.id},
        ${questionId},
        ${audioUrl},
        ${result.overallScore},
        ${feedbackJson},
        ${metricsJson},
        ${questionFeedbackJson},
        ${result.tokensUsed}
      )
      RETURNING id
    `;

    // Update user progress
    // First check if record exists
    const [existingProgress] = await sql`
      SELECT user_id, category_id FROM user_progress 
      WHERE user_id = ${user.id} 
      AND category_id = (
        SELECT category_id FROM questions WHERE id = ${questionId}
      )
    `;

    if (existingProgress) {
      // Update existing record
      await sql`
        UPDATE user_progress 
        SET 
          questions_attempted = (
            SELECT COUNT(DISTINCT r.id)
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            WHERE r.user_id = ${user.id}
            AND q.category_id = ${existingProgress.category_id}
          ),
          avg_score = (
            SELECT AVG(r.overall_score)
            FROM responses r
            JOIN questions q ON r.question_id = q.id
            WHERE r.user_id = ${user.id}
            AND q.category_id = ${existingProgress.category_id}
          )
        WHERE user_id = ${user.id}
        AND category_id = ${existingProgress.category_id}
      `;
    } else {
      // Insert new record
      await sql`
        INSERT INTO user_progress (
          user_id,
          category_id,
          questions_attempted,
          avg_score
        )
        SELECT 
          ${user.id},
          q.category_id,
          COUNT(DISTINCT r.id),
          AVG(r.overall_score)
        FROM responses r
        JOIN questions q ON r.question_id = q.id
        WHERE r.user_id = ${user.id}
        GROUP BY q.category_id
      `;
    }

    return NextResponse.json({
      success: true,
      responseId: response.id,
      overallScore: response.overall_score,
      feedback: result.feedback,
      metrics: result.metrics,
      questionFeedback: result.question_feedback,
      tokensUsed: result.tokensUsed,
    });
  } catch (error) {
    console.error("Error processing response:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
