"use client";
import { Question } from "@/lib/types";
import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";

interface PracticeSessionProps {
  questions: Question[];
  categoryId: string;
  userPlan: string;
}
const PracticeSession = ({
  questions,
  categoryId,
  userPlan,
}: PracticeSessionProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const handleRecordingComplete = async (audioUrl: string) => {
    try {
      setIsProcessing(true);

      toast({
        title: "Processing your response ",
        description: "This might take a few moments...⏳",
      });

      const response = await fetch("/api/responses/upload", {
        method: "POST",
        body: JSON.stringify({
          audioUrl,
          questionId: currentQuestion.id,
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
      <div className="mb-8 border-dotted decoration-dotted  border-2 rounded-2xl px-4 py-5 border-purple-500/80 shadow-lg">
        <h2 className="text-2xl font-bold mb-2 text-purple-700/70">
          Question {currentQuestionIndex + 1}
        </h2>
        <p className="text-lg text-gray-700 border  rounded-2xl px-5 py-3 shadow-md mt-5 border-purple-400/50 ">
          {currentQuestion?.question_text}
        </p>
      </div>

      <AudioRecorder
        onRecordingComplete={handleRecordingComplete}
        maxDuration={60}
        isDisabled={isProcessing}
      />

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
