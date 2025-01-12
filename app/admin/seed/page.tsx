/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

import React, { useState } from "react";

const SeedPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const handleSeed = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/seed", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Faield to seed data");
      }

      const result = await response.json();
      toast({
        title: "Database seeded successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to seed Database",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="container mx-auto py-10 flex w-full items-center  flex-col justify-center
    "
    >
      <h1 className="text-2xl font-bold mb-4">Database Seeding</h1>
      <Button onClick={handleSeed} disabled={isLoading}>
        {isLoading ? "Seeding..." : "Seed Database"}
      </Button>
    </div>
  );
};

export default SeedPage;
