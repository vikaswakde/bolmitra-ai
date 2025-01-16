export async function POST(request: Request): Promise<Response> {
  // Parse the JSON payload from the request body
  const requestBody = await request.json();

  console.log("this is requestbody =>", requestBody);

  //   Check if the 'modelUrl' filed is provided in the request body
  if (!requestBody.modelUrl) {
    throw new Error("Missing modelUrl field in the request body");
  }

  // Check if the 'improvedText' field is proived in the request body
  if (!requestBody.improvedText) {
    throw new Error("Missing 'improved text' field in the request body");
  }

  // check if huggin face api key
  if (!process.env.HUGGING_FACE_TOKEN) {
    throw new Error("Missing hugging face token");
  }

  //   Extract the 'modelUrl' and 'improvedText' from the request body
  const modelUrl = requestBody.modelUrl;
  const input = requestBody.improvedText;

  //   Make a post request to the specified 'modelUrl' using the Hugging face token for auth
  const response = await fetch(modelUrl, {
    headers: {
      Authorization: `Bearer ${process.env.HUGGING_FACE_TOKEN!}`,
      "Content-Type": "application/json",
    },
    method: "POST",
    body: JSON.stringify({ inputs: input }),
  });

  //   Get the generated audio data as an ArrayBuffer
  const audioData = await response.arrayBuffer();

  console.log("this is audioData to send to client =>", audioData);

  // check if the HTTP response is not successfull
  if (!response.ok) {
    throw new Error("Request failed");
  }

  //   Create an HTTP response with the generated audio data
  return new Response(audioData, {
    headers: {
      "Content-Type": "audio/mpeg", // adjust content type based on actual audio format
    },
  });
}
