import getDbConnection from "@/lib/db";
import { useUser } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";

  const sql = await getDbConnection();

  // Update the user Id
  let userId = null;

  const user = await sql`SELECT * FROM users WHERE email = ${email}`;

  if (user && user.length > 0) {
    // Update the user_id in users table
    userId = clerkUser?.id;
    await sql`UPDATE users SET user_id = ${userId} WHERE email = ${email}`;
  }

  const response = await sql`SELECT version()`;

  return <section>{response[0].version}</section>;
}
