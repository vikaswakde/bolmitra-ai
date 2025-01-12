import PracticeSession from "@/components/practice/PracticeSession";
import { getCategoryQuestions } from "@/lib/category-helpers";
import { getUserSubscriptionPlan } from "@/lib/payment-helpers";
import { Question } from "@/lib/types";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const PracticePage = async (props: {
  params: Promise<{ categoryId: string }>;
}) => {
  const params = await props.params;

  const { categoryId } = params;

  const user = await currentUser();
  if (!user) redirect("/sign-in");
  console.log("this is category id", categoryId);

  const userPlan = await getUserSubscriptionPlan(
    user?.emailAddresses[0]?.emailAddress
  );
  const { data: questions = [] } = await getCategoryQuestions(categoryId);
  // for free users, limit questions to 3 per day
  const limitedQuestions =
    userPlan === "free" ? questions.slice(0, 3) : questions;
  return (
    <div>
      <PracticeSession
        questions={limitedQuestions as Question[]}
        categoryId={categoryId}
        userPlan={userPlan || "free"}
      />
    </div>
  );
};

export default PracticePage;
