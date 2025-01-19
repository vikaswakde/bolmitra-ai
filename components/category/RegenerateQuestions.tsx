"use client";

import { Category } from "@/lib/types";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { CreateCategoryForm } from "./CreateCategoryForm";

interface RegenerateQuestionsProps {
  category: Category;
  isPro: boolean;
  customCategoryCount?: number;
}

export function RegenerateQuestions({
  category,
  isPro,
  customCategoryCount = 0,
}: RegenerateQuestionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Only Pro users can regenerate questions
  if (!isPro) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        className="rounded-2xl bg-gray-200 shadow-lg border border-gray-500/50"
      >
        <Button variant="outline" size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Regenerate Questions</DialogTitle>
          <DialogDescription>
            This will replace all existing questions for this category.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm
          category={category}
          mode="regenerate"
          onSuccess={() => setIsOpen(false)}
          isPro={isPro}
          customCategoryCount={customCategoryCount}
        />
      </DialogContent>
    </Dialog>
  );
}
