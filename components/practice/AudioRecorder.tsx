"use client";
import React, { useRef, useState } from "react";
import Timer from "./Timer";
import { Button } from "../ui/button";
import { Loader2Icon, MicIcon, SquareIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AudioRecorderProps {
  onRecordingComplete: (blob: Blob) => void;
  maxDuration?: number; // in seconds;
}

const AudioRecorder = ({
  onRecordingComplete,
  maxDuration,
}: AudioRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>(null);

  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0 && chunksRef.current) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error Starting Recording",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setIsProcessing(true);
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleTimeEnd = () => {
    stopRecording();
  };

  return (
    <div className="space-y-4">
      {isRecording && (
        <Timer
          duration={maxDuration || 0}
          isRecording={isRecording}
          onTimeEnd={handleTimeEnd}
        />
      )}

      <div className="flex justify-center gap-2">
        {!isRecording ? (
          <Button
            onClick={startRecording}
            disabled={isProcessing}
            size={"lg"}
            className="gap-2 rounded-2xl bg-purple-700/70 hover:bg-purple-600/60 shadow-lg"
          >
            {isProcessing ? (
              <Loader2Icon className="w-4 h-4 animate-spin" />
            ) : (
              <MicIcon className="w-4 h-4" />
            )}
            {isProcessing ? "Processing..." : "Start Recording"}
          </Button>
        ) : (
          <Button
            onClick={stopRecording}
            variant="destructive"
            size={"lg"}
            className="gap-2 rounded-2xl shadow-sm border border-purple-500/10"
          >
            <SquareIcon className="w-4 h-4" />
            Stop Recording
          </Button>
        )}
      </div>
    </div>
  );
};

export default AudioRecorder;
