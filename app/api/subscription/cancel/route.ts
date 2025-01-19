import getDbConnection from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    // Update subscription status in your database
    const sql = await getDbConnection();
    await sql`
      UPDATE subscriptions 
      SET status = 'cancelled',
          updated_at = CURRENT_TIMESTAMP 
      WHERE user_id = ${userId}
      AND status = 'active'
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error cancelling subscription:", error);
    return NextResponse.json(
      { error: "Failed to cancel subscription" },
      { status: 500 }
    );
  }
}
