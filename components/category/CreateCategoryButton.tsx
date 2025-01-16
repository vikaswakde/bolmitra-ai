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
  userPlan: string;
}

export function CreateCategoryButton({ userPlan }: CreateCategoryButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild className="rounded-2xl border-gray-200 shadow-sm">
        <Button
          variant="outline"
          className="h-[200px] w-full"
          disabled={userPlan == "pro"}
        >
          <div className="flex flex-col items-center gap-4">
            <Plus className="h-8 w-8" />
            <div className="text-xl font-semibold">Create Custom Category</div>
            <div className="text-sm text-muted-foreground">
              Create your own practice category
            </div>
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Custom Category</DialogTitle>
          <DialogDescription>
            Create a personalized category with AI-generated practice questions.
          </DialogDescription>
        </DialogHeader>
        <CreateCategoryForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
