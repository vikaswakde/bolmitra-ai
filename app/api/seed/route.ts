import { seedInitialData } from "@/actions/seed-actions";
import { auth } from "@clerk/nextjs/server";

export async function POST() {
  try {
    const { userId } = await auth();

    // only allow authenticated users
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const result = await seedInitialData();

    if (!result.success) {
      return new Response(result.message, { status: 500 });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
