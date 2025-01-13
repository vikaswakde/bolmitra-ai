/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useToast } from "@/hooks/use-toast";
import { useUploadThing } from "@/utils/uploadthing";
import { Loader2Icon, MicIcon, SquareIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "../ui/button";
import Timer from "./Timer";

interface AudioRecorderProps {
  onRecordingComplete: (audioUrl: string) => void;
  onRecordingStart: () => void;
  maxDuration?: number;
  isDisabled?: boolean;
  isLastQuestion: boolean;
}

export default function AudioRecorder({
  onRecordingComplete,
  onRecordingStart,
  maxDuration = 60,
  isDisabled,
  isLastQuestion,
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const { startUpload } = useUploadThing("audioUploader");

  const handleUpload = async (audioBlob: Blob) => {
    try {
      setIsProcessing(true);

      // Convert blob to File object
      const file = new File([audioBlob], "recording.webm", {
        type: "audio/webm",
      });

      const uploadResponse = await startUpload([file]);

      if (!uploadResponse?.[0]?.url) {
        throw new Error("Upload failed");
      }

      onRecordingComplete(uploadResponse[0].url);
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Error uploading audio",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const startSession = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      onRecordingStart();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast({
        title: "Error Starting Session",
        description: "Failed to access microphone",
        variant: "destructive",
      });
    }
  };

  const stopSession = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        handleUpload(audioBlob);
      };
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center gap-2">
        {!isRecording ? (
          <Button
            onClick={startSession}
            disabled={isProcessing || isDisabled}
            size="lg"
            className="gap-2 rounded-2xl bg-purple-700/70 hover:bg-purple-600/60 shadow-lg"
          >
            {isProcessing ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <MicIcon className="w-4 h-4" />
            )}
            {isProcessing ? "Processing..." : "Start Session"}
          </Button>
        ) : (
          isLastQuestion && (
            <Button
              onClick={stopSession}
              variant="destructive"
              size="lg"
              className="gap-2 rounded-2xl shadow-sm border border-purple-500/10"
            >
              <SquareIcon className="w-4 h-4" />
              Stop Session
            </Button>
          )
        )}
      </div>
    </div>
  );
}
