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
        className="relative rounded-2xl border-2 border-purple-400 hover:border-purple-500 shadow-md hover:shadow-xl transition-all duration-200"
      >
        <Button
          variant="outline"
          className="h-[200px] w-full bg-gradient-to-br from-purple-400 via-zinc-300 to-gray-200 hover:from-purple-300 hover:via-zinc-300 hover:to-purple-300 transition-colors duration-700"
          disabled={isDisabled}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
              // Add your subscription redirect logic here
              window.location.href = "/subscription";
            }
          }}
        >
          {!isPro && (
            <div className="absolute top-3 right-3 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium">
              FREE
            </div>
          )}
          <div className="flex flex-col items-center gap-6">
            <Plus className=" text-purple-500  min-h-10 min-w-10  " size={20} />
            <div className="text-xl font-semibold text-purple-700">
              Create Custom Category
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            Create a personalized category with AI-generated practice questions
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
