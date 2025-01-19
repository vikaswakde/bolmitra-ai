"use client";

import { Plus } from "lucide-react";
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
import { useState } from "react";

interface CreateCategoryButtonProps {
  isPro: boolean;
  customCategoryCount: number;
}

export function CreateCategoryButton({
  isPro,
  customCategoryCount,
}: CreateCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const isDisabled = !isPro && customCategoryCount >= 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        asChild
        className="rounded-2xl border-purple-400 hover:border-purple-500 shadow-inner hover:shadow-lg bg-transparent hover:bg-transparent"
      >
        <Button
          variant="outline"
          className="h-[200px] w-full"
          disabled={isDisabled}
        >
          <div className="flex flex-col items-center gap-4">
            <Plus className="h-8 w-8" />
            <div className="text-xl font-semibold">Create Custom Category</div>
            {!isPro && (
              <div className="text-sm text-muted-foreground">
                {customCategoryCount >= 1
                  ? "Upgrade to Pro to create more categories"
                  : "Free users can create 1 custom category"}
              </div>
            )}
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            {isPro
              ? "Create a personalized category with AI-generated practice questions."
              : "Free users can create one custom category with up to 2 questions."}
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm
          onSuccess={() => setIsOpen(false)}
          isPro={isPro}
          customCategoryCount={customCategoryCount}
        />
      </DialogContent>
    </Dialog>
  );
}
