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

    const { name, context, questionCount, difficulty } = await req.json();

    const sql = await getDbConnection();

    // Create new category
    const [category] = await sql`
      INSERT INTO categories (
        name,
        context,
        is_custom,
        description
      ) VALUES (
        ${name},
        ${context},
        ${true},
        ${context}
      )
      RETURNING *
    `;

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { success: false, message: "Failed to create category" },
      { status: 500 }
    );
  }
}
