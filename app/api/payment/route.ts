import getDbConnection from "@/lib/db";
import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { NextResponse } from "next/server";

const paddle = new Paddle(process.env.PADDLE_API_KEY!, {
  environment: Environment.production,
});

export async function POST(req: Request) {
  try {
    const { userId, email, fullName } = await req.json();
    console.log("Creating transaction for user:", { userId, email, fullName });

    if (!userId || !email) {
      throw new Error("User ID and email are required");
    }

    const sql = await getDbConnection();

    // Create or update user record with pending status initially
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
        'pending'
      )
      ON CONFLICT (user_id) 
      DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name,
        status = 'pending'
    `;

    // Check for existing pending transaction
    const existingTnx = await sql`
      SELECT * FROM pending_transactions 
      WHERE user_id = ${userId} AND status = 'pending'
    `;

    if (existingTnx.length > 0) {
      console.log("Found existing pending transaction:", existingTnx[0]);
      return NextResponse.json({ tnx: existingTnx[0].paddle_transaction_id });
    }

    // Create Paddle transaction
    console.log("Creating new Paddle transaction...");
    const tnx = await paddle.transactions.create({
      items: [
        {
          quantity: 1,
          price: {
            name: "Bolmitra PRO",
            description: "Enjoy all the pro features",
            billingCycle: {
              interval: "month",
              frequency: 1,
            },
            unitPrice: {
              currencyCode: "USD",
              amount: "500",
            },
            product: {
              name: "Bolmitra AI Pro",
              description: "Get all the PRO Features.",
              taxCategory: "saas",
            },
          },
        },
      ],
    });

    console.log("Paddle transaction created:", tnx.id);

    // Create pending transaction record
    await sql`
      INSERT INTO pending_transactions (
        user_id,
        paddle_transaction_id,
        status
      ) VALUES (
        ${userId},
        ${tnx.id},
        'pending'
      )
    `;
    console.log("Pending transaction recorded in database");

    return NextResponse.json({ tnx: tnx.id });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Payment creation failed",
      },
      { status: 500 }
    );
  }
}
