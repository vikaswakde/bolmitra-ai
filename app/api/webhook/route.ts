import getDbConnection from "@/lib/db";
import { Environment, EventName, Paddle } from "@paddle/paddle-node-sdk";

import { NextResponse } from "next/server";

const paddle = new Paddle(process.env.PADDLE_WEBHOOK_SECRET!, {
  environment: Environment.production,
});

export async function POST(req: Request) {
  const signature = (req.headers.get("paddle-signature") as string) || "";
  // req.body should be of type `buffer`, convert to string before passing it to `unmarshal`.
  // If express returned a JSON, remove any other middleware that might have processed raw request to object
  const rawRequestBody = (await req.text()) || "";
  // Replace `WEBHOOK_SECRET_KEY` with the secret key in notifications from vendor dashboard}
  const secretKey = process.env.PADDLE_WEBHOOK_SECRET || "";

  try {
    if (!signature || !rawRequestBody) {
      console.log("Signature or body missing");
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Validate and unmarshal the webhook
    const eventData = await paddle.webhooks.unmarshal(
      rawRequestBody,
      secretKey,
      signature
    );

    const sql = await getDbConnection();

    switch (eventData.eventType) {
      case EventName.SubscriptionActivated:
        await sql`
          UPDATE subscriptions 
          SET 
            status = 'active',
            updated_at = CURRENT_TIMESTAMP
          WHERE paddle_subscription_id = ${eventData.data.id}
        `;
        break;

      case EventName.SubscriptionCanceled:
        await sql`
          UPDATE subscriptions 
          SET 
            status = 'cancelled',
            updated_at = CURRENT_TIMESTAMP
          WHERE paddle_subscription_id = ${eventData.data.id}
        `;
        break;

      case EventName.TransactionCompleted:
        // First, check if this is a new subscription transaction
        const pendingTnx = await sql`
          SELECT * FROM pending_transactions 
          WHERE paddle_transaction_id = ${eventData.data.id}
        `;

        if (pendingTnx.length > 0) {
          // Create subscription record
          await sql`
            INSERT INTO subscriptions (
              user_id,
              paddle_subscription_id,
              paddle_customer_id,
              plan_type,
              status,
              current_period_start,
              current_period_end
            ) VALUES (
              ${pendingTnx[0].user_id},
              ${eventData.data.subscriptionId},
              ${eventData.data.customerId},
              'pro',
              'active',
              ${new Date()},
              ${new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
            )
          `;

          // Update pending transaction status
          await sql`
            UPDATE pending_transactions 
            SET status = 'completed' 
            WHERE paddle_transaction_id = ${eventData.data.id}
          `;

          // Record payment
          await sql`
            INSERT INTO payments (
              subscription_id,
              paddle_transaction_id,
              amount,
              currency,
              status
            ) VALUES (
              (SELECT id FROM subscriptions WHERE paddle_subscription_id = ${eventData.data.subscriptionId}),
              ${eventData.data.id},
              ${eventData.data.payments[0].amount},
              ${eventData.data.currencyCode},
              'completed'
            )
          `;
        }
        break;

      case EventName.TransactionBilled:
        if ("subscriptionId" in eventData.data) {
          // Update subscription period
          await sql`
            UPDATE subscriptions
            SET 
              current_period_start = ${new Date()},
              current_period_end = ${new Date(
                Date.now() + 30 * 24 * 60 * 60 * 1000
              )},
              updated_at = CURRENT_TIMESTAMP
            WHERE paddle_subscription_id = ${eventData.data.subscriptionId}
          `;
        }
        break;
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }
}
