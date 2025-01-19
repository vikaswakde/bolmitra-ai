"use client";

import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SOUND_MODELS, SoundModel } from "@/lib/sound-models";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  ClockIcon,
  MessageSquare,
  StarIcon,
  TargetIcon,
  ThumbsUpIcon,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState } from "react";

interface QuestionFeedbackProps {
  questionFeedback: {
    [key: string]: {
      timestamp?: string;
      score?: number;
      feedback?: string;
      improvedVersion?: string;
      keyStrength?: string;
      focusArea?: string;
    }[];
  };
}

export function QuestionFeedback({ questionFeedback }: QuestionFeedbackProps) {
  const { toast } = useToast();
  const [speaking, setSpeaking] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null
  );
  const [selectedModel, setSelectedModel] = useState<SoundModel>(
    SOUND_MODELS[0]
  );

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.addEventListener("ended", () => {
      setSpeaking(null);
      toast({
        title: "Finished playing audio",
      });
    });
    audio.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      toast({
        title: "Failed to play audio try differnt model",
        variant: "destructive",
      });
      setSpeaking(null);
    });
    setAudioElement(audio);

    // Cleanup
    return () => {
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      audio.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateAndPlayAudio = async (text: string, questionId: string) => {
    if (speaking === questionId && audioElement) {
      audioElement.pause();
      setSpeaking(null);
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, [questionId]: true }));
      console.log(
        "Frontend: Starting audio generation for model:",
        selectedModel
      );

      const requestBody =
        // @ts-expect-error soon adding hugginface tts
        selectedModel.type === "huggingface"
          ? {
              type: "huggingface",
              improvedText: text,
              modelUrl: selectedModel.url,
            }
          : {
              type: "gradio",
              text: text,
              language: selectedModel.defaultLanguage,
              speaker: selectedModel.defaultSpeaker,
            };

      console.log("Frontend: Sending request with body:", requestBody);

      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      console.log("Frontend: Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Frontend: API Error:", errorData);
        throw new Error(errorData.error || "Failed to generate audio");
      }

      const audioData = await response.arrayBuffer();
      console.log("Frontend: Received audio data size:", audioData.byteLength);

      if (audioData.byteLength === 0) {
        throw new Error("Received empty audio data");
      }

      // Use the correct MIME type based on the model type
      const mimeType =
        // @ts-expect-error we will add hugginface soon
        selectedModel.type === "huggingface" ? "audio/mpeg" : "audio/wav";
      const blob = new Blob([audioData], { type: mimeType });
      const newAudioUrl = URL.createObjectURL(blob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(newAudioUrl);

      if (audioElement) {
        audioElement.src = newAudioUrl;
        await audioElement.play();
        setSpeaking(questionId);
        toast({ title: "Playing audio" });
      }
    } catch (error) {
      console.error("Frontend: Error in generateAndPlayAudio:", error);
      toast({
        title: `Audio generation failed: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  return (
    <div className="space-y-[2rem] md:space-y-[4rem] w-full md:w-fit">
      {/* Voice Model Selector */}
      <div className="bg-purple-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 shadow-sm mb-4 md:mb-6 w-full md:w-fit static md:absolute md:top-0 md:right-0">
        <div className="flex flex-col justify-center items-start gap-3 md:gap-4">
          <h4 className="text-lg md:text-xl font-medium text-black/70">
            Voice Model
          </h4>
          <div className="w-full">
            <Select
              value={selectedModel.url}
              onValueChange={(url) =>
                setSelectedModel(SOUND_MODELS.find((m) => m.url === url)!)
              }
            >
              <SelectTrigger className="bg-white/90 hover:bg-gray-100 border-purple-200">
                <SelectValue placeholder="Select voice model" />
              </SelectTrigger>
              <SelectContent>
                {SOUND_MODELS.map((model) => (
                  <SelectItem key={model.url} value={model.url}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 md:gap-6 px-3 md:px-4 py-3 md:py-4 border-t">
        {Object.entries(questionFeedback).map(
          ([question, feedbacks], qIndex) => (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
              className="relative"
            >
              {/* Question Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-xl md:rounded-2xl shadow-md border border-purple-100 p-4 md:p-6 relative overflow-hidden h-full"
              >
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-gradient-to-bl from-purple-50 to-transparent rounded-bl-full opacity-50" />
                <div className="absolute bottom-0 left-0 w-16 md:w-24 h-16 md:h-24 bg-gradient-to-tr from-purple-50 to-transparent rounded-tr-full opacity-30" />

                {/* Question header */}
                <div className="relative z-10 mb-4 md:mb-6 border-b border-purple-100 pb-3 md:pb-4">
                  <h4 className="text-lg md:text-xl font-medium text-purple-800">
                    {question}
                  </h4>
                </div>

                {/* Feedback items */}
                <div className="space-y-4 md:space-y-6 relative z-10">
                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: qIndex * 0.1 + index * 0.05 }}
                      className="space-y-3 md:space-y-4"
                    >
                      {/* Time and Score Card */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 bg-gradient-to-r from-purple-50/80 to-purple-50/20 p-3 md:p-4 rounded-lg md:rounded-xl border border-purple-100">
                        <div className="flex items-center gap-2 md:gap-3">
                          <div className="bg-white p-1.5 md:p-2 rounded-lg shadow-sm">
                            <ClockIcon className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                          </div>
                          <span className="text-xs md:text-sm text-gray-600">
                            You took:{" "}
                            <span className="font-medium text-purple-700">
                              {feedback.timestamp &&
                                (() => {
                                  const [start, end] = feedback.timestamp
                                    .split("-")
                                    .map((t) =>
                                      parseFloat(t.replace("s", "").trim())
                                    );
                                  if (isNaN(start) || isNaN(end)) return "0s";
                                  const durationInSeconds = end - start;
                                  const minutes = Math.floor(
                                    durationInSeconds / 60
                                  );
                                  const seconds = Math.round(
                                    durationInSeconds % 60
                                  );
                                  return `${
                                    minutes > 0 ? `${minutes}m ` : ""
                                  }${seconds}s`;
                                })()}
                            </span>
                          </span>
                        </div>
                        <div
                          className={cn(
                            "px-3 md:px-4 py-1.5 md:py-2 rounded-lg font-medium text-sm md:text-base",
                            (feedback?.score || 0) >= 70 &&
                              "bg-green-100 text-green-700",
                            (feedback?.score || 0) >= 50 &&
                              (feedback?.score || 0) < 70 &&
                              "bg-amber-100 text-amber-700",
                            (feedback?.score || 0) < 50 &&
                              "bg-red-100 text-red-700"
                          )}
                        >
                          Score: {feedback.score}%
                        </div>
                      </div>

                      {/* Feedback Content */}
                      <div className="bg-white rounded-lg md:rounded-xl border border-purple-100 p-4 md:p-6 space-y-4 md:space-y-6 hover:shadow-md transition-all duration-300">
                        {/* Feedback Section */}
                        <div className="space-y-2 md:space-y-3">
                          <div className="flex items-center gap-2 text-purple-700 font-medium">
                            <MessageSquare className="w-4 h-4 md:w-5 md:h-5" />
                            <h5 className="text-sm md:text-base">Feedback</h5>
                          </div>
                          <p className="text-sm md:text-base text-gray-700 pl-6 md:pl-7">
                            {feedback.feedback}
                          </p>
                        </div>

                        {/* Improved Version */}
                        <div className="space-y-4 md:space-y-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-green-700 font-medium">
                              <StarIcon className="w-4 h-4 md:w-5 md:h-5" />
                              <h5 className="text-sm md:text-base">
                                Improved Version
                              </h5>
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                generateAndPlayAudio(
                                  feedback.improvedVersion || "",
                                  question
                                )
                              }
                              disabled={isLoading[question]}
                              className="rounded-lg md:rounded-xl border-purple-200 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              {isLoading[question] ? (
                                <div className="flex items-center gap-2">
                                  <span className="animate-spin">⏳</span>
                                  <span className="text-xs">Generating...</span>
                                </div>
                              ) : speaking === question ? (
                                <div className="flex items-center gap-2">
                                  <VolumeX className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
                                  <span className="text-xs">Stop</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Volume2 className="w-3 h-3 md:w-4 md:h-4" />
                                  <span className="text-xs">Play</span>
                                </div>
                              )}
                            </Button>
                          </div>
                          <div className="relative group">
                            <div className="absolute inset-0 bg-gradient-to-r from-green-100/20 to-green-50/10 rounded-lg md:rounded-xl blur opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative bg-white/80 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-xl border border-green-100">
                              <p className="text-sm md:text-base text-gray-700">
                                {feedback.improvedVersion}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Key Points */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 pt-2">
                          {/* Key Strength */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-blue-700 font-medium">
                              <ThumbsUpIcon className="w-3 h-3 md:w-4 md:h-4" />
                              <h5 className="text-xs md:text-sm">
                                Key Strength
                              </h5>
                            </div>
                            <div className="bg-blue-50/50 p-2 md:p-3 rounded-lg border border-blue-100">
                              <p className="text-xs md:text-sm text-gray-700">
                                {feedback.keyStrength}
                              </p>
                            </div>
                          </div>

                          {/* Focus Area */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-amber-700 font-medium">
                              <TargetIcon className="w-3 h-3 md:w-4 md:h-4" />
                              <h5 className="text-xs md:text-sm">Focus Area</h5>
                            </div>
                            <div className="bg-amber-50/50 p-2 md:p-3 rounded-lg border border-amber-100">
                              <p className="text-xs md:text-sm text-gray-700">
                                {feedback.focusArea}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
