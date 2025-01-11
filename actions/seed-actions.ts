import { initialCategories, sampleQuestions } from "@/lib/seed-data";
import { createCategory, addQuestion } from "@/lib/onboarding-helpers";
import getDbConnection from "@/lib/db";

export async function seedInitialData() {
  try {
    const sql = await getDbConnection();

    // Create categories and store their IDs
    const categoryIds = new Map();

    for (const category of initialCategories) {
      const [result] = await createCategory(
        sql,
        category.name,
        category.description
      );
      categoryIds.set(category.name, result.id);
    }

    // Add questions for each category
    for (const [categoryName, questions] of Object.entries(sampleQuestions)) {
      const categoryId = categoryIds.get(categoryName);

      for (const question of questions) {
        await addQuestion(
          sql,
          categoryId,
          question.questionText,
          question.difficultyLevel
        );
      }
    }

    return { success: true, message: "Initial data seeded successfully" };
  } catch (error) {
    console.error("Error seeding data:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error seeding data",
    };
  }
}
