"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import DynamicPayment from "../payment/DynamicPayment";

interface ManageSubscriptionFormProps {
  isPro: boolean;
  userId: string;
}

export default function ManageSubscriptionForm({
  isPro,
  userId,
}: ManageSubscriptionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCancelSubscription = async () => {
    try {
      setIsLoading(true);

      // Make API call to cancel subscription
      const response = await fetch("/api/subscription/cancel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to cancel subscription");
      }

      toast({
        title: "Subscription cancelled",
        description:
          "Your subscription will remain active until the end of the billing period.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel subscription. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {isPro ? (
        <>
          <div className="text-sm text-gray-500">
            Your Pro subscription gives you access to all features and unlimited
            custom categories.
          </div>
          <Button
            variant="destructive"
            onClick={handleCancelSubscription}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Cancelling...
              </>
            ) : (
              "Cancel Subscription"
            )}
          </Button>
        </>
      ) : (
        <>
          <div className="text-sm text-gray-500">
            Upgrade to Pro to unlock all features and create unlimited custom
            categories.
          </div>
          <DynamicPayment userId={userId} />
        </>
      )}
    </div>
  );
}
