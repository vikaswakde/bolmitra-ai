import React from "react";
import { Button } from "../ui/button";
import { ArrowRight, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

type Props = {};

const Banner = (props: Props) => {
  return (
    <section className="lg:max-w-6xl mx-auto flex flex-col items-center z-0 justify-center py-28 sm:pt-32 transition-all animate-in">
      <h1 className="py-6 text-center">
        Turn your words into{" "}
        <span className="underline underline-offset-8 decoration-dashed decoration-purple-200 px-2 text-purple-500">
          Captivating
        </span>
        blog posts
      </h1>
      <h2 className="text-center px-4 lg:px-0 lg:max-w-4xl">
        Convert your video or voice into a Blog Post in seconds with the power
        of AI.
      </h2>
      <Button
        variant={"link"}
        className="mt-6 text-xl rounded-full px-12 py-8 lg:mt-20 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 text-white font-bold shadow-lg hover:no-underline"
      >
        <Link href={"/pricing"} className="flex items-center gap-2">
          <span className="relative">Get LipiMitra</span>
          <ArrowRight className="w-8 h-8 font-bold animate-pulse" />
        </Link>
      </Button>
    </section>
  );
};

export default Banner;
