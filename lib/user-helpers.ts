import { NeonQueryFunction } from "@neondatabase/serverless";
// import { plansMap } from "./constans";

export async function hasCancelledSubscription(
  sql: NeonQueryFunction<false, false>,
  email: string
) {
  const query = await sql`SELECT * FROM users WHERE email = ${email}`;

  return query && query.length > 0;
}

export async function doesUserExist(
  sql: NeonQueryFunction<false, false>,
  email: string
) {
  const query = await sql`SELECT * FROM users where email = ${email}`;
  if (query && query.length > 0) {
    return query;
  }
  return null;
}

export function updateUser(
  sql: NeonQueryFunction<false, false>,
  email: string,
  userId: string
) {
  return sql`UPDATE users SET user_id = ${userId} WHERE email = ${email}`;
}

// export function getPlanType(priceId: string) {
//   if (priceId === null) return { id: "starter", name: "starter" };
//   const checkPlanType = plansMap.filter((plan) => plan.priceId === priceId);
//   return checkPlanType?.[0];
// }
