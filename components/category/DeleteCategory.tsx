"use client";

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
import { Loader2, Trash2 } from "lucide-react";
import { Category } from "@/lib/types";
import { deleteCategory } from "@/actions/category-actions";
import { useRouter } from "next/navigation";

interface DeleteCategoryProps {
  category: Category;
}

export function DeleteCategory({ category }: DeleteCategoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    try {
      setIsLoading(true);
      const result = await deleteCategory(category.id);

      if (!result.success) {
        throw new Error(result.message);
      }

      setIsOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="absolute top-2 right-2 w-fit items-center rounded-[28px] rounded-tr-[12px]   bg-transparent shadow-inner border border-gray-400/50 border-dashed"
        >
          <Trash2 className="h-4 w-4 text-red-500 " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete &quot;{category.name}&quot;? This
            will permanently delete all questions and responses associated with
            this category. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsOpen(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
