import BgBlur from "@/components/common/BgBlur";
import { Badge } from "@/components/ui/badge";
import UpgradeYourPlan from "@/components/upload/UpgradeYourPlan";
import UploadForm from "@/components/upload/UploadForm";
import getDbConnection from "@/lib/db";
import { doesUserExist, getPlanType, updateUser } from "@/lib/user-helpers";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
  const clerkUser = await currentUser();

  const email = clerkUser?.emailAddresses[0].emailAddress ?? "";

  const sql = await getDbConnection();

  let userId = null;
  let priceId = null;

  // const hasUserCancelled = await hasCancelledSubscription(sql, email);

  // check if user exits
  const user = await doesUserExist(sql, email);

  // if user exits then update the user_id  & get plan type
  if (user) {
    // get user_id from clerk user d
    userId = clerkUser?.id;
    if (userId) {
      await updateUser(sql, userId, email);
    }

    priceId = user[0].price_id;
  }
  const { id: planTypeId = "starter", name: planTypeName } =
    getPlanType(priceId);

  const isBasicPlan = planTypeId === "basic";
  const isProPlan = planTypeName === "pro";

  // check for number of posts per paln
  // for basic plan limit only max 3 uploads
  const posts = await sql`SELECT * FROM posts WHERE user_id = ${userId}`;

  const isValidBasicPlan = isBasicPlan && posts.length < 3;

  return (
    <BgBlur>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          <Badge className="px-4 py-1 text-lg capitalize font-semibold bg-gradient-to-r from-purple-700 to to-pink-800 text-white">
            {planTypeName}
          </Badge>
          <h1 className="capitalize text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Start Creating Amazing Content
          </h1>
          <p className="mt-2 text-lg leading-8 text-gray-600 max-w-2xl text-center">
            Upload your <span className="font-bold">Audio</span> or{" "}
            <span className="font-bold">Video</span> file and let our <br />{" "}
            <span className="underline underline-offset-4 decoration-dashed  ">
              AI do the magic
            </span>{" "}
            🪄
          </p>
          <p>
            You get{" "}
            <span className="font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded-md">
              {isBasicPlan ? "3" : isProPlan ? "Unlimited" : "0"} blog Posts
            </span>{" "}
            as part of the {""}{" "}
            <span className="font-bold capitalize text-amber-900">
              {planTypeName}
            </span>{" "}
            Plan.
          </p>

          {isValidBasicPlan || isProPlan ? <UploadForm /> : <UpgradeYourPlan />}
        </div>
      </div>
    </BgBlur>
  );
}
