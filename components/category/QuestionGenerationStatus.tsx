"use client";

import { Loader2 } from "lucide-react";

interface QuestionGenerationStatusProps {
  status: "generating" | "success" | "error";
  message?: string;
}

export function QuestionGenerationStatus({ status, message }: QuestionGenerationStatusProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      {status === "generating" && (
        <>
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">
            Generating your custom questions...
          </p>
        </>
      )}

      {status === "success" && (
        <div className="text-center space-y-2">
          <p className="text-green-600 font-medium">
            Questions generated successfully!
          </p>
          <p className="text-sm text-muted-foreground">
            You can now start practicing with your custom questions.
          </p>
        </div>
      )}

      {status === "error" && (
        <div className="text-center space-y-2">
          <p className="text-red-600 font-medium">
            Error generating questions
          </p>
          <p className="text-sm text-muted-foreground">
            {message || "Please try again later."}
          </p>
        </div>
      )}
    </div>
  );
} 