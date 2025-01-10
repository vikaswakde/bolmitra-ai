"use server";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import path from "path";
import fs from "fs/promises";

const fileManager = new GoogleAIFileManager(process.env.GOOGLE_API_KEY!);

/* eslint-disable @typescript-eslint/no-explicit-any */
export async function transcribeUploadedFile(res: any) {
  console.log("Reacived response in transcribe: ", res);

  if (!res) {
    return {
      success: false,
      message: "File upload failed",
      data: null,
    };
  }

  const {
    url: fileUrl,
    serverData: { userId },
  } = res[0];

  try {

    const mediaPath = path.join(process.cwd(), "public", "media");
    await fs.mkdir(mediaPath, { recursive: true });

    // Download file from Uploadthing
    const response = await fetch(fileUrl);
    const arrayBuffer = await response.arrayBuffer();

    // Save to local media directory
    const fileName = `uploa-${Date.now()}.mp3`;
    const filePath = path.join(mediaPath, fileName);
    await fs.writeFile(filePath, Buffer.from(arrayBuffer));

    console.log("this is local file path", filePath);

    // Now use the local path with Google AI

    const uploadResult = await fileManager.uploadFile(filePath, {
      mimeType: "audio/mp3",
      displayName: "Audio sample",
    });

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
    await fs.unlink(filePath);
    

    // View the response;
    console.log(
      `Uploaded file ${uploadResult.file.displayName} as ${uploadResult.file.uri}`
    );

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const transcriptions = await model.generateContent([
      "Tell me about this audio clip",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    const aiAnswer = transcriptions.response.text()

    console.log("answer from gemini", transcriptions.response.text());

    return {
      success: true,
      message: "file transcribed successfully",
      data: { aiAnswer, userId },
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
