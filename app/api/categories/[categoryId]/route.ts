import getDbConnection from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  props: { params: Promise<{ categoryId: string }> }
) {
  const params = await props.params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const sql = await getDbConnection();

    // Delete in correct order to respect foreign key constraints

    // 1. Delete responses first
    await sql`
      DELETE FROM responses 
      WHERE question_id IN (
        SELECT id FROM questions WHERE category_id = ${params.categoryId}
      )
    `;

    // 2. Delete questions
    await sql`
      DELETE FROM questions 
      WHERE category_id = ${params.categoryId}
    `;

    // 3. Delete user_progress entries
    await sql`
      DELETE FROM user_progress 
      WHERE category_id = ${params.categoryId}
    `;

    // 4. Finally delete the category
    await sql`
      DELETE FROM categories 
      WHERE id = ${params.categoryId}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete category" },
      { status: 500 }
    );
  }
}
