import React from "react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const Banner = () => {
  return (
    <section className="lg:max-w-6xl mx-auto flex flex-col items-center z-0 justify-center py-28 sm:pt-32 transition-all animate-in">
      <h1 className="py-6 text-center">
        Transform your audio into{" "}
        <span className="underline underline-offset-8 decoration-dashed decoration-purple-200 px-2 text-purple-500">
          Insightful
        </span>
        feedback
      </h1>
      <h2 className="text-center px-4 lg:px-0 lg:max-w-4xl">
        Leverage the power of AI to analyze your voice and receive personalized
        insights in seconds.
      </h2>
      <Button
        variant={"link"}
        className="mt-6 text-xl rounded-full px-12 py-8 lg:mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg hover:no-underline"
      >
        <Link href={"/pricing"} className="flex items-center gap-2">
          <span className="relative">Get Started with LipiMitra</span>
          <ArrowRight className="w-8 h-8 font-bold animate-pulse" />
        </Link>
      </Button>
    </section>
  );
};

export default Banner;
