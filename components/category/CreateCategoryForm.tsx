"use client";

import { createCustomCategory } from "@/actions/category-actions";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "../ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const formSchema = z.object({
  name: z.string().min(3, "Category name must be at least 3 characters"),
  context: z
    .string()
    .min(20, "Please provide more context for better questions"),
  questionCount: z.number().min(1).max(20),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
});

type FormData = z.infer<typeof formSchema>;

interface CreateCategoryFormProps {
  category?: Category;
  mode?: "create" | "regenerate";
  onSuccess?: () => void;
}

export function CreateCategoryForm({
  category,
  mode = "create",
  onSuccess,
}: CreateCategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: category?.name ?? "",
      context: category?.context ?? "",
      questionCount: 5,
      difficulty: "intermediate",
    },
  });

  async function onSubmit(values: FormData) {
    try {
      setIsLoading(true);

      let result;
      if (mode === "regenerate" && category) {
        // Use the existing category name
        result = await createCustomCategory({
          ...values,
          name: category.name,
          categoryId: category.id,
        });
      } else {
        result = await createCustomCategory(values);
      }

      if (!result.success) {
        throw new Error(result.message);
      }

      form.reset();
      router.push("/dashboard");
      onSuccess?.();
    } catch (error) {
      console.error("Error creating category:", error);
      // You might want to add toast notification here
      toast({
        title: "Error creating category 😓",
      });
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {mode === "create" && (
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Technical Interviews"
                    {...field}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="context"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Training Context</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe what you want to practice..."
                  className="min-h-[100px] rounded-2xl"
                  {...field}
                  disabled={isLoading}
                />
              </FormControl>
              <FormDescription>
                The more context you provide, the better the AI-generated
                questions will be.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="questionCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Number of Questions</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={20}
                    {...field}
                    onChange={(e) => field.onChange(parseInt(e.target.value))}
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="difficulty"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="hover:bg-gray-200">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full rounded-2xl shadow-emerald-500 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {mode === "regenerate" ? "Regenerating..." : "Creating..."}
            </>
          ) : mode === "regenerate" ? (
            "Regenerate Questions"
          ) : (
            "Create Category"
          )}
        </Button>
      </form>
    </Form>
  );
}
