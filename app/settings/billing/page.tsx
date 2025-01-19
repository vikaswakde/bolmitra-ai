import { getUserSubscriptionStatus } from "@/lib/subscription";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import ManageSubscriptionForm from "@/components/subscription/ManageSubscriptionForm";

export default async function BillingPage() {
  const user = await currentUser();

  if (!user) {
    redirect("/");
  }

  const { isPro } = await getUserSubscriptionStatus(user.id);

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Subscription Management</h1>
          <p className="text-gray-500 mt-2">
            Manage your subscription and billing settings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 space-y-4">
          <div className="flex items-center gap-4">
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${
                isPro
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              Current Plan: {isPro ? "Pro" : "Free"}
            </div>
          </div>

          <ManageSubscriptionForm isPro={isPro} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
