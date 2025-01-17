import CategoryGrid from "@/components/category/CategoryGrid";
import { getCategories } from "@/lib/category-helpers";
import { getUserSubscriptionPlan } from "@/lib/payment-helpers";
import { Category } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { Sparkles } from "lucide-react";

export default async function Dashboard() {
  const user = await currentUser();
  const { data: categories = [] } = await getCategories();
  const userPlan = await getUserSubscriptionPlan(
    user?.emailAddresses[0]?.emailAddress
  );

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
              Welcome back, {user?.firstName || "User"}!
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600">
              Choose Your Practice Category
            </h1>

            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Select a category to start practicing and receive personalized
              AI-powered feedback to enhance your communication skills.
            </p>
          </div>

          <CategoryGrid
            categories={categories as Category[]}
            userPlan={userPlan}
          />
        </div>
      </div>
    </div>
  );
}

// // const hasUserCancelled = await hasCancelledSubscription(sql, email);

// // check if user exits
// const user = await doesUserExist(sql, email);

// // if user exits then update the user_id  & get plan type
// if (user) {
//   // get user_id from clerk user d
//   userId = clerkUser?.id;
//   if (userId) {
//     await updateUser(sql, userId, email);
//   }

//   priceId = user[0].price_id;
// }
// const { id: planTypeId = "starter", name: planTypeName } =
//   getPlanType(priceId);

// const isBasicPlan = planTypeId === "basic";
// const isProPlan = planTypeName === "pro";

// // check for number of posts per paln
// // for basic plan limit only max 3 uploads
// const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

// const isValidBasicPlan = isBasicPlan && posts.length < 3;

//   const user = await currentUser();

//   const { data: categories = [] } = await getCategories();

//   const userPlan = await getUserSubscriptionPlan(
//     user?.emailAddresses[0]?.emailAddress
//   );

//   return (
//     <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
//       <div className="flex flex-col gap-6">
//         <div className="text-center">
//           <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
//             Choose Your Practice Category
//           </h1>
//           <p className="mt-4 text-lg text-gray-600">
//             Select a category to start practicing and get AI-powered feedback
//           </p>
//         </div>

//         <CategoryGrid
//           categories={categories as Category[]}
//           userPlan={userPlan}
//         />
//       </div>
//     </div>
//   );
// }
