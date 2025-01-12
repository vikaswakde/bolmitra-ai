/* eslint-disable @typescript-eslint/no-explicit-any */

export async function createCategory(
  sql: any,
  name: string,
  description: string
) {
  return sql`
      INSERT INTO categories (name, description)
      VALUES (${name}, ${description})
      RETURNING id
    `;
}

export async function addQuestion(
  sql: any,
  categoryId: string,
  questionText: string,
  difficultyLevel: string
) {
  return sql`
      INSERT INTO questions (category_id, question_text, difficulty_level)
      VALUES (${categoryId}, ${questionText}, ${difficultyLevel})
      RETURNING id
    `;
}

export async function saveResponse(
  sql: any,
  userId: string,
  questionId: string,
  audioUrl: string,
  overallScore: number,
  feedback: any,
  metrics: any
) {
  return sql`
      INSERT INTO responses (user_id, question_id, audio_url, feedback_json, metrics, overall_score)
      VALUES (${userId}, ${questionId}, ${audioUrl}, ${feedback}, ${metrics} ${overallScore})
      RETURNING id
    `;
}

export async function updateUserProgress(
  sql: any,
  userId: string,
  categoryId: string,
  questionsAttempted: number,
  avgScore: number,
  badges: any
) {
  return sql`
      INSERT INTO user_progress (user_id, category_id, questions_attempted, avg_score, badges)
      VALUES (${userId}, ${categoryId}, ${questionsAttempted}, ${avgScore}, ${badges})
      ON CONFLICT (user_id, category_id)
      DO UPDATE SET
        questions_attempted = EXCLUDED.questions_attempted,
        avg_score = EXCLUDED.avg_score,
        badges = EXCLUDED.badges
      RETURNING id
    `;
}
