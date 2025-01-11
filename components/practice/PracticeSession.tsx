"use client";
import { Question } from "@/lib/types";
import React, { useEffect, useState } from "react";

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

  const currentQuestion = questions[currentQuestionIndex];


  useEffect(() => {
    console.log("Questions received:", questions);
    console.log("Current question:", currentQuestion);
    console.log("Category ID:", categoryId);
  }, [questions, currentQuestion, categoryId]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2>Question {currentQuestionIndex + 1}</h2>
        <p>{currentQuestion?.question_text}</p>
      </div>
    </div>
  );
};

export default PracticeSession;
