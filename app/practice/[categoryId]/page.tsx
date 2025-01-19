import PracticeSession from "@/components/practice/PracticeSession";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getUserSubscriptionStatus } from "@/lib/subscription";
import { getCategoryQuestions } from "@/lib/category-helpers";
import { Question } from "@/lib/types";

const PracticePage = async (props: {
  params: Promise<{ categoryId: string }>;
}) => {
  const params = await props.params;
  const { categoryId } = params;

  const user = await currentUser();
  if (!user) redirect("/sign-in");

  const { isPro } = await getUserSubscriptionStatus(user?.id || "");
  const { data: questions = [] } = await getCategoryQuestions(categoryId);

  return (
    <div className="max-h-fit bg-gradient-to-b from-purple-50 to-white space-y-4">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-100 rounded-full blur-3xl opacity-20 translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Categories
          </Link>

          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 rounded-lg bg-purple-100">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              Practice Session
            </h1>
          </div>

          <p className="text-gray-600">
            Take your time to answer each question clearly and naturally.
          </p>
        </div>

        <PracticeSession
          questions={questions as Question[]}
          categoryId={categoryId}
          isPro={isPro}
        />
      </div>
    </div>
  );
};

export default PracticePage;
