import { Client } from "@gradio/client";

interface HuggingFaceRequest {
  type: "huggingface";
  modelUrl: string;
  improvedText: string;
}

interface GradioRequest {
  type: "gradio";
  text: string;
  speaker?: string;
  speed?: number;
  language?: string;
}

export async function POST(request: Request): Promise<Response> {
  try {
    console.log("API: Starting request processing");
    const requestBody = (await request.json()) as
      | HuggingFaceRequest
      | GradioRequest;
    console.log("API: Request body:", JSON.stringify(requestBody, null, 2));

    if (requestBody.type === "huggingface") {
      console.log("API: Processing Hugging Face request");
      return await handleHuggingFaceRequest(requestBody);
    } else if (requestBody.type === "gradio") {
      console.log("API: Processing Gradio request");
      return await handleGradioRequest(requestBody);
    } else {
      throw new Error("Invalid request type");
    }
  } catch (error) {
    console.error("API Error:", error);
    console.error("API Error Stack:", (error as Error).stack);
    return new Response(
      JSON.stringify({
        error: (error as Error).message,
        stack: (error as Error).stack,
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

async function handleHuggingFaceRequest(
  requestBody: HuggingFaceRequest
): Promise<Response> {
  console.log("API: Handling Hugging Face request");

  if (!requestBody.modelUrl || !requestBody.improvedText) {
    console.error("API: Missing required fields:", {
      modelUrl: !!requestBody.modelUrl,
      improvedText: !!requestBody.improvedText,
    });
    throw new Error("Missing required fields in request body");
  }

  if (!process.env.HUGGING_FACE_TOKEN) {
    console.error("API: Missing Hugging Face token");
    throw new Error("Missing hugging face token");
  }

  console.log("API: Sending request to Hugging Face");
  const response = await fetch(requestBody.modelUrl, {
    headers: {
      Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ inputs: requestBody.improvedText }),
  });

  console.log("API: Hugging Face response status:", response.status);
  if (!response.ok) {
    const errorText = await response.text();
    console.error("API: Hugging Face error:", errorText);
    throw new Error(`Hugging Face API failed: ${errorText}`);
  }

  const audioData = await response.arrayBuffer();
  console.log("API: Audio data size:", audioData.byteLength);

  return new Response(audioData, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}

async function handleGradioRequest(
  requestBody: GradioRequest
): Promise<Response> {
  try {
    console.log("API: Handling Gradio request");

    // Initialize client with auth token
    const hfToken = process.env.HUGGING_FACE_TOKEN as `hf_${string}`; // Type assertion to match expected type
    const client = await Client.connect("mrfakename/MeloTTS", {
      hf_token: hfToken,
    });

    const result = await client.predict("/synthesize", [
      requestBody.text,
      requestBody.speaker || "EN-US",
      requestBody.speed || 1,
      requestBody.language || "EN",
    ]);

    console.log("API: Raw result from Gradio:", result);

    if (
      !result.data ||
      !Array.isArray(result.data) ||
      result.data.length === 0
    ) {
      throw new Error("No audio data received from Gradio");
    }
    const audioData = result.data[0];

    // If the response is a blob/file object
    if (typeof audioData === "object" && "data" in audioData) {
      return new Response(audioData.data, {
        headers: {
          "Content-Type": "audio/wav",
        },
      });
    }

    // If it's a URL, fetch it with authentication
    if (typeof audioData === "object" && "url" in audioData) {
      const audioUrl = audioData.url as string;
      const audioResponse = await fetch(audioUrl, {
        headers: {
          Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN}`,
          Cookie: `token=${process.env.HUGGING_FACE_TOKEN}`,
        },
      });

      if (!audioResponse.ok) {
        throw new Error(`Failed to fetch audio: ${audioResponse.statusText}`);
      }

      const audioBuffer = await audioResponse.arrayBuffer();
      return new Response(audioBuffer, {
        headers: {
          "Content-Type": "audio/wav",
          "Content-Length": audioBuffer.byteLength.toString(),
        },
      });
    }

    throw new Error(`Invalid response format from Gradio`);
  } catch (error) {
    console.error("API: Gradio error:", error);
    throw new Error(`Gradio synthesis failed: ${(error as Error).message}`);
  }
}
