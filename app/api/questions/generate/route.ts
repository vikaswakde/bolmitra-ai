import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import getDbConnection from "@/lib/db";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { categoryId, context, questionCount, difficulty } = await req.json();

    // console.log("this is req.json in /question/generate ==>", req.json());

    const prompt = `Generate ${questionCount} unique practice questions for the following context:
    
Context: ${context}
Difficulty Level: ${difficulty}

Requirements:
- Questions should be practical and scenario-based
- Focus on speaking and communication skills
- Match the specified difficulty level
- Include a mix of behavioral and situational questions
- make questions to the point, focusing on issue for user to talk about, keep questions SHORT and to the POINT.

Format the response as in a CORRECT JSON FORMAT ARRAY with the following structure:
[{
  "questionText": "The actual question text",
  "difficultyLevel": "${difficulty}",
  "type": "behavioral|situational",
}]`;

    console.log("this is what our ai got ==>", prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    console.log("Raw AI response:", text);

    // More robust cleaning of the response
    try {
      // First attempt: Try direct parsing
      const questions = JSON.parse(text);
      console.log("Parsed directly:", questions);
    } catch (parseError) {
      console.log("Direct parsing failed, attempting to clean response");

      // Remove markdown code blocks and any extra text
      text = text
        .replace(/```json\n?/, "")
        .replace(/```(\w+)?\n?/, "")
        .replace(/```/, "")
        .trim();

      console.log("Cleaned text:", text);

      // Try to find JSON array in the text
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        text = match[0];
        console.log("Extracted array:", text);
      }

      try {
        const questions = JSON.parse(text);
        console.log("Successfully parsed after cleaning:", questions);

        // Continue with database operations
        const sql = await getDbConnection();

        // Delete existing questions
        await sql`
          DELETE FROM questions 
          WHERE category_id = ${categoryId}
        `;

        // Insert questions one by one
        const savedQuestions = [];
        for (const q of questions) {
          const [saved] = await sql`
            INSERT INTO questions (
              category_id,
              question_text,
              difficulty_level
            ) VALUES (
              ${categoryId},
              ${q.questionText},
              ${q.difficultyLevel}
            )
            RETURNING *
          `;
          savedQuestions.push(saved);
        }

        return NextResponse.json({
          success: true,
          data: savedQuestions,
        });
      } catch (secondParseError) {
        console.error("Failed to parse after cleaning:", secondParseError);
        throw new Error("Could not parse AI response into valid JSON");
      }
    }
  } catch (error) {
    console.error("Error in question generation:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate questions",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
