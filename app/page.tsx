import Banner from "@/components/home/Banner";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import { Button } from "@/components/ui/button";
import { DotIcon } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <main className="mx-auto w-full inset-0 h-full bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] [background-size:16px_16px]">
      <div className="relative isolate">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72rem]"
          />
        </div>
      </div>
      <Banner />
      <div className="flex items-center justify-center">
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
      </div>
      <HowItWorks />
      <div className="flex items-center justify-center">
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
      </div>
      <Pricing />
      <footer className="flex flex-col items-center justify-center bg-gray-200/20 h-20 py-24 px-12 z-20 relative overflow-hidden">
        <p>All Rights Reserved, {new Date().getFullYear()} </p>
        <p className="text-sm py-2">
          <a href="https://x.com/@vikaswakde42" target="_blank">
            Built 💚 by{" "}
            <span className="underline decoration-dashed">Vikas</span>
          </a>
        </p>
      </footer>
    </main>
  );
}
