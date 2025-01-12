/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { transcribeUploadedFile } from "@/actions/upload-actions";
import { useCallback } from "react";

const schema = z.object({
  file: z
    .instanceof(File, { message: "Invalid file" })
    .refine(
      (file) => file.size <= 20 * 1024 * 1024,
      "File size must not exceed 20MB"
    )
    .refine(
      (file) =>
        file.type.startsWith("audio/") || file.type.startsWith("video/"),
      "File must be an audio or a video file"
    ),
});

export default function UploadForm() {
  const { toast } = useToast();

  const { startUpload, isUploading } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: (res) => {
      console.log("uploade compelted: ", res);
      toast({ title: "uploaded successfully!" });
    },
    onUploadError: (err) => {
      console.error("Error occurred", err);
      toast({
        title: "Upload failed",
        description: err.message,
        variant: "destructive",
      });
    },
    onUploadBegin: () => {
      toast({ title: "Upload has begun 🚀!" });
    },
  });

  // Handle Transcribe
  const handleTranscribe = useCallback(
    async (formData: FormData) => {
      try {
        const file = formData.get("file") as File;
        console.log("this is file", file);
        console.log("this is fileSchmea", schema);

        if (!file) {
          toast({
            title: "No file selected",
            variant: "destructive",
          });
          return;
        }

        const validatedFields = schema.safeParse({ file });

        if (!validatedFields.success) {
          console.log(
            "validatedFields",
            validatedFields.error.flatten().fieldErrors
          );
          toast({
            title: "✖️ something went wrong",
            variant: "destructive",
            description:
              validatedFields.error.flatten().fieldErrors.file?.[0] ??
              "Invalid file",
          });
        }

        if (file) {
          // upload the file to `uploadthing`
          const resp: any = await startUpload([file]);
          console.log("this is response from uploadthing: ", resp);

          if (!resp) {
            toast({
              title: "Something went wrong",
              description: "Please use a different file",
              variant: "destructive",
            });
            return;
          }

          toast({
            title: "🎤 Transcription is in progress...",
            description:
              "Hang tight! Our digital wizrads are sprinkling magic dust on your file! 🌟",
          });
          console.log("transcription in progress.....");

          // Call the server action
          const result = await transcribeUploadedFile(resp);

          // result looks like this :
          // answer from gemini {
          //   response: {
          //     candidates: [ [Object] ],
          //     usageMetadata: {
          //       promptTokenCount: 1002,
          //       candidatesTokenCount: 153,
          //       totalTokenCount: 1155
          //     },
          //     modelVersion: 'gemini-1.5-flash',
          //     text: [Function (anonymous)],
          //     functionCall: [Function (anonymous)],
          //     functionCalls: [Function (anonymous)]
          //   }
          // }

          const { data = null, message = null } = result || {};

          if (!result || (!data && !message)) {
            toast({
              title: "An unexpected error occured",
              description:
                "An error occured during transcription. Please try again",
            });
            return;
          }

          toast({
            title: "Transcription complete!",
            description: "Your file has been processed successfully",
          });
        }
      } catch (error) {
        console.error("Error in handleTranscribe:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, startUpload]
  );
  return (
    <form action={handleTranscribe} className="flex flex-col gap-6">
      <div className="flex justify-end items-center gap-1.5">
        <Input
          id="file"
          name="file"
          type="file"
          accept="audio/*, video/*"
          required
        />
        <Button className="bg-purple-600">Transcribe</Button>
      </div>
    </form>
  );
}
