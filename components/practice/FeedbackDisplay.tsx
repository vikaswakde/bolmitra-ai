"use client";

interface FeedbackDisplayProps {
  feedback: {
    overallScore: number;
    feedback: {
      strengths: string[];
      improvements: string[];
      tips: string[];
    };
    metrics: {
      clarity: number;
      confidence: number;
      relevance: number;
      structure: number;
    };
  };
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Overall Score</h3>
        <div className="text-4xl font-bold text-purple-600">
          {/* {feedback.overallScore}% */}
          6.9%
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* {Object.entries(feedback.metrics).map(([key, value]) => (
          <div key={key} className="text-center">
            <h4 className="text-sm font-medium capitalize">{key}</h4>
            <div className="text-lg font-semibold">{value}%</div>
          </div>
        ))} */}
        {Object.entries({
          clarity: 75,
          confidence: 80,
          relevance: 90,
          structure: 85,
        }).map(([key, value]) => (
          <div key={key} className="text-center">
            <h4 className="text-sm font-medium capitalize">{key}</h4>
            <div className="text-lg font-semibold">{value}%</div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-green-600">Strengths</h4>
          <ul className="list-disc pl-5 space-y-1">
            {/* {feedback.feedback.strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))} */}
            <li>Excellent use of vocabulary</li>
            <li>Clear and concise explanations</li>
            <li>Engaging presentation style</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-amber-600">Areas for Improvement</h4>
          <ul className="list-disc pl-5 space-y-1">
            {/* {feedback.feedback.improvements.map((improvement, i) => (
              <li key={i}>{improvement}</li>
            ))} */}
            <li>Practice speaking more clearly</li>
            <li>Work on pacing during responses</li>
            <li>Incorporate more examples in explanations</li>
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-blue-600">Tips</h4>
          <ul className="list-disc pl-5 space-y-1">
            {/* {feedback.feedback.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))} */}
            <li>Practice regularly to improve fluency</li>
            <li>Listen to native speakers for better pronunciation</li>
            <li>Use varied vocabulary to enhance expression</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
