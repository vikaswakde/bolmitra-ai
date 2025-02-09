"use server";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { writeFile } from "fs/promises";
import { join } from "path";
import os from "os";

const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

interface QuestionSegment {
  questionId: string;
  startTime: number;
  endTime: number;
  questionText: string;
}

interface UploadRequest {
  audioUrl: string;
  segments: QuestionSegment[];
  questionId: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function PromptUploadedFile(
  audioUrl: string,
  segments: QuestionSegment[]
) {
  try {
    // Download file from Uploadthing
    const response = await fetch(audioUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Create a temporary file in the OS temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = join(tempDir, `upload-${Date.now()}.webm`);

    // Write to temp directory (this is allowed in production)
    await writeFile(tempFilePath, Buffer.from(arrayBuffer));

    // Now use the temp file path with Google AI
    const uploadResult = await fileManager.uploadFile(tempFilePath, {
      mimeType: "audio/webm",
      displayName: "Audio sample",
    });

    console.log("This is uploadResult ==>", uploadResult);
    console.log("This is segments ==>", segments);

    // // Create file object directly in memory
    // const fileInMemory = {
    //   data: Buffer.from(arrayBuffer),
    //   mimeType: "audio/webm",
    //   name: `upload-${Date.now()}.mp3`,
    // };

    // // Now use the local path with Google AI
    // const uploadResult = await fileManager.uploadFile(fileInMemory.data, {
    //   mimeType: "audio/webm",
    //   displayName: "Audio sample",
    // });

    let file = await fileManager.getFile(uploadResult.file.name);
    while (file.state === FileState.PROCESSING) {
      process.stdout.write(".");
      console.log("processing.....");
      // Sleep for 10 seconds
      await new Promise((resolve) => setTimeout(resolve, 10_000));
      // Fetch the file from the API again
      file = await fileManager.getFile(uploadResult.file.name);
    }

    if (file.state === FileState.FAILED) {
      throw new Error("Audio processing failed");
    }

    // Clean up: Delete the temp file
    // await fs.unlink(filePath);

    // View the response;
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as ${uploadResult.file.uri}`
    );

    // Use GEMINI_API_KEY instead of GOOGLE_API_KEY
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const questionSegments = segments
      .map(
        (seg) => `[${seg.startTime}s - ${seg.endTime}s]: "${seg.questionText}"`
      )
      .join("\n");

    console.log("this is question segment");

    const prompt = `You are an expert communication coach. Analyze this audio response to multiple questions. 
    The audio contains responses to the following questions at these timestamps:
    ${questionSegments}
    
    Provide a detailed analysis in JSON format with:
    1. Overall assessment of the responses
    2. Speaking clarity and confidence
    3. Content relevance and structure
    4. Specific strengths and areas for improvement
    5. Individual feedback for each question segment
    
    Format the response exactly as follows:
    {
      "overallScore": <number between 1-100>,
      "feedback": {
        "strengths": [<array of specific strengths>],
        "improvements": [<array of areas to improve>],
        "tips": [<array of actionable suggestions>]
      },
      "metrics": {
        "clarity": <number between 1-100>,
        "confidence": <number between 1-100>,
        "relevance": <number between 1-100>,
        "structure": <number between 1-100>
      },
      "questionFeedback": {
        "<question itself>": [
          {
            "timestamp": "<start-end>",
            "score": <number between 1-100>,
            "feedback": "<specific feedback for this answer>",
            "improvedVersion": "<a short and to the point improved version>",
            "keyStrength": "<specific strength related to the question>",
            "focusArea": "<area that needs improvement>"
          }
        ]
      }
    }`;

    // Get token count
    const tokenCount = await model.countTokens({
      generateContentRequest: {
        contents: [
          {
            role: "user",
            parts: [
              {
                fileData: {
                  fileUri: uploadResult.file.uri,
                  mimeType: uploadResult.file.mimeType,
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
      },
    });

    const transcriptions = await model.generateContent([
      prompt,
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const aiAnswer = transcriptions.response;
    const rawText = await aiAnswer.text();

    console.log("question ai got ==>", prompt);

    console.log("ai answer ==>", rawText);

    console.log("token count ===>", tokenCount.totalTokens);

    // Extract just the JSON part from the response
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from response");
    }

    const parsedResponse = JSON.parse(jsonMatch[0]);
    return {
      ...parsedResponse,
      tokensUsed: tokenCount.totalTokens,
    };
  } catch (error) {
    console.error("Error processing file", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error processing file",
      data: null,
    };
  }
}
