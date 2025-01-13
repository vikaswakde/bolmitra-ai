import BgBlur from "@/components/common/BgBlur";
import Banner from "@/components/home/Banner";
import Footer from "@/components/home/Footer";
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
      <div className="flex items-center justify-center">
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
        <DotIcon className="text-purple-400" />
      </div>
      <Footer />
    </main>
  );
}
