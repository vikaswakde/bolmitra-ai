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
}

export function RegenerateQuestions({ category }: RegenerateQuestionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="rounded-2xl">
        <Button variant="outline" size="sm" className="w-full">
          <RefreshCw className="mr-2 h-4 w-4" />
          Questions
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Regenerate Questions</DialogTitle>
          <DialogDescription>
            This will replace all existing questions for this category. This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm
          category={category}
          mode="regenerate"
          onSuccess={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
