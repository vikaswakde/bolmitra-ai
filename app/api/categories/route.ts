import getDbConnection from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
// import { getUserSubscriptionPlan } from "@/lib/payment-helpers";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    // Check if user has pro plan
    // const userPlan = await getUserSubscriptionPlan(
    //   user.emailAddresses[0]?.emailAddress
    // );
    // if (userPlan !== "pro") {
    //   return new NextResponse("Pro plan required", { status: 403 });
    // }
    const { name, context, categoryId } = await req.json();

    const sql = await getDbConnection();

    let category;

    if (categoryId) {
      console.log("Regenerating questions for category:", categoryId);
      // Update existing category
      [category] = await sql`
        UPDATE categories 
        SET context = ${context},
            description = ${context}
        WHERE id = ${categoryId}
        AND (user_id = ${userId} OR user_id IS NULL)
        RETURNING *
      `;
    } else {
      console.log("Creating new category");
      // Create new category
      [category] = await sql`
        INSERT INTO categories (
          name,
          context,
          is_custom,
          description,
          user_id
        ) VALUES (
          ${name},
          ${context},
          ${true},
          ${context},
          ${userId}
        )
        RETURNING *
      `;
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating/updating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create/update category" },
      { status: 500 }
    );
  }
}
