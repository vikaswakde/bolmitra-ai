import BgBlur from "@/components/common/BgBlur";
import EnhancedHero from "@/components/home/EnhancedHero";
import Features from "@/components/home/Features";
import Footer from "@/components/home/Footer";
import HowItWorks from "@/components/home/HowItWorks";
import Pricing from "@/components/home/Pricing";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <main className="relative">
      <BgBlur />
      <EnhancedHero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <Pricing />
      <Footer />
    </main>
  );
}
