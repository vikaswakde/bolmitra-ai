/* eslint-disable @typescript-eslint/no-explicit-any */
export interface Category {
  id: string;
  name: string;
  description: string;
  created_at: string;
}

export interface Question {
  id: string;
  category_id: string;
  question_text: string;
  difficulty_level: string;
  created_at: string;
}

export interface Response {
  id: string;
  user_id: string;
  question_id: string;
  overall_score: number;
  audio_url: string;
  feedback_json: any;
  metrics: any;
  created_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  category_id: string;
  questions_attempted: number;
  avg_score: number;
  badges: any;
  created_at: string;
}
