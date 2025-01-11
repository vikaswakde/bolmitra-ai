"use client";
import React, { useEffect, useState } from "react";
import { Progress } from "../ui/progress";

interface TimerProps {
  duration: number; // inseconds
  isRecording: boolean;
  onTimeEnd: () => void;
}

const Timer = ({ duration, isRecording, onTimeEnd }: TimerProps) => {
  const [timeleft, setTimeLeft] = useState(duration);
  const progress = ((duration - timeleft) / duration) * 100;

  useEffect(() => {
    if (!isRecording) {
      setTimeLeft(duration);
      return;
    }
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeEnd();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRecording, duration, onTimeEnd]);

  return (
    <div className="w-full space-y-2">
      <Progress value={progress} className="h-2 " />
      <p className="text-center text-sm text-gray-500">
        {timeleft} seconds remaing
      </p>
    </div>
  );
};

export default Timer;
