import CategoryGrid from "@/components/category/CategoryGrid";
import { getCategories } from "@/lib/category-helpers";
import { getUserSubscriptionPlan } from "@/lib/payment-helpers";
import { Category } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  // const clerkUser = await currentUser();

  // const email = clerkUser?.emailAddresses[0].emailAddress ?? "";

  // const sql = await getDbConnection();

  // let userId = null;
  // let priceId = null;

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

  const user = await currentUser();
  const { data: categories = [] } = await getCategories();
  const userPlan = await getUserSubscriptionPlan(
    user?.emailAddresses[0]?.emailAddress
  );

  return (
    <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
      <div className="flex flex-col gap-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your Practice Category
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Select a category to start practicing and get AI-powered feedback
          </p>
        </div>

        <CategoryGrid
          categories={categories as Category[]}
          userPlan={userPlan}
        />
      </div>
    </div>
  );
}
