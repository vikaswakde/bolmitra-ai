import getDbConnection from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { audioUrl, questionId } = await req.json();

    if (!audioUrl || !questionId) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    console.log("audioUrl", audioUrl);
    console.log("questionId", questionId);

    // Get question text for context
    const sql = await getDbConnection();
    const [question] = await sql`
      SELECT question_text FROM questions WHERE id = ${questionId}
    `;

    // Generate feedback using Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      As an expert communication coach, analyze this audio response to the question: "${question.question_text}"
      
      Audio URL: ${audioUrl}
      
      Please provide detailed feedback in the following JSON format:
      {
        "overallScore": number (1-100),
        "feedback": {
          "strengths": [string array of key strengths],
          "improvements": [string array of areas for improvement],
          "tips": [string array of actionable tips]
        },
        "metrics": {
          "clarity": number (1-100),
          "confidence": number (1-100),
          "relevance": number (1-100),
          "structure": number (1-100)
        }
      }
    `;

    const result = await model.generateContent(prompt);
    const feedback = JSON.parse(result.response.text());

    // Save response and feedback to database
    const [response] = await sql`
      INSERT INTO responses (
        user_id,
        question_id,
        audio_url,
        feedback_json,
        metrics
      ) VALUES (
        ${user.id},
        ${questionId},
        ${audioUrl},
        ${feedback.feedback},
        ${feedback.metrics}
      )
      RETURNING id
    `;

    // Update user progress
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
        AVG(CAST(r.feedback_json->>'overallScore' AS INTEGER))
      FROM responses r
      JOIN questions q ON r.question_id = q.id
      WHERE r.user_id = ${user.id}
      GROUP BY q.category_id
      ON CONFLICT (user_id, category_id)
      DO UPDATE SET
        questions_attempted = EXCLUDED.questions_attempted,
        avg_score = EXCLUDED.avg_score
    `;

    return NextResponse.json({
      success: true,
      responseId: response.id,
      feedback,
    });
  } catch (error) {
    console.error("Error processing response:", error);
    return new NextResponse("Internal server error", { status: 500 });
  }
}
