import getDbConnection from "./db";

export async function getUserSubscriptionStatus(userId: string) {
  const sql = await getDbConnection();
  
  const user = await sql`
    SELECT u.status, s.plan_type, s.status as subscription_status
    FROM users u
    LEFT JOIN subscriptions s ON u.user_id = s.user_id
    WHERE u.user_id = ${userId}
  `;

  if (!user.length) return { isPro: false, status: 'inactive' };

  return {
    isPro: user[0].status === 'active' && user[0].plan_type === 'pro',
    status: user[0].status
  };
} 