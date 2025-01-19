import getDbConnection from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId, email, fullName } = await req.json();
    console.log("Creating/updating user record:", { userId, email, fullName });

    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    const sql = await getDbConnection();

    // Upsert user record
    await sql`
      INSERT INTO users (
        user_id,
        email,
        full_name,
        status
      ) VALUES (
        ${userId},
        ${email},
        ${fullName},
        'active'
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        updated_at = CURRENT_TIMESTAMP
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("User creation error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "User creation failed",
      },
      { status: 500 }
    );
  }
}
