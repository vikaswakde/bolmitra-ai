import BgBlur from "@/components/common/BgBlur";
import Banner from "@/components/home/Banner";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import { DotIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto w-full inset-0 h-full bg-[radial-gradient(#e5e7eb_1px, transparent_1px)] [background-size:16px_16px]">
      <BgBlur />
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
        <p>All Rights Reserved, 2025</p>
        <p className="text-sm py-2">
          <a href="https://x.com/@vikaswakde42" target="_blank">
            Built 💚 by{" "}
            <span className="underline decoration-dashed underline-offset-2">
              Vikas
            </span>
          </a>
        </p>
      </footer>
    </main>
  );
}
