"use client";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/lib/types";
import { Loader2Icon, MicIcon, AlertCircle, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import AudioRecorder from "./AudioRecorder";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "../ui/progress";

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
  const [progress, setProgress] = useState(0);
  const [showTip, setShowTip] = useState(true);

  const currentQuestion = questions[currentQuestionIndex];

  useEffect(() => {
    setProgress((currentQuestionIndex / questions.length) * 100);
  }, [currentQuestionIndex, questions.length]);

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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Processing Overlay */}
      <AnimatePresence>
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white p-8 rounded-2xl shadow-2xl"
            >
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-purple-100 rounded-full animate-ping" />
                  <Loader2Icon className="w-12 h-12 text-purple-600 animate-spin relative z-10" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold mb-2">
                    AI Analysis in Progress
                  </h3>
                  <p className="text-gray-600">
                    Our AI is carefully analyzing your responses...
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative bg-white rounded-2xl border border-purple-200 shadow-lg overflow-hidden"
      >
        {/* Recording Indicator */}
        <AnimatePresence>
          {isRecording && !isPaused && !isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 bg-red-50 border border-red-200 rounded-full px-4 py-1.5 flex items-center gap-2"
            >
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-red-600 font-medium text-sm">
                Recording
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-2 rounded-lg">
              <MicIcon className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
          </div>

          <p className="text-lg text-gray-700 bg-purple-50/50 rounded-xl p-6 border border-purple-100">
            {currentQuestion?.question_text}
          </p>
        </div>
      </motion.div>

      {/* Tips Card */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 rounded-xl p-6 border border-blue-200"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-blue-700 mb-2">Quick Tips</h3>
                <ul className="text-blue-600 space-y-2 text-sm">
                  <li>• Speak clearly and at a natural pace</li>
                  <li>
                    • Take a moment to gather your thoughts before starting
                  </li>
                  <li>• You can pause between questions if needed</li>
                </ul>
              </div>
              <button
                onClick={() => setShowTip(false)}
                className="text-blue-500 hover:text-blue-600"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Audio Recorder */}
      <div className="flex flex-col items-center gap-6">
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

        {/* Status Messages */}
        <AnimatePresence>
          {isRecording && !isPaused && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-sm text-gray-600 flex items-center gap-2"
            >
              {isLastQuestion ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  Click &apos;Stop Session&apos; when you&apos;re done
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  Click &apos;Done when you&apos;re finished with this question
                </>
              )}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Plan Info */}
      {userPlan === "free" && (
        <div className="text-center">
          <p className="inline-block bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm border border-purple-200">
            Free Plan: {questions.length - currentQuestionIndex} questions
            remaining today
          </p>
        </div>
      )}
    </div>
  );
};

export default PracticeSession;
