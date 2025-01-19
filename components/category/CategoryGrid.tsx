"use client";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  BookOpenIcon,
  MicIcon,
  PresentationIcon,
} from "lucide-react";
import Link from "next/link";
import { CreateCategoryButton } from "./CreateCategoryButton";
import { DeleteCategory } from "./DeleteCategory";
import { RegenerateQuestions } from "./RegenerateQuestions";
// import { useRouter } from "next/navigation";

interface CategoryGridProps {
  categories: Category[];
  isPro: boolean;
}

const categoryIcons = {
  "Interview Prep": <MicIcon className="w-6 h-6" />,
  "Public Speaking": <PresentationIcon className="w-6 h-6" />,
  "Sales Pitch": <BookOpenIcon className="w-6 h-6" />,
};

export default function CategoryGrid({ categories, isPro }: CategoryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {categories.map((category, index) => {
        const isLocked = !isPro && index > 3;
        return (
          <div
            key={category.id}
            className={cn(
              "relative group rounded-2xl border b border-purple-400 shadow-inner p-6 hover:border-purple-500 hover:shadow-lg transition-all",
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
                  "mt-4 inline-flex items-center text-purple-600 hover:text-purple-800 border px-2 py-1  rounded-2xl border-purple-600/40 shadow-lg",
                  isLocked && "pointer-events-none opacity-50"
                )}
              >
                Start Practice
                <ArrowRightIcon className="ml-2 w-4 h-4" />
              </Link>

              {/* Only show regenerate option for custom categories */}
              {category.is_custom && (
                <div className="flex items-center">
                  <RegenerateQuestions
                    category={category}
                    isPro={isPro}
                    customCategoryCount={
                      categories.filter((c) => c.is_custom).length
                    }
                  />
                  <DeleteCategory category={category} isPro={isPro} />
                </div>
              )}
            </div>
          </div>
        );
      })}
      <CreateCategoryButton
        isPro={isPro}
        customCategoryCount={categories.filter((c) => c.is_custom).length}
      />
    </div>
  );
}
