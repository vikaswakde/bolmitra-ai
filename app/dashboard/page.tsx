import CategoryGrid from "@/components/category/CategoryGrid";
import { getCategories } from "@/lib/category-helpers";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { Category } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";

export default async function Dashboard() {
  const user = await currentUser();
  const { data: categories = [] } = await getCategories(user?.id);
  console.log("This are all the categories", categories);

  // Get user's subscription status
  const { isPro } = await getUserSubscriptionStatus(user?.id || "");

  return (
    <div className="relative min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#e9d5ff,transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#ddd6fe,transparent)]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col gap-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 text-purple-700 text-sm mb-4">
              <Sparkles className="w-4 h-4" />
              {isPro ? (
                <span>Welcome back, {user?.firstName || "Pro User"}! ✨</span>
              ) : (
                <span>Welcome back, {user?.firstName || "User"}!</span>
              )}
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Choose Your Practice Category
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              {isPro
                ? "Access all categories and get personalized AI-powered feedback to enhance your communication skills."
                : "Select a category to start practicing. Upgrade to PRO for full access to all features."}
            </p>
          </div>

          <CategoryGrid categories={categories as Category[]} isPro={isPro} />
        </div>
      </div>
    </div>
  );
}
