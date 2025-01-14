import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  BookOpenIcon,
  MicIcon,
  PresentationIcon
} from "lucide-react";
import Link from "next/link";
import { CreateCategoryButton } from "./CreateCategoryButton";
import { DeleteCategory } from "./DeleteCategory";
import { RegenerateQuestions } from "./RegenerateQuestions";

interface CategoryGridProps {
  categories: Category[];
  userPlan: string;
}

const categoryIcons = {
  "Interview Prep": <MicIcon className="w-6 h-6" />,
  "Public Speaking": <PresentationIcon className="w-6 h-6" />,
  "Sales Pitch": <BookOpenIcon className="w-6 h-6" />,
};

export default function CategoryGrid({
  categories,
  userPlan,
}: CategoryGridProps) {
  const isPro = userPlan !== "pro";

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => {
        const isLocked = !isPro && index > 0;
        return (
          <div
            key={category.id}
            className={cn(
              "relative group rounded-2xl border b border-gray-200  shadow-sm p-6 hover:border-purple-200 transition-all",
              isLocked && "opacity-60"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {categoryIcons[category.name as keyof typeof categoryIcons]}
                <h3 className="text-lg font-semibold">{category.name}</h3>
              </div>
              {isLocked && (
                <div className="absolute top-4 right-4 bg-amber-100 text-amber-700 px-2 py-1 rounded text-sm border-purple-500/40 border">
                  Pro only
                </div>
              )}
            </div>
            <p className="mt-2 text-gray-600">{category.description}</p>
            <div className="flex  items-baseline justify-between  w-full gap-1">
              <Link
                href={isLocked ? "/#pricing" : `/practice/${category.id}`}
                className={cn(
                  "mt-4 inline-flex items-center text-purple-600 hover:text-purple-700 border px-2 py-1  rounded-2xl border-purple-600/40 shadow-lg",
                  isLocked && "pointer-events-none opacity-50"
                )}
              >
                Start Practice
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>
              {/* Only show regenerate option for custom categories */}
              {category.is_custom && (
                <div>
                  <RegenerateQuestions category={category} />
                  <DeleteCategory category={category} />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <CreateCategoryButton userPlan={userPlan} />
    </div>
  );
}
