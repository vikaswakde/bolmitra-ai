"use client";
import { Question } from "@/lib/types";
import { useState } from "react";
import AudioRecorder from "./AudioRecorder";
import { useToast } from "@/hooks/use-toast";
import FeedbackDisplay from "./FeedbackDisplay";

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
  const [feedback, setFeedback] = useState<any>(null);

  const { toast } = useToast();

  const currentQuestion = questions[currentQuestionIndex];

  const handleRecordingComplete = async (audioUrl: string) => {
    try {
      setIsProcessing(true);

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
        throw new Error("Failed to upload recording");
      }

      const result = await response.json();
      setFeedback(result.feedback);

      toast({
        title: "Recording uploaded successfully",
      });

      // Move to next question if available
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex((prev) => prev + 1);
      }
    } catch (error) {
      console.error("Error uploading recording:", error);
      toast({
        title: `Error Uploading Recording: ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
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
      />

      {!feedback && <FeedbackDisplay feedback={feedback} />}

      <div className="mt-4 text-center text-sm text-gray-500 flex items-center justify-center">
        {userPlan !== "free" && (
          <p className="border rounded-xl px-2 mt-2 border-purple-200/90">
            Free plan : {3 - currentQuestionIndex} questions remaining today
          </p>
        )}
      </div>
    </div>
  );
};

export default PracticeSession;
