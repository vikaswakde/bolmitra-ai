import Stripe from "stripe";
import getDbConnection from "./db";

export async function getUserSubscriptionPlan(email: string | undefined) {
  try {
    if (!email) return "starter";

    const sql = await getDbConnection();
    const user = await sql`
      SELECT price_id, status 
      FROM users 
      WHERE email = ${email}
    `;

    if (!user || user.length === 0) {
      return "starter";
    }

    const { price_id: priceId, status } = user[0];

    // If subscription is cancelled or no price ID, return starter plan
    if (status === "cancelled" || !priceId) {
      return "starter";
    }

    // Map price IDs to plan names
    // You'll need to replace these with your actual price IDs from Stripe
    const priceIdToPlan: Record<string, string> = {
      price_basic: "basic",
      price_pro: "pro",
    };

    return priceIdToPlan[priceId] || "starter";
  } catch (error) {
    console.error("Error getting user subscription plan:", error);
    return "starter"; // Fallback to starter plan on error
  }
}

export async function handleCheckoutSessionCompleted({
  session,
  stripe,
}: {
  session: Stripe.Checkout.Session;
  stripe: Stripe;
}) {
  // exectue, create and update user
  const customerId = session.customer as string;
  const priceId = session.line_items?.data[0].price?.id;

  const customer = await stripe.customers.retrieve(customerId);
  const sql = await getDbConnection();

  if ("email" in customer && priceId) {
    // Create or Update User
    await createOrUpdateUser(sql, customer, customerId);

    // Update User Subscription
    await updateUserSubscription(sql, priceId, customer.email as string);

    // Insert the payment
    await insertPayment(sql, session, priceId, customer.email as string);
  }
}

export async function handleSubscriptionDeleted({
  subscriptionId,
  stripe,
}: {
  subscriptionId: string;
  stripe: Stripe;
}) {
  try {
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const sql = await getDbConnection();
    await sql`UPDATE users SET status = "cancelled" WHERE customer_id = ${subscription.customer}`;
  } catch (error) {
    console.error("Error in Deleting Subscription", error);
  }
}

async function createOrUpdateUser(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any,
  customer: Stripe.Customer,
  customerId: string
) {
  try {
    const user = await sql`SELECT * FROM users WHERE email = ${customer.email}`;
    if (user.length === 0) {
      await sql`INSERT INTO users (email, full_name, customer_id) VALUES (${customer.email}, ${customer.name}, ${customerId})`;
    }
  } catch (error) {
    console.error("Error in instering user", error);
  }
}

async function updateUserSubscription(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any,
  priceId: string,
  email: string
) {
  try {
    await sql`UPDATE users SET price_id = ${priceId}, status = 'active' where email=${email}`;
  } catch (err) {
    console.error("Error in Updating Subscription", err);
  }
}

async function insertPayment(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sql: any,
  session: Stripe.Checkout.Session,
  priceId: string,
  customerEmail: string
) {
  try {
    await sql`INSERT INTO payments (amount, status, stripe_payment_id, price_id, user_email) VALUES(${session.amount_total}, ${session.status}, ${session.id}, ${priceId}, ${customerEmail})`;
  } catch (error) {
    console.error("Error Inserting Payment", error);
  }
}
