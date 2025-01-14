"use client";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";
import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";
import AudioRecorder from "./AudioRecorder";

export interface QuestionSegment {
  questionId: string;
  startTime: number;
  endTime: number;
  questionText: string;
}
interface PracticeSessionProps {
  questions: Question[];
  categoryId: string;
  userPlan: string;
}
const PracticeSession = ({
  questions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  categoryId,
  userPlan,
}: PracticeSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [segments, setSegments] = useState<QuestionSegment[]>([]);
  const recordingStartTime = useRef<number | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [isPaused, setIsPaused] = useState(false);

  const currentQuestion = questions[currentQuestionIndex];

  const handleRecordingStart = () => {
    setIsRecording(true);
    recordingStartTime.current = Date.now();
    // Add first question segment
    setSegments([
      {
        questionId: questions[0].id,
        startTime: 0,
        endTime: 0,
        questionText: questions[0].question_text,
      },
    ]);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const currentTime = Date.now();
      const segmentTime =
        (currentTime - (recordingStartTime.current || currentTime)) / 1000;

      setSegments((prev) => {
        const updated = [...prev];
        if (updated[currentQuestionIndex]) {
          updated[currentQuestionIndex].endTime = segmentTime;
        }
        return [
          ...updated,
          {
            questionId: questions[currentQuestionIndex + 1].id,
            startTime: segmentTime,
            endTime: 0,
            questionText: questions[currentQuestionIndex + 1].question_text,
          },
        ];
      });

      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleRecordingComplete = async (audioUrl: string) => {
    try {
      setIsProcessing(true);

      // Update the end time of the last segment
      const currentTime = Date.now();
      const segmentTime =
        (currentTime - (recordingStartTime.current || currentTime)) / 1000;

      const finalSegments = segments.map((seg, index) =>
        index === currentQuestionIndex ? { ...seg, endTime: segmentTime } : seg
      );

      const response = await fetch("/api/responses/upload", {
        method: "POST",
        body: JSON.stringify({
          audioUrl,
          questionId: currentQuestion.id,
          segments: finalSegments, // Include segments in the API call
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        toast({
          title: "Upload Failed ",
          description: "Could not upload the voice. try again",
        });
      }

      const result = await response.json();

      if (result) {
        // Check if this is the last question
        if (currentQuestionIndex === questions.length - 1) {
          toast({
            title: "All questions completed! ✨",
            description: "Redirecting to your feedback...",
          });
          // Redirect to feedback page only after completing all questions
          router.push(`/feedback/${result.responseId}`);
        } else {
          // Move to next question
          setCurrentQuestionIndex((prev) => prev + 1);
          toast({
            title: "Response recorded ✓",
            description: "Moving to next question...",
          });
        }
      } else {
        throw new Error(result.error || "Failed to process recording");
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRecordingPause = () => {
    setIsPaused(true);
    handleNextQuestion();
  };

  const handleRecordingResume = () => {
    setIsPaused(false);
  };

  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {isProcessing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl flex items-center gap-4">
            <Loader2Icon className="w-6 h-6 animate-spin text-purple-600/90" />
            <p className="text-lg font-mono">Analyzing your response...</p>
          </div>
        </div>
      )}
      <div className="mb-8 border-dotted decoration-dotted border-2 rounded-2xl px-4 py-5 border-purple-500/80 shadow-lg relative">
        {isRecording && !isPaused && !isProcessing && (
          <div className="absolute -top-3 -right-2 backdrop-blur-xl bg-white/50 dark:bg-black/90 rounded-full px-4 py-1.5 shadow-lg flex items-center gap-2 transition-all duration-300 animate-in fade-in slide-in-from-top-2">
            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-500 font-medium text-sm">Recording</span>
          </div>
        )}

        <h2 className="text-2xl font-bold mb-2 text-purple-700/70">
          Question {currentQuestionIndex + 1} of {questions.length}
        </h2>
        <p className="text-lg text-gray-700 border rounded-2xl px-5 py-3 shadow-md mt-5 border-purple-400/50">
          {currentQuestion?.question_text}
        </p>
      </div>

      <div className="flex flex-col items-center gap-4">
        <AudioRecorder
          onRecordingComplete={handleRecordingComplete}
          onRecordingStart={handleRecordingStart}
          onRecordingPause={handleRecordingPause}
          onRecordingResume={handleRecordingResume}
          maxDuration={180}
          isDisabled={isProcessing}
          isLastQuestion={isLastQuestion}
          isPaused={isPaused}
        />

        {isRecording && !isPaused && (
          <p className="text-sm text-gray-500 mt-2">
            {isLastQuestion
              ? "Click 'Stop Session' when you're done to get your feedback"
              : "Click 'Done' when you're finished with this question"}
          </p>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
        {userPlan !== "free" && (
          <p className="border rounded-xl px-2 mt-2 border-purple-200/90">
            Free plan : {1 - currentQuestionIndex} questions remaining today
          </p>
        )}
      </div>
    </div>
  );
};

export default PracticeSession;
