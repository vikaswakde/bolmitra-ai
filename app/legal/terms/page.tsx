import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bot } from "lucide-react";

export default function TermsPage() {
  return (
    <>
      <nav className="fixed top-0 w-full border-b border-gray-700 bg-gray-900/50 backdrop-blur-md z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-blue-500" />
            <span className="text-xl font-bold text-white">BolMitra AI</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 pt-32 pb-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">
            Terms of Service
          </h1>
          <div className="prose prose-invert">
            <p className="text-gray-300">
              Last updated: {new Date().toLocaleDateString()}
            </p>
            {/* Add detailed terms content here */}
            <h2 className="text-2xl text-white mt-6">1. Service Description</h2>
            <p className="text-gray-300">
              SakhiAI provides an AI-powered communication and analysis service.
              Users can record the audio and get analysis through our AI
              interface.
            </p>
            <h2 className="text-2xl text-white mt-6">2. Subscription Terms</h2>
            <p className="text-gray-300">
              - Free tier:[$0/month] Limited category and questions slection.
              <br />- Pro subscription: [$10/month] : with more categories to
              choose and detailed analysis reports.
            </p>{" "}
          </div>
        </div>
      </div>
    </>
  );
}
