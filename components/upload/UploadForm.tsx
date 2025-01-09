"use client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { z } from "zod";
import { useUploadThing } from "@/utils/uploadthing";
import { useEffect, useState } from "react";

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

  //   useUploadThing
  const { startUpload, isUploading } = useUploadThing("videoOrAudioUploader", {
    onClientUploadComplete: () => {
      toast({
        title: "Uploaded Successfully 😃",
      });
    },
    onUploadError: (error) => {
      toast({
        title: "error occured while uploading",
      });
      console.error("Error occured", error);
    },
    onUploadBegin() {
      toast({
        title: `Upload has begun 🚀`,
      });
    },
  });

  // Handle Transcribe
  const handleTranscribe = async (formData: FormData) => {
    const file = formData.get("file") as File;
    console.log("this is file", file);
    console.log("this is fileSchmea", schema);
    if (!schema) return;

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
      console.log("this is response from uploadthing: ", { resp });
    }
  };

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
