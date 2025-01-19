import getDbConnection from "./db";

export async function getCategories(userId?: string) {
  try {
    const sql = await getDbConnection();
    const categories = await sql`
      SELECT * FROM categories 
      WHERE 
        is_custom = false 
        OR (is_custom = true AND user_id = ${userId})
      ORDER BY created_at ASC
    `;
    return { success: true, data: categories };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching categories",
    };
  }
}

export async function getCategoryQuestions(categoryId: string) {
  try {
    const sql = await getDbConnection();
    console.log("Fetching questions for categoryId:", categoryId);

    // First, let's verify the category exists
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const category = await sql`
        SELECT * FROM categories WHERE id = ${categoryId}
      `;
    // console.log("Found category:", category);

    const questions = await sql`
      SELECT * FROM questions 
      WHERE category_id = ${categoryId}
      ORDER BY difficulty_level ASC, created_at ASC
    `;

    // console.log("Found questions:", questions);

    return { success: true, data: questions };
  } catch (error) {
    console.error("Error fetching questions:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error fetching questions",
    };
  }
}
