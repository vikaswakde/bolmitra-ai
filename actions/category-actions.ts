"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";

interface CreateCategoryInput {
  name: string;
  context: string;
  questionCount: number;
  difficulty: string;
  categoryId?: string;
}

export async function createCustomCategory(data: CreateCategoryInput) {
  console.log("Server Action: createCustomCategory called with:", data);
  try {
    console.log("data we got from form", data);
    // Get the host from headers
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    // Get auth token
    const { getToken } = await auth();
    const token = await getToken();

    // Create category
    const categoryResponse = await fetch(
      `${protocol}://${host}/api/categories`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    console.log("response we got from categoryResponse =>", categoryResponse);

    if (!categoryResponse.ok) {
      throw new Error("Failed to create category");
    }

    const { data: category } = await categoryResponse.json();

    console.log("we are passing this data to generate questions =>", data);

    // Generate questions
    const questionsResponse = await fetch(
      `${protocol}://${host}/api/questions/generate`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          categoryId: category.id,
          ...data,
        }),
      }
    );

    console.log("data we got from questionsResponse =>", questionsResponse);

    if (!questionsResponse.ok) {
      throw new Error("Failed to generate questions");
    }

    revalidatePath("/dashboard");
    return { success: true, data: category };
  } catch (error) {
    console.error("Error in createCustomCategory:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    const headersList = await headers();
    const host = headersList.get("host");
    const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

    const { getToken } = await auth();
    const token = await getToken();

    const response = await fetch(
      `${protocol}://${host}/api/categories/${categoryId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete category");
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteCategory:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
