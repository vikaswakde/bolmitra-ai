"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { SOUND_MODELS } from "@/lib/sound-models";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MessageSquare, Volume2, VolumeX } from "lucide-react";
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
  const [selectedModel, setSelectedModel] = useState(SOUND_MODELS[0].url);

  useEffect(() => {
    // Initialize audio element
    const audio = new Audio();
    audio.addEventListener("ended", () => {
      setSpeaking(null);
      // toast{("Finished playing audio");
      toast({
        title: "Finished playing audio",
      });
    });
    audio.addEventListener("error", (e) => {
      console.error("Audio playback error:", e);
      // toast("Failed to play audio");
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
  }, []);

  const generateAndPlayAudio = async (text: string, questionId: string) => {
    if (speaking === questionId && audioElement) {
      audioElement.pause();
      setSpeaking(null);
      return;
    }

    try {
      setIsLoading((prev) => ({ ...prev, [questionId]: true }));
      toast({
        title: "Generating audio...",
      });

      console.log("Sending request for text:", text);
      const response = await fetch("/api/generate-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          improvedText: text,
          modelUrl: selectedModel,
        }),
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText);
        // throw new Error(`Failed to fetch audio data: ${errorText}`);
        toast({
          title: "Failed to fetch audio, try different model",
          variant: "destructive",
        });
      }

      const audioData = await response.arrayBuffer();
      console.log("Received audio data size:", audioData.byteLength);

      if (audioData.byteLength === 0) {
        throw new Error("Received empty audio data");
      }

      const blob = new Blob([audioData], { type: "audio/mpeg" });
      const newAudioUrl = URL.createObjectURL(blob);

      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }

      setAudioUrl(newAudioUrl);

      if (audioElement) {
        audioElement.src = newAudioUrl;
        const playPromise = audioElement.play();
        if (playPromise) {
          playPromise
            .then(() => {
              setSpeaking(questionId);
              toast({
                title: "Playing audio",
              });
            })
            .catch((error) => {
              console.error("Playback error:", error);
              toast({
                title: "Faield to paly audio",
              });
            });
        }
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    } finally {
      setIsLoading((prev) => ({ ...prev, [questionId]: false }));
    }
  };

  return (
    <div className="space-y-[7rem]">
      {/* Voice Model Selector */}
      <div className="bg-purple-50 p-6 rounded-2xl w-fit absolute top-0 right-0 border border-gray-200 ">
        <div className="flex flex-col sm:flex-col justify-center items-start sm:items-end gap-4">
          <h4 className="text-xl font-medium text-black/70">Voice Model</h4>
          <div className="w-full sm:w-64">
            <Select value={selectedModel} onValueChange={setSelectedModel}>
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

      {/* Questions Grid */}
      <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {Object.entries(questionFeedback).map(
          ([question, feedbacks], qIndex) => (
            <motion.div
              key={question}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: qIndex * 0.1 }}
            >
              <Card className="p-6 rounded-2xl shadow-inner bg-white/90 backdrop-blur-sm border border-l my-4 ">
                <div className="space-y-6 border-b rounded-2xl">
                  <h4 className="text-xl font-medium text-purple-800">
                    {question}
                  </h4>

                  {feedbacks.map((feedback, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: qIndex * 0.1 + index * 0.05 }}
                      className="space-y-8 border-t border-dashed rounded-2xl"
                    >
                      <div className="flex justify-between items-center bg-purple-50/50 p-4 rounded-xl border-l border-dashed border-r">
                        <span className="text-sm text-gray-500">
                          <span>You took</span>{" "}
                          <span className="font-semibold px-1">
                            {feedback.timestamp &&
                              (() => {
                                const [start, end] = feedback.timestamp
                                  .split(" - ")
                                  .map((t) => parseFloat(t.replace("s", "")));
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
                          </span>{" "}
                          to answer the question.
                        </span>
                        <span
                          className={cn(
                            "font-medium text-lg text-green-500",
                            (feedback?.score ?? 0) < 50 && "text-red-500"
                          )}
                        >
                          {feedback.score}%
                        </span>
                      </div>
                      <div className="bg-white/80  rounded-2xl  px-2 py-2 border-t border-b">
                        <p className="font-medium text-lg text-purple-600">
                          Feedback
                        </p>
                        <div className="flex items-start gap-3">
                          <MessageSquare className="w-5 h-5 text-blue-500 mt-1 opacity-80" />
                          <div>
                            <p className="text-gray-700 py-3">
                              {feedback.feedback}
                            </p>
                          </div>
                        </div>

                        <div className="pt-1 py-2 rounded-2xl mb-2 ">
                          <div className="flex justify-between items-center mb-4 py-1">
                            <p className="text-lg font-medium text-purple-700/90">
                              Improved Version
                            </p>
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
                              className="rounded-xl border-purple-200 shadow-sm hover:shadow-md transition-all duration-300"
                            >
                              {isLoading[question] ? (
                                <div className="flex items-center gap-2">
                                  <span className="animate-spin">⏳</span>
                                  <span className="text-xs">
                                    Generating with{" "}
                                    {
                                      SOUND_MODELS.find(
                                        (m) => m.url === selectedModel
                                      )?.name
                                    }
                                    ...
                                  </span>
                                </div>
                              ) : speaking === question ? (
                                <div className="flex items-center gap-2">
                                  <VolumeX className="w-4 h-4 text-gray-400" />
                                  <span className="text-xs">Stop</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Volume2 className="w-4 h-4" />
                                  <span className="text-xs">Play</span>
                                </div>
                              )}
                            </Button>
                          </div>
                          <p className="text-gray-600 py-1 rounded-2xl px-2 ">
                            {feedback.improvedVersion}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-6 pt-4 border-t border-purple-200 py-2 rounded-lg px-2 border-dashed">
                          <div>
                            <p className="font-medium text-green-600/90">
                              Key Strength
                            </p>
                            <p className="text-sm text-gray-600 px-2 py-1">
                              {feedback.keyStrength}
                            </p>
                          </div>
                          <div>
                            <p className="font-medium text-red-600">
                              Focus Area
                            </p>
                            <p className="text-sm text-gray-600 px-2 py-1">
                              {feedback.focusArea}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          )
        )}
      </div>
    </div>
  );
}
