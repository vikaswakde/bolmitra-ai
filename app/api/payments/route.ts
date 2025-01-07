import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  // webhook funcationality
  const payload = await req.text();

  const sig = req.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      payload,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // Handle the event
    switch (event.type) {
      case "checkout.session.completed": {
        const session = await stripe.checkout.sessions.retrieve(
          event.data.object.id,
          {
            expand: ["line_items"],
          }
        );
        console.log("session ===> ", { session });

        // connect to the db and create or update user
        //
        //
        break;
      }
      case "customer.subscription.deleted": {
        // connect to db
        const subscriptionId = event.data.object.id;

        console.log("subscritpionId", subscriptionId);
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return NextResponse.json({
      status: "success",
    });
  } catch (err) {
    return NextResponse.json({ status: "Failed", err });
  }
}
