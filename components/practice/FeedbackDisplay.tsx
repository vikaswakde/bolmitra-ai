"use client";

interface FeedbackDisplayProps {
  feedback: {
    id: string;
    user_id: string;
    question_id: string;
    audio_url: string;
    overall_score: number;
    feedback_json: {
      tips: string[];
      strengths: string[];
      improvements: string[];
    };
    metrics: {
      clarity: number;
      relevance: number;
      structure: number;
      confidence: number;
    };
    created_at: string;
    tokens_used: number;
    question_text: string;
    category_name: string;
  };
}

export default function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  console.log("this is feedback", feedback);

  // Calculate costs based on tokens used (Gemini API pricing)
  const calculateCosts = () => {
    if (!feedback.tokens_used) return null;

    // Cost in USD (assuming $0.00001 per token)
    const usdCost = feedback.tokens_used * 0.00001;

    // Convert to INR (approximate exchange rate 1 USD = 83 INR)
    const inrCost = usdCost * 83;

    return {
      usd: usdCost.toFixed(6),
      inr: inrCost.toFixed(6),
    };
  };

  const costs = calculateCosts();

  return (
    <div className="space-y-6 p-6 border rounded-lg">
      <div className="text-center">
        <h3 className="text-2xl font-bold">Overall Score</h3>
        <div className="text-4xl font-bold text-purple-600">
          {feedback.overall_score}%{/* {feedback.overall_score} */}
          {/* {typeof feedback.overall_score} */}
        </div>
        {feedback.tokens_used && (
          <div className="mt-2 text-sm text-gray-600">
            <p>Tokens Used: {feedback.tokens_used}</p>
            <p>
              Cost: ${costs?.usd} / ₹{costs?.inr}
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {Object.entries(feedback.metrics).map(([key, value]) => (
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
            {feedback.feedback_json.strengths.map((strength, i) => (
              <li key={i}>{strength}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-amber-600">Areas for Improvement</h4>
          <ul className="list-disc pl-5 space-y-1">
            {feedback.feedback_json.improvements.map((improvement, i) => (
              <li key={i}>{improvement}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-blue-600">Tips</h4>
          <ul className="list-disc pl-5 space-y-1">
            {feedback.feedback_json.tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
