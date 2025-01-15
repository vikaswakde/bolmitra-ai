"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, MessageSquare } from "lucide-react";

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
  const [speaking, setSpeaking] = useState<string | null>(null);

  const speak = (text: string, questionId: string) => {
    if (speaking === questionId) {
      window.speechSynthesis.cancel();
      setSpeaking(null);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    // Get available voices
    const voices = window.speechSynthesis.getVoices();
    // Try to find a female English voice
    const voice =
      voices.find((v) => v.lang.includes("en") && v.name.includes("Female")) ||
      voices[0];

    utterance.voice = voice;
    utterance.rate = 1; // Slightly slower for clarity
    utterance.pitch = 1.3;

    utterance.onend = () => setSpeaking(null);
    window.speechSynthesis.speak(utterance);
    setSpeaking(questionId);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Detailed Question Feedback</h3>
      {Object.entries(questionFeedback).map(([question, feedbacks]) => (
        <Card key={question} className="p-6">
          <div className="space-y-4">
            <h4 className="font-medium text-lg">{question}</h4>

            {feedbacks.map((feedback, index) => (
              <div key={index} className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    {feedback.timestamp}
                  </span>
                  <span className="font-medium text-lg">{feedback.score}%</span>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-blue-500 mt-1" />
                    <div>
                      <p className="font-medium">Feedback</p>
                      <p className="text-gray-600">{feedback.feedback}</p>
                    </div>
                  </div>

                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center mb-2">
                      <p className="font-medium">Improved Version</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          speak(feedback.improvedVersion || "", question)
                        }
                      >
                        {speaking === question ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-gray-600">{feedback.improvedVersion}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-3 border-t">
                    <div>
                      <p className="font-medium text-green-600">Key Strength</p>
                      <p className="text-sm text-gray-600">
                        {feedback.keyStrength}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium text-orange-600">Focus Area</p>
                      <p className="text-sm text-gray-600">
                        {feedback.focusArea}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
